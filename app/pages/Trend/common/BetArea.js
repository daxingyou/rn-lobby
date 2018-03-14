import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native'
import Immutable from 'immutable'
import Sound from '../../../components/clickSound'
import { calSelectBetNum, ballNums } from '../../../utils'
import Countdown from '../../../components/countdown'
import { toastShort } from '../../../utils/toastUtil'
import selectBall from '../../../src/img/select_ball.png'
import unselectBall from '../../../src/img/unselect_ball.png'

const windowWidth = Dimensions.get('window').width

class BetArea extends Component {

  footSelected = (label, val) => {
    const { orderInfo, setSelect, currentSubPlay, activeIndex, tab, categoryId } = this.props
    let select = {}, arr = []
    if (orderInfo && orderInfo.select && Object.keys(orderInfo.select).length > 0) {
      select = Immutable.fromJS(orderInfo.select).toJS()
      if (['定位胆','定位胆1~5','定位胆6~10'].includes(tab)) {
        arr = select[currentSubPlay.select[activeIndex].label ] || []
      }
      else if (categoryId === '5' && tab === '冠亚和') {
        arr = select[null] || []
      }
      else {
        arr = select[currentSubPlay.select[0].label ] || []
      }
    } else {
      currentSubPlay['select'].map((item) => select[item.label] = [])
    }

    if (arr.includes(val)) {
      arr.splice(arr.indexOf(val), 1)
    } else {
      arr.push(val)
    }
    if (['定位胆','定位胆1~5','定位胆6~10'].includes(tab)) {
      select[currentSubPlay.select[activeIndex].label ] = arr
    }
    else if (tab === '冠亚和' && categoryId === '5') {
      select[null] = arr
    }
    else {
      select[currentSubPlay.select[0].label ] = arr
    }

    let betNum = calSelectBetNum(currentSubPlay.play_id, select)
    setSelect(select, betNum)
  }

  onPressConfirm = () => {
    const { navigation, orderInfo, isLogin, setWinShow, categoryId, betNum } = this.props
    let noSelect
    categoryId === '6'
      ? noSelect = betNum <= 0
      : noSelect = orderInfo && orderInfo.betNum <= 0

    if (!isLogin) {
      navigation.navigate('LoginPage')
    } else if (noSelect) {
      toastShort('请先选择号码')
    } else {
      setWinShow()
    }
  }

  render() {
    const { lotteryId, orderInfo, lotteryInfo, removeCurrentIssue, countdownOver, categoryId,
      tab, title, currentSubPlay, positionIndex, betWidth, onPressItem, activeIndex } = this.props
    let balls
    if (categoryId === '6') {
      balls = ballNums(categoryId)
    } else if (['定位胆','定位胆1~5','定位胆6~10'].includes(tab)) {
      balls = currentSubPlay.select[0].content
    }
    else {
      balls = currentSubPlay['select'][positionIndex]['content']
    }
    return (
      <View style={styles.betArea}>
        <View style={styles.selectWrap}>
          <View style={styles.unit}>
            <Text style={styles.unitText}>{tab}</Text>
            <Text style={styles.unitText}>{title}</Text>
          </View>
          <ScrollView horizontal={true}>
            <View style={styles.selectItems}>
            {
              balls.map((item, index) => {
                let unitLabel, selected, ballText, ball
                if (categoryId === '6') {
                  ball = currentSubPlay.detail[index]
                  selected = orderInfo.names.includes(ball.name)
                  ballText = item
                } else if (['定位胆','定位胆1~5','定位胆6~10'].includes(tab)) {
                  unitLabel = currentSubPlay.label
                  selected = orderInfo.select && orderInfo.select[currentSubPlay.select[activeIndex].label] && orderInfo.select[currentSubPlay.select[activeIndex].label].includes(item)
                  ballText = item
                }
                else if (tab === '冠亚和' && this.props.categoryId === '5') {
                  unitLabel = null
                  selected = orderInfo.select && orderInfo.select[unitLabel] && orderInfo.select[unitLabel].includes(item)
                  ballText = item
                }
                else {
                  unitLabel = currentSubPlay['select'][positionIndex]['label']
                  selected = orderInfo.select && orderInfo.select[unitLabel] && orderInfo.select[unitLabel].includes(item)
                  ballText = item
                }
                const ballWidth = tab === '和值' && ['1','4'].includes(categoryId) ? (typeof betWidth !== 'undefined' ? betWidth : windowWidth) / 16 - 6 : (typeof betWidth !== 'undefined' ? betWidth : windowWidth) / balls.length - 6
                return (
                  <View key={index} style={{ width: ballWidth }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      underlayColor='transparent'
                      onPressIn={() => {
                        Sound.stop()
                        Sound.play()
                        if (categoryId === '6') {
                          onPressItem(ball.name, ball.id)
                        } else {
                          this.footSelected(unitLabel, item)
                        }
                      }}>
                      <Image style={{width: 28, height: 28}} source={selected ? selectBall : unselectBall}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -2}}>
                          <Text style={[styles.ballText, selected && {color: '#FFFFFF'}]}>{ballText}</Text>
                        </View>
                      </Image>
                    </TouchableOpacity>
                  </View>
                )
              })
            }
          </View>
          </ScrollView>
        </View>
        <View style={styles.btm}>
          <View style={styles.info}>
            <View style={styles.infoRow}>
              <View style={styles.point} />
              <Text style={styles.betNumText}>已选：</Text>
              <Text style={[styles.betNumText, {color: '#EC0909'}]}>
                {orderInfo.betNum}注
              </Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.point} />
              <Countdown
                data={lotteryInfo}
                simpleMode={'B'}
                fromTrend={true}
                removeCurrentIssue={removeCurrentIssue}
                countdownOver={() => countdownOver(lotteryId)}/>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.85}
            onPressIn={()=>{
              Sound.stop()
              Sound.play()
              this.onPressConfirm()
            }}>
            <Text style={styles.btnText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  betNumText: {
    fontSize: 12,
    color: '#666666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2.5,
  },
  point: {
    width: 5,
    height: 5,
    borderRadius: 50,
    backgroundColor: '#333333',
    marginRight: 5,
  },
  info: {
    flexShrink: 1,
  },
  btnText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  btn: {
    flexShrink: 0,
    width: 90,
    height: 28,
    backgroundColor: '#DD1414',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btm: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ballText: {
    fontSize: 17,
    color: '#333333',
    backgroundColor: 'transparent',
  },
  selectItems: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 3,
  },
  unitText: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 12,
  },
  unit: {
    marginLeft: 9.5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectWrap: {
    marginTop: 8.5,
    marginLeft: 10,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderTopLeftRadius: 17,
    borderBottomLeftRadius: 17,
  },
  betArea: {
    height: 104,
  },
})

const mapStateToProps = ({ userInfo }) => ({
    isLogin: !!userInfo.token,
})


export default connect(mapStateToProps)(BetArea)
