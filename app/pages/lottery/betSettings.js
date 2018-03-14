import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Slider,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
} from 'react-native'
import Immutable from 'immutable'
import Sound from '../../components/clickSound'
import dismissKeyboard from '../../utils/dismissKeyboard'
import Config from '../../config/global'
import { monetaryUnit } from '../../utils/config'
import Modal from 'react-native-modalbox'

const isIos = Platform.OS === 'ios'

export default class BetSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sliderValue: 0,
      isHandlingBetConfirm: false,
    }
  }

  subNumber = (number) => {
    const length = 3
    let tempNum = 0
    let s1 = number + ''
    let start = s1.indexOf('.')
    if(start !== -1 && s1.substr(start + length + 1, 1) >= 5)
      tempNum = 1
    let temp = Math.pow(10, length)
    let s = Math.floor(number * temp) + tempNum
    return (s / temp).toFixed(3)
  }

  modalOnClose = () => {
    this.setState({
      sliderValue: 0,
    })
  }

  render() {
    const { sliderValue, isHandlingBetConfirm } = this.state
    const { show, orderInfo, setWinShow, setUnitPrice, setUnit, currentSubPlay, rebatePoint, currentPlay, betConfirm } = this.props
    if (!currentSubPlay) {
      return false
    }
    let rebate = ((rebatePoint || currentSubPlay.rebate_point) * sliderValue).toFixed(1) || 0
    let odds = 0, bonus = 0, maxValue = 0
    if (currentSubPlay.max_odds) {
      const max = currentSubPlay.max_odds
      const min = currentSubPlay.min_odds
      const rebateP = currentSubPlay.rebate_point
      if (max.split(',').length > 1) {
        const maxOddsList = max.split(',')
        const minOddsList = min.split(',')
        const curOdds = Array.from({length: maxOddsList.length})
        for (let i = 0; i < maxOddsList.length; i++) {
          curOdds[i] = this.subNumber(maxOddsList[i] - (maxOddsList[i] - minOddsList[i]) * rebate / (Number(rebateP) === 0 ? 1 : rebateP))
        }
        if (orderInfo.playId === '101') {
          const oddsTmp = Immutable.fromJS(curOdds).toJS().concat(Immutable.fromJS(curOdds).toJS().reverse())
          odds = []
          for (let select of orderInfo.select['null']) {
            odds.push(`${select}: ${oddsTmp[currentSubPlay.select[0].content.indexOf(select)]}`)
          }
        } else if (orderInfo.playId === '205') {
          const oddsTmp = Immutable.fromJS(curOdds).toJS()
          odds = []
          for (let select of orderInfo.select['null']) {
            odds.push(`${select}: ${oddsTmp[currentSubPlay.select[0].content.indexOf(select)]}`)
          }
        } else {
          odds = curOdds
        }
        maxValue = curOdds.sort((a, b) => a < b)[0]
      } else {
        odds = this.subNumber(max - (max - min) * rebate / (Number(rebateP) === 0 ? 1 : rebateP))
        maxValue = odds
      }
    } else {
      if (['特码包三', '连码', '自选不中', '中一'].includes(orderInfo.playName)) {
        const max = currentSubPlay.detail[0].maxOdds
        const min = currentSubPlay.detail[0].minOdds
        if (['三中二', '二中特'].includes(currentSubPlay.groupName)) {
          const oddValueOne = this.subNumber(max.split(',')[0] - (max.split(',')[0] - min.split(',')[0]) * rebate / (Number(rebatePoint) === 0 ? 1 : rebatePoint))
          const oddValueTwo = this.subNumber(max.split(',')[1] - (max.split(',')[1] - min.split(',')[1]) * rebate / (Number(rebatePoint) === 0 ? 1 : rebatePoint))
          odds = `${oddValueOne}, ${oddValueTwo}`
          maxValue = oddValueOne
        } else {
          odds = this.subNumber(max - (max - min) * rebate / (Number(rebatePoint) === 0 ? 1 : rebatePoint))
          maxValue = odds
        }
      } else if (orderInfo.playName === '正码过关') {
        const oddsTmp = []
        for (let name of orderInfo.names) {
          for (let subPlay of currentPlay.play) {
            const selectItem = subPlay.detail.filter(item => item.id === name)[0]
            if (selectItem) {
              const oddValue = this.subNumber(selectItem.maxOdds - (selectItem.maxOdds - selectItem.minOdds) * rebate / (Number(rebatePoint) === 0 ? 1 : rebatePoint))
              oddsTmp.push(oddValue)
            }
          }
        }
        odds = oddsTmp.reduce((acc, cur) => acc * cur).toFixed(3)
        maxValue = odds
      } else {
        const curOdds = []
        odds = []
        for (let name of orderInfo.names) {
          const selectItem = currentSubPlay.detail.filter(item => item.name === name)[0]
          const max = selectItem.maxOdds
          const min = selectItem.minOdds
          const oddValue = this.subNumber(max - (max - min) * rebate / (Number(rebatePoint) === 0 ? 1 : rebatePoint))
          curOdds.push(Number(oddValue))
          orderInfo.playName !== '合肖' && odds.push(`${name}: ${oddValue}`)
        }
        if (orderInfo.playName === '合肖') {
          odds = (curOdds.reduce((acc, cur) => acc + cur) / (Math.pow(curOdds.length, 2))).toFixed(3)
          maxValue = odds
        } else {
          maxValue = curOdds.sort((a, b) => a < b)[0]
        }
      }
    }
    bonus = this.subNumber(maxValue * orderInfo.unitPrice / Math.pow(10, monetaryUnit[orderInfo.unit]))

    return (
      <Modal
        ref={(val) => this.modalRef = val}
        backdropPressToClose={false}
        swipeToClose={false}
        isOpen={show}
        onClosed={this.modalOnClose}
        style={styles.modal}
        position={"top"}>
        <TouchableWithoutFeedback
          onPress={() => {
            Sound.stop()
            Sound.play()
            dismissKeyboard()
          }}>
          <View style={styles.winWrap}>
            <View style={styles.win}>
              <View style={styles.title}>
                <Text style={styles.titleText}>注单设定</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.row2}>
                  {
                    !Array.isArray(odds) ? (
                      <View style={styles.row}>
                        <Text allowFontScaling={false} style={styles.winText}>赔率：</Text>
                        <Text allowFontScaling={false} style={styles.winTextRed}>{odds}</Text>
                      </View>
                    ) : null
                  }
                  <View style={styles.row}>
                    <Text allowFontScaling={false} style={styles.winText}>返利：</Text>
                    <Text allowFontScaling={false} style={styles.winTextRed}>{rebate}%</Text>
                  </View>
                </View>
                {
                  !((rebatePoint && Number(rebatePoint) === 0)
                    || (currentSubPlay.rebate_point && Number(currentSubPlay.rebate_point) === 0)) && (
                    <Slider
                      step={0.01}
                      minimumTrackTintColor={'#57D9CE'}
                      maximumTrackTintColor={'#DEDEDE'}
                      onValueChange={(value) => {
                        this.setState({
                          sliderValue: this.subNumber(value),
                        })
                      }}/>
                  )
                }
                {
                  Array.isArray(odds) ? (
                    <View style={styles.row3}>
                    {
                      odds.map((item, index) => {
                        if (index < 6) {
                          return (
                            <View style={styles.oddsList} key={index}>
                              <Text allowFontScaling={false}>{index === 5 ? '...' : item}</Text>
                            </View>
                          )
                        }
                      })
                    }
                    </View>
                  ) : null
                }
                <View style={styles.row}>
                  <Text allowFontScaling={false} style={styles.winText}>单注金额</Text>
                  <TextInput underlineColorAndroid='transparent'
                    style={styles.unitPrice}
                    keyboardType={'numeric'}
                    maxLength={5}
                    onChangeText={(text) => { setUnitPrice(text.replace(/[^\d{1,}|\d{1,}]|^0{1,}\d{1,}|[,,.]{1,}/g,'')) }}
                    value={orderInfo.unitPrice.toString()}/>
                  {
                    [{unit: 'yuan', label: '元'}, {unit: 'jiao', label: '角'}, {unit: 'fen', label: '分'}].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        underlayColor='transparent'
                        onPress={() => {Sound.stop();Sound.play(); setUnit(item.unit) }}>
                        <Text allowFontScaling={false} style={orderInfo.unit === item.unit ? styles.unitActivity : styles.unit}>{item.label}</Text>
                      </TouchableOpacity>
                    ))
                  }
                </View>
                {
                  [
                    {title: '注数：', value: orderInfo.betNum, unit: '注'},
                    {title: '总额：', value: orderInfo.totalPrice, unit: '元'},
                    {title: '若中奖，单注最高中：', value: bonus, unit: '元'},
                  ].map((item, index) => (
                    <View key={index} style={styles.row}>
                      <Text allowFontScaling={false} style={styles.winText}>{item.title}</Text>
                      <Text allowFontScaling={false} style={styles.winTextBlack}>{item.value}</Text>
                      <Text allowFontScaling={false} style={styles.winText}>{item.unit}</Text>
                    </View>
                  ))
                }
              </View>
              <View style={styles.fn}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      setWinShow()
                    }}>
                    <View style={styles.winBtnCancel}>
                      <Text allowFontScaling={false} style={styles.winBtnCancelText}>取消</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      if(!isHandlingBetConfirm && orderInfo.unitPrice > 0) {
                        this.setState({
                          isHandlingBetConfirm: true,
                        }, () => {
                          setTimeout(() => { // 解决安卓收弹窗与页面跳转冲突bug
                            betConfirm(rebate)
                          }, 300)
                        })
                      }
                    }}>
                    <View style={styles.winBtnConfirm}>
                      <Text allowFontScaling={false} style={styles.winBtnConfirmText}>确认</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  win: {
    flexDirection: 'column',
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: isIos ? -100 : 0,
  },
  title: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  titleText: {
    fontSize: 20,
  },
  content: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  oddsList: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  winText: {
    fontSize: 14,
    color: '#666666',
  },
  winTextRed: {
    fontSize: 14,
    color: Config.baseColor,
  },
  unitPrice: {
    width: 135,
    height: 30,
    padding: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D8D8D8',
    marginLeft: 5,
    paddingHorizontal: 5,
  },
  unit: {
    height: 30,
    width: 30,
    backgroundColor: '#FCEDDE',
    lineHeight: 28,
    textAlign: 'center',
    color: '#666666',
    fontSize: 14,
    marginLeft: 5,
  },
  unitActivity: {
    height: 30,
    width: 30,
    backgroundColor: Config.baseColor,
    lineHeight: 28,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  winTextBlack: {
    fontSize: 18,
    color: '#000000',
    paddingRight: 5,
  },
  fn: {
    height: 70,
    borderTopColor: '#CCCCCC',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
  },
  winBtnCancel: {
    width: 137,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winBtnCancelText: {
    fontSize: 18,
    color: '#999999',
  },
  winBtnConfirm: {
    width: 137,
    height: 40,
    borderRadius: 4,
    backgroundColor: Config.baseColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winBtnConfirmText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
})
