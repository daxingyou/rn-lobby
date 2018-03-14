import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  getPlayList,
  createOrder,
  clearOrderList,
  removeCurrentIssue,
  cleanIssueList,
  getBetCountdown,
} from '../../actions'
import Immutable from 'immutable'
import {
  Platform,
  Keyboard,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  BackAndroid,
  Dimensions,
} from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import LotteryNavBar from '../../components/lotteryNavBar'
import Countdown from '../../components/countdown'
import PlayOpts from './playOpts'
import Checkbox from './checkbox'
import Select from './select'
import Input from './input'
import BetSettings from './betSettings'
import { randomOrder, calSelectBetNum, calCheckboxBetNum, calInputBetNum, calSpecialInputBetNum, getTotal } from '../../utils'
import dismissKeyboard from '../../utils/dismissKeyboard'
import { LoadingView } from '../../components/common'
import KeyboardSpacer from '../../components/github/KeyboardSpacer'
import LotteryRecords from '../../components/lotteryRecords'
import SubPlayGuide from '../../components/subPlayGuide'
import Sound from '../../components/clickSound'
import BetBottom from './betBottom'
import { backFun } from '../../utils/navigation'

const isIos = Platform.OS === "ios"
const inputComponents = []
const { screenWidth } = Dimensions.get('window')

class Bet extends Component {
  constructor(props) {
    super(props)
    const { categoryId, lotteryId } = props.navigation.state.params
    this.state = {
      showPlayWin: false,
      showOrderSettings: false,
      showHistory: false,
      showGuide: false,
      selectedPlay: -1,
      currentPlay: -1,
      orderInfo: {
        categoryId: categoryId,
        lotteryId: lotteryId,
        playId: '',
        playName: '',
        odds: '',
        select: {},
        checkbox: [],
        input: [],
        inputRawData: '',
        betNum: 0,
        totalPrice: 0,
        unit: 'yuan',
        unitPrice: 2,
      },
    }
  }

  componentDidMount() {
    const { navigation, lotteryMap, getPlayList, phoneSettings, cleanIssueList } = this.props
    const { lotteryId } = navigation.state.params

    // 跳转卡顿
    setTimeout(() => {
      this.getLotteryData(lotteryMap[lotteryId])
      getPlayList(lotteryId)

      if (!isIos) {
        BackAndroid.addEventListener('hardwareBackPress', cleanIssueList)
      }

      phoneSettings.shakeitoff && RNShakeEventIOS.addEventListener('shake', () => {
        this.randomOrder()
      })
    }, 300)
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, getPlayList, lotteryMap } = this.props

    let thisLotteryId = navigation.state.params.lotteryId
    let nextLotteryId = nextProps.navigation.state.params.lotteryId
    if (nextLotteryId !== thisLotteryId) {
      getPlayList(nextLotteryId)
    }

