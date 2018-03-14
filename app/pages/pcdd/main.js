import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  TextInput,
  Vibration,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Platform, Dimensions,
} from 'react-native'
import {
  getPlayList,
  getBetCountdown,
} from '../../actions'
import Immutable from 'immutable'
import LotteryNavBar from '../../components/lotteryNavBar'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { LoadingView } from '../../components/common'
import Countdown from '../../components/countdown'
import LabelGrid from './labelGrid'
import NumberGrid from './numberGrid'
import PlayOptions from './playOptions'
import dismissKeyboard from '../../utils/dismissKeyboard'
import KeyboardSpacer from '../../components/github/KeyboardSpacer'
import LotteryRecords from '../../components/lotteryRecords'
import SubPlayGuide from '../../components/subPlayGuide'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

const inputComponents = []
const isIos = Platform.OS === 'ios'
const { screenWidth } = Dimensions.get('window')

class Pcdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSubPlay: null,
      showPlayOptions: false,
      selectedItems: props.navigation.state.params.selectedItems || [],
      money: '2',
      betResults: [],
      cleanBaoSan: false,
      showHistory: false,
    }
    this.randomBaoSanSelect = []
  }

  componentDidMount() {
    const { navigation, phoneSettings, lotteryMap, getPlayList } = this.props
    const { lotteryId } = navigation.state.params

    this.getLotteryData(lotteryMap[lotteryId])
    getPlayList(lotteryId)

    phoneSettings.shakeitoff && RNShakeEventIOS.addEventListener('shake', () => {
      this.randomOrder()
    })
  }

  componentWillReceiveProps(nextProps) {
    let thisLotteryId = this.props.navigation.state.params.lotteryId
    let nextLotteryId = nextProps.navigation.state.params.lotteryId

    if (!Immutable.is(
      Immutable.fromJS(this.props.lotteryMap[thisLotteryId]),
      Immutable.fromJS(nextProps.lotteryMap[nextLotteryId])
    )) {
      this.getLotteryData(nextProps.lotteryMap[nextLotteryId])
    }
  }

  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake')
  }

  getLotteryData = (playList = []) => {
    if (Array.isArray(playList) && playList.length > 0) {
      const { playIndex } = this.props.navigation.state.params
      if (typeof playIndex === 'undefined') {
        this.setState({
          currentSubPlay: playList.filter(n => n.selected)[0] || playList[0],
        })
      } else {
        this.setState({ currentSubPlay: playList[playIndex] })
      }
    }
  }

  titleOnPress = () => {
    let showPlayOptions = this.state.showPlayOptions
    this.setState({
      showPlayOptions: !showPlayOptions,
    })
  }

  backFun = () => {
    const { navigation } = this.props
    const { betResults } = this.state
    if (betResults.length > 0) {
      Alert.alert('', '是否放弃所选的号码?', [
        {text: '取消', onPress: () => {return false}},
        {text: '确定', onPress: () => {
          navigation.goBack()
        }},
      ])
    } else {
      navigation.goBack()
    }
  }

  optionsSubPlay = (selectedSubPlay) => {
    let currentSubPlay = this.state.currentSubPlay
    let selectedItems = this.state.selectedItems
    if (currentSubPlay && currentSubPlay.type_id !== selectedSubPlay.type_id) {
      selectedItems = []
    }

    if (selectedSubPlay.type_id === 40) {
      let item = selectedSubPlay.detail[0]
      let detail = []
      for (let i = 0; i < 28; i++) {
        detail.push(Object.assign(Immutable.fromJS(item).toJS(), {label: i}))
      }
      selectedSubPlay.detail = detail
    }

    this.randomBaoSanSelect = []
    this.setState({
      showPlayOptions: true,
      currentSubPlay: selectedSubPlay,
      selectedItems,
    })
  }
  closeShow = () => {
    this.setState({
      showPlayOptions: false,
    })
  }
  handleItemSelect = (item) => {
    let { label, odds, play_id } = item
    let selectedItems = this.state.selectedItems
    let money = this.state.money
    let index = selectedItems.findIndex(n => {
      return n.play_id === play_id
    })

    if (index !== -1) {
      selectedItems.splice(index, 1)
    } else {
      const { lotteryInfo } = this.props

      selectedItems.unshift({
        issue: lotteryInfo.issue,
        typeName: this.state.currentSubPlay.type_name,
        money, label, odds, play_id,
      })
    }

    this.setState({
      selectedItems,
      cleanBaoSan: false,
    })
  }

  delSelected = () => {
    this.randomBaoSanSelect = []
    this.setState({
      selectedItems: [],
      cleanBaoSan: true,
    })
  }

  handleInput = (money) => {
    let selectedItems = this.state.selectedItems
    for (let item of selectedItems) {
      item['money'] = money
    }
    this.setState({
      selectedItems,
      money,
    })
  }

  delBetResults = () => {
    this.setState({
      betResults: [],
    })
  }

  delBetItem = (index) => {
    let betResults = this.state.betResults
    betResults.splice(index, 1)
    this.setState({
      betResults,
    })
  }

  handleConfirm = () => {
    let { selectedItems, money } = this.state
    const { isLogin, navigation } = this.props
    const { lotteryId, categoryId } = this.props.orderInfo
    if (selectedItems && selectedItems.length <= 0) {
      Alert.alert('', '请先选择下注内容？',
        [
          {text: '确定', onPress: () => {return false}},
        ]
      )
    } else if (!money || money <= 0) {
      Alert.alert('', '请先输入下注金额？',
        [
          {text: '确定', onPress: () => {return false}},
        ]
      )
    } else if (!isLogin) {
      this.props.navigation.navigate('LoginPage')
    } else {
      let betResults = this.state.betResults
      betResults = selectedItems.concat(betResults)
      this.randomBaoSanSelect = []
      this.setState({
        selectedItems: [],
        betResults,
        cleanBaoSan: true,
      }, () => {
        navigation.navigate('PcddOrderList', {
          categoryId,
          lotteryId,
          data: betResults,
          delBetResults: this.delBetResults,
          delBetItem: this.delBetItem,
        })
      })
    }
  }

  _onStartShouldSetResponderCapture = (event) => {
    let target = event.nativeEvent.target
    if(!inputComponents.includes(target)) {
        dismissKeyboard()
    }
    return false
  }

  _inputOnLayout = (e) => {
    inputComponents.push(e)
  }

  randomOrder = () => {
    let currentSubPlay = this.state.currentSubPlay
    let index = 0
    let item = currentSubPlay.detail[0]
    if (currentSubPlay.type_id === 37) {
      index = parseInt(Math.random() * 10)
      item = currentSubPlay.detail[index]
    } else if (currentSubPlay.type_id === 38) {
      index = parseInt(Math.random() * 3)
      item = currentSubPlay.detail[index]
    } else if (currentSubPlay.type_id === 39) {
      index = 0
      item = currentSubPlay.detail[index]
    } else if (currentSubPlay.type_id === 36) {
      index = parseInt(Math.random() * 28)
      item = currentSubPlay.detail[index]
    } else if (currentSubPlay.type_id === 40) {
      let label = []
      let randomBaoSanSelect = []
      while (label.length < 3) {
        index = parseInt(Math.random() * 28)
        if (!label.includes(index)) {
          label.push(index)
          randomBaoSanSelect.push({
            label: index,
            odds: currentSubPlay.detail[0].odds,
            play_id: currentSubPlay.detail[0].play_id,
          })
        }
      }
      this.randomBaoSanSelect = randomBaoSanSelect
      item = {
        play_id: currentSubPlay.detail[0].play_id,
        label: label.join(', '),
        odds: currentSubPlay.detail[0].odds,
      }
    }

    this.props.phoneSettings.shake && Vibration.vibrate()

    this.setState({
      selectedItems: [],
    }, () => [
      this.handleItemSelect(item),
    ])
  }

  handCDOver = () => {
    this.randomBaoSanSelect = []
    this.setState({
      betResults: [],
      selectedItems: [],
      cleanBaoSan: true,
    })
  }
  render() {
    const { navigation, lotteryInfo, countdownOver, lotteryMap, orderInfo } = this.props
    const { lotteryId } = navigation.state.params
    let playList = lotteryMap[lotteryId] || []
    const categoryId = orderInfo.categoryId
    let { currentSubPlay, selectedItems, money, cleanBaoSan, betResults } = this.state
    return (
      <View
        onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture}
        style={{flex: 1, backgroundColor: 'white'}}>
        <LotteryNavBar
          extendIsOpen={this.state.showPlayOptions}
          navigation={navigation}
          title={currentSubPlay && currentSubPlay.type_name}
          titleOnPress={() => {
            Sound.stop()
            Sound.play()
            this.titleOnPress()}}
          backFun={this.backFun}
          lotteryId={orderInfo.lotteryId}
          categoryId={categoryId}
          menu={true}
          rightIcon={betResults && betResults.length > 0?require('../../src/img/ic_lhc_shopCart.png'):undefined}
          rightOnPress={() => {
            Sound.stop()
            Sound.play()
            navigation.navigate('PcddOrderList', {
              lotteryId,
              data: betResults,
              delBetResults: this.delBetResults,
              delBetItem: this.delBetItem,
            })
          }}/>
        {
          currentSubPlay ? (
            <View style={{flex: 1}}>
              <Countdown
                data={lotteryInfo}
                countdownOver={() => countdownOver(lotteryId)}
                needClear={betResults.length > 0 || selectedItems.length > 0}
                clearBet={this.handCDOver}
                lotteryId={lotteryId}
                categoryId={orderInfo.categoryId}
                recordOnPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.setState({showHistory: !this.state.showHistory})}}/>
              {
                this.state.showHistory && (
                  <LotteryRecords data={lotteryInfo.lotteryRecord} categoryId={categoryId}/>
                )
              }
              <Image style={{width: screenWidth, marginTop: -7, resizeMode: 'contain'}} source={require('../../src/img/count_down_shade.png')} />
              <View style={styles.shakeAndTips}>
                <TouchableOpacity
                  style={styles.tips}
                  underlayColor='transparent'
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.setState({showTips: true})
                  }}>
                  <Text style={styles.tipsText}>玩法提示</Text>
                  <View style={{height: 25, backgroundColor: '#EDF1F6', justifyContent: 'center'}}>
                    <Image source={require('../../src/img/tips_arrow.png')} style={styles.tipsIcon}/>
                  </View>
                </TouchableOpacity>
              </View>
              {
                currentSubPlay.type_id === 36 || currentSubPlay.type_id === 40 ? (
                  <NumberGrid
                    typeId={currentSubPlay.type_id}
                    data={currentSubPlay.detail}
                    itemSelect={this.handleItemSelect}
                    selectedItems={selectedItems}
                    cleanBaoSan={cleanBaoSan}
                    randomBaoSanSelect={this.randomBaoSanSelect}/>
                ) : (
                  <LabelGrid
                    data={currentSubPlay.detail}
                    itemSelect={this.handleItemSelect}
                    selectedItems={selectedItems}/>
                )
              }
              <View style={styles.bottom}>
                <TouchableOpacity
                  style={styles.randomBtn}
                  underlayColor='transparent'
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    if (selectedItems.length > 0) {
                      this.delSelected()
                    } else {
                      this.randomOrder()
                    }

                  }}>
                  <Text style={styles.randomBtnText}>{selectedItems.length > 0 ? '清空' : '机选'}</Text>
                </TouchableOpacity>
                <View style={styles.money}>
                  <Text style={styles.moneyText}>单注</Text>
                  <View>
                    <TextInput underlineColorAndroid='transparent'
                      style={styles.textInput}
                      keyboardType={'numeric'}
                      onLayout={(event) => { this._inputOnLayout(event.nativeEvent.target) }}
                      maxLength={6}
                      value={money.toString()}
                      onChangeText={(text) => {
                        this.handleInput(text.replace(/[^\d{1,}]|^0{1,}\d{1,}|[,.]{1,}/g,''))
                      }}/>
                  </View>
                  <Text style={styles.moneyText}>元</Text>
                </View>
                <TouchableOpacity
                  style={[styles.confirmBtn, selectedItems.length > 0 && money > 0 ? {} : styles.invalidBtn]}
                  underlayColor='transparent'
                  onPress={() => {
                    if (selectedItems.length > 0 && money > 0) {
                      Sound.stop()
                      Sound.play()
                      this.handleConfirm()
                    } else {
                      return false
                    }
                  }}>
                  <Text style={styles.confirmBtnText}>确定</Text>
                </TouchableOpacity>
              </View>
              {
                isIos?<KeyboardSpacer />:null
              }
            </View>
          ) : (
            <LoadingView />
          )
        }
        {
          this.state.showPlayOptions && <PlayOptions
            currentSubPlay={this.state.currentSubPlay}
            closeShow={this.closeShow}
            data={playList}
            optionsSubPlay={this.optionsSubPlay}/>
        }
        {
          this.state.showHistory && (
            <TouchableWithoutFeedback
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.setState({
                  showHistory: false,
                })
              }}>
            <View style={styles.lotteryRecordMask} />
          </TouchableWithoutFeedback>
          )
        }
        {
          this.state.showTips && (
            <SubPlayGuide
              help={currentSubPlay.help ? currentSubPlay.help : ''}
              tips={currentSubPlay.tips ? currentSubPlay.tips : ''}
              example={currentSubPlay.example ? currentSubPlay.example : ''}
              closeTips={() => {
                this.setState({showTips: false})
              }}/>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  shakeAndTips: {
    height: 30,
    marginTop: -10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF1F6',
    height: 25,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  tipsIcon: {
    height: 11,
    resizeMode: 'contain',
    backgroundColor: '#EDF1F6',
    marginRight: 2,
  },
  tipsText: {
    marginLeft: 10,
    color: '#6B839C',
    fontSize: 12,
  },
  lotteryRecordMask: {
    position: 'absolute',
    top: 383,
    right: 0,
    left: 0,
    bottom: 0,
  },
  bottom: {
    height: 50,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  randomBtn: {
    width: 60,
    height: 30,
    backgroundColor: '#FFEFEF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Config.baseColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomBtnText: {
    color: Config.baseColor,
    fontSize: 16,
    letterSpacing: 1.37,
  },
  money: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moneyText: {
    fontSize: 16,
    color: '#666666',
  },
  textInput: {
    padding: 0,
    width: 89,
    height: 35,
    backgroundColor: '#FFF8F1',
    borderWidth: 0.5,
    borderColor: '#FFB76F',
    borderRadius: 5,
    marginHorizontal: 3,
    textAlign: 'center',
  },
  invalidBtn : {
    backgroundColor: '#ddd',
  },
  confirmBtn: {
    width: 60,
    height: 30,
    backgroundColor: Config.baseColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  confirmBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.37,
  },
})


const mapStateToProps = (state) => {
  const { lotteryMap, lotteryInfo, userInfo, orderInfo, phone } = state
  const { phoneSettings } = phone
  return {
    phoneSettings,
    lotteryMap,
    lotteryInfo,
    isLogin: !!userInfo.token,
    orderInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getPlayList: (lotteryId) => {
      dispatch(getPlayList(lotteryId))
    },
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pcdd)