    if (!Immutable.is(
        Immutable.fromJS(lotteryMap[thisLotteryId]),
        Immutable.fromJS(nextProps.lotteryMap[nextLotteryId])
      )) {
      this.getLotteryData(nextProps.lotteryMap[nextLotteryId])
    }
    // if (nextProps.orderInfo && nextProps.orderInfo.betNum <= 0 && this.state.showOrderSettings) {
    //   this.setState({
    //     showOrderSettings: false,
    //   })
    // }
  }

  componentWillUnmount() {
    const { orderList, clearOrderList, cleanIssueList } = this.props

    if (!isIos) {
      BackAndroid.removeEventListener('hardwareBackPress', cleanIssueList)
    }
    Keyboard.removeListener('keyboardWillHide')
    Keyboard.removeListener('keyboardDidHide')
    RNShakeEventIOS.removeEventListener('shake')
    if (orderList && orderList.length > 0) {
      clearOrderList()
    }
  }

  setPlay = (currentPlay, currentSubPlay) => {
    this.setState({
      currentPlay,
      currentSubPlay,
      showPlayWin: false,
      orderInfo: {
        ...this.state.orderInfo,
        playId: currentSubPlay.play_id,
        playName: '',
        odds: currentSubPlay.max_odds,
        select: {},
        checkbox: [],
        input: [],
        inputRawData: '',
        betNum: 0,
        totalPrice: 0,
        unit: 'yuan',
        unitPrice: 2,
      },
    })
  }

  closePlayWin = () => {
    if (this.state.showPlayWin) {
      this.setState({
        showPlayWin: false,
      })
    }
  }

  getLotteryData = (playList = []) => {
    if (playList.length > 0 ) {
      let defaultData
      const { playIndex } = this.props.navigation.state.params
      if (typeof playIndex === 'undefined') {
        defaultData = playList.filter(n => n.selected)[0] || playList[0]
      } else {
        defaultData = playList[playIndex]
      }
      this.setState({
        currentPlay: defaultData,
        currentSubPlay: defaultData.detail[0].method[0],
        orderInfo: {
          ...this.state.orderInfo,
          playId: defaultData.detail[0].method[0].play_id,
        },
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

  handleSelect = (data) => {
    const { orderInfo } = this.state
    const currentSubPlay = this.state.currentSubPlay
    const playId = currentSubPlay.play_id
    let betNum = 0
    betNum = calSelectBetNum(playId, data)
    if (currentSubPlay.checkbox) {
      let checkedBetNum = calCheckboxBetNum(playId, orderInfo.checkbox)
      betNum = betNum * checkedBetNum
    }
    this.setState({
      orderInfo: {
        ...orderInfo,
        select: data,
        betNum,
        totalPrice: getTotal(orderInfo.unit, betNum, orderInfo.unitPrice),
      },
    })

  }

  handleInput = (data) => {
    const { orderInfo } = this.state
    let currentSubPlay = this.state.currentSubPlay
    let result = {
      inputData: data.split(/\s+/),
      betNum: 0,
    }
    const playId = currentSubPlay.play_id
    let categoryIdList = ['3', '5']
    if (categoryIdList.includes(orderInfo.categoryId)) {
      result = calSpecialInputBetNum(playId, data.split(","))
    } else {
      result = calInputBetNum(playId, data.split(" "))
    }
    if (currentSubPlay.checkbox) {
      let checkedBetNum = calCheckboxBetNum(playId, orderInfo.checkbox)
      result.betNum = result.betNum * checkedBetNum
    }

    this.setState({
      orderInfo: {
        ...orderInfo,
        input: result.input,
        inputRawData: data,
        betNum: result.betNum,
        totalPrice: getTotal(orderInfo.unit, result.betNum, orderInfo.unitPrice),
      },
    })
  }

  handleCheck = (data) => {
    const { orderInfo } = this.state
    let currentSubPlay = this.state.currentSubPlay
    const playId = currentSubPlay.play_id
    let betNum = 0
    let checkedBetNum = calCheckboxBetNum(playId, data)
    if (currentSubPlay.select) {
      betNum = calSelectBetNum(playId, orderInfo.select)
    } else if (currentSubPlay.input) {
      let result = calInputBetNum(playId, orderInfo.input)
      betNum = result.betNum
    }
    this.setState({
      orderInfo: {
        ...orderInfo,
        checkbox: data,
        betNum: betNum * checkedBetNum,
        totalPrice: getTotal(orderInfo.unit, betNum * checkedBetNum, orderInfo.unitPrice),
      },
    })
  }

  randomOrder = () => {
    const { phoneSettings } = this.props
    const { orderInfo } = this.state
    phoneSettings.shake && Vibration.vibrate()

    const currentSubPlay = this.state.currentSubPlay
    try {
      if (currentSubPlay && currentSubPlay.play_id) {
        const randomInfo = randomOrder(currentSubPlay, orderInfo)
        if (randomInfo) {
          this.setState({
            orderInfo: {
              ...orderInfo,
              checkbox: randomInfo.checkbox,
              input: randomInfo.input,
              inputRawData: randomInfo.input.join(' '),
              select: randomInfo.select,
              betNum: randomInfo.betNum,
              totalPrice: getTotal(orderInfo.unit, randomInfo.betNum, orderInfo.unitPrice),
            },
          })
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  betConfirm = (rebate) => {
    const { currentPlay, currentSubPlay, orderInfo } = this.state
    const { navigation, createOrder } = this.props
    createOrder(rebate, currentPlay.label, currentSubPlay.label, orderInfo)
    const { unit, unitPrice, odds, playId } = orderInfo
    this.setState({
      showOrderSettings: false,
      orderInfo: {
        ...orderInfo,
        select: {},
        checkbox: [],
        input: [],
        inputRawData: '',
        betNum: 0,
        totalPrice: 0,
      },
    }, () => {
      navigation.navigate('OrderList', {
        currentSubPlay: currentSubPlay,
        playName: currentPlay.label,
        unit,
        unitPrice,
        rebate,
        odds,
        playId,
      })
    })
  }

  setWinShow = () => {
    this.setState({
      showOrderSettings: !this.state.showOrderSettings,
    })
  }

  clearOrderInfo = () => {
    const orderInfo = this.state.orderInfo
    this.setState({
      orderInfo: {
        ...orderInfo,
        select: {},
        checkbox: [],
        input: [],
        inputRawData: '',
        betNum: 0,
        totalPrice: 0,
      },
    })
  }

  render() {
    const { navigation, lotteryMap, lotteryInfo, countdownOver, clearOrderList,
      orderList, isLogin, removeCurrentIssue, cleanIssueList } = this.props
    const { lotteryId } = navigation.state.params
    let playList = lotteryMap[lotteryId] || []
    const { selectedPlay, currentPlay, currentSubPlay,
      showPlayWin, showHistory, showOrderSettings, showGuide, orderInfo } = this.state
    let playName = ''
    let subPlayName = ''
    if (currentSubPlay && currentPlay) {
      playName = currentPlay.label
      subPlayName = currentSubPlay.label
    }
    return (
      <View
        onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture}
        style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <LotteryNavBar
          extendIsOpen={showPlayWin}
          navigation={navigation}
          title={currentSubPlay ? playName + '-' + subPlayName : null}
          titleOnPress={() => {this.setState({showPlayWin: true})}}
          backFun={() => backFun(navigation, orderList, clearOrderList, cleanIssueList)}
          rightIcon={orderList && orderList.length > 0?require('../../src/img/ic_lhc_shopCart.png'):undefined}
          lotteryId={lotteryId}
          categoryId={orderInfo.categoryId}
          lotteryName={'需修改'}
          menu={true}
          rightOnPress={() => {
            Sound.stop()
            Sound.play()
            navigation.navigate('OrderList', {
              currentSubPlay: currentSubPlay,
              playName: currentPlay.label,
              unit: orderInfo.unit,
              unitPrice: orderInfo.unitPrice,
              rebate: orderInfo.rebate,
              odds: orderInfo.odds,
              playId: orderInfo.playId,
            })
          }}/>
        {
          currentSubPlay ? (
            <View style={{flex:1}}>
              <Countdown
                data={lotteryInfo}
                removeCurrentIssue={removeCurrentIssue}
                countdownOver={() => countdownOver(lotteryId)}
                lotteryId={lotteryId}
                categoryId={orderInfo.categoryId}
                recordOnPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.setState({showHistory: !showHistory})}}/>
              {
                showHistory && (
                  <LotteryRecords lotteryRecord={lotteryInfo.lotteryRecord} categoryId={orderInfo.categoryId}/>
                )
              }
              <Image style={{width: screenWidth, marginTop: -7, resizeMode: 'contain'}} source={require('../../src/img/count_down_shade.png')} />
              <View style={styles.tipsWrap}>
                <TouchableOpacity
                  style={styles.tips}
                  underlayColor='transparent'
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.setState({showGuide: true})
                  }}>
                  <Text style={styles.tipsText}>玩法提示</Text>
                  <View style={{height: 25, backgroundColor: '#EDF1F6', justifyContent: 'center'}}>
                    <Image source={require('../../src/img/tips_arrow.png')} style={styles.tipsIcon}/>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.betArea}>
                {
                  currentSubPlay.select && (
                    <Select
                      data={currentSubPlay.select}
                      orderInfo={orderInfo}
                      onSelect={this.handleSelect}/>
                  )
                }
                {
                  currentSubPlay.checkbox && (
                    <Checkbox
                      data={currentSubPlay.checkbox}
                      orderInfo={orderInfo}
                      onCheck={this.handleCheck}/>
                  )
                }
                {
                  currentSubPlay.input && (
                    <Input
                      orderInfo={orderInfo}
                      onInput={this.handleInput}
                      inputOnLayout={e => inputComponents.push(e)}/>
                  )
                }
              </View>
              <BetBottom
                randomOrder={this.randomOrder}
                delOrderInfo={this.clearOrderInfo}
                orderInfo={orderInfo}
                isLogin={isLogin}
                navigation={navigation}
                setWinShow={this.setWinShow}/>
              {isIos ? <KeyboardSpacer /> : null}
            </View>
          ) : (
            <LoadingView />
          )
        }
        {
          showPlayWin && (
            <PlayOpts
              showPlayWin={showPlayWin}
              closePlayWin={this.closePlayWin}
              playList={playList}
              setPlay={this.setPlay}
              currentPlay={selectedPlay !== -1 ? selectedPlay : currentPlay}
              currentSubPlay={currentSubPlay}/>
          )
        }

        {
          showHistory && (
            <TouchableWithoutFeedback
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.setState({ showHistory: false })
              }}>
              <View style={styles.lotteryRecordMask} />
            </TouchableWithoutFeedback>
          )
        }
        {
          showGuide && (
            <SubPlayGuide
              help={currentSubPlay.help}
              tips={currentSubPlay.tips}
              example={currentSubPlay.example}
              closeTips={() => this.setState({ showGuide: false })}/>
          )
        }
        {
          showOrderSettings && (
            <BetSettings
              show={true}
              orderInfo={orderInfo}
              setWinShow={this.setWinShow}
              setUnitPrice={(unitPrice) => {
                this.setState({
                  orderInfo: {
                    ...orderInfo,
                    unitPrice,
                    totalPrice: getTotal(orderInfo.unit, orderInfo.betNum, unitPrice),
                  },
                })
              }}
              setUnit={(unit) => {
                this.setState({
                  orderInfo: {
                    ...orderInfo,
                    unit,
                    totalPrice: getTotal(unit, orderInfo.betNum, orderInfo.unitPrice),
                  },
                })
              }}
              betConfirm={this.betConfirm}
              currentSubPlay={currentSubPlay}/>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  betArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tipsWrap: {
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
})

const mapStateToProps = ({ lotteryInfo, orderList, issueList, lotteryMap, phone, userInfo }) => (
  {
    phoneSettings: phone.phoneSettings,
    lotteryInfo,
    orderList,
    isLogin: !!userInfo.token,
    issueList,
    lotteryMap,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    dispatch,
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
    getPlayList: (lotteryId) => {
      dispatch(getPlayList(lotteryId))
    },
    createOrder: (rebate, playName, subPlayName, orderInfo) => {
      dispatch(createOrder(rebate, playName, subPlayName, orderInfo))
    },
    clearOrderList: () => {
      dispatch(clearOrderList())
    },
    removeCurrentIssue: (currentIssue) => {
      dispatch(removeCurrentIssue(currentIssue))
    },
    cleanIssueList: () => {
      dispatch(cleanIssueList())
    },
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(Bet)
