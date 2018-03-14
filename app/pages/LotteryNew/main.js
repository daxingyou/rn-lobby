import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  getNewPlayList,
  setPlayId,
  addOrder,
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
  Image,
  TouchableWithoutFeedback,
  Vibration,
  BackAndroid,
  Dimensions,
} from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import LotteryNavBar from '../../components/lotteryNavBar'
import Countdown from '../../components/countdown'
import BetSettings from './../lottery/betSettings'
import {randomOrderNew, ballNums, combinatorics, getTotal, combination,MathDiv} from '../../utils'
import { digits, maxByPlay, maxBySubPlay } from '../../utils/config'
import dismissKeyboard from '../../utils/dismissKeyboard'
import { LoadingView } from '../../components/common'
import KeyboardSpacer from '../../components/github/KeyboardSpacer'
import LotteryRecords from '../../components/lotteryRecords'
import SubPlayGuide from '../../components/subPlayGuide'
import Sound from '../../components/clickSound'
import Types from '../../components/Types'
import BetBottom from '../lottery/betBottom'
import BetArea from './BetArea'
import { backFun } from '../../utils/navigation'
import {toastShort} from "../../utils/toastUtil"

const isIos = Platform.OS === "ios"
const inputComponents = []
const { width } = Dimensions.get('window')
export const initialOrderState = {
  names: [],
  ids: [],
  betNum: 0,
  unit: 'yuan',
  unitPrice: 2,
  totalPrice: 0,
}
export const resetOrderState = {
  names: [],
  ids: [],
  betNum: 0,
  totalPrice: 0,
}

class LotteryNew extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTypes: false,
      showOrderSettings: false,
      showHistory: false,
      showGuide: false,
      selectedPlay: -1,
      currentPlay: -1,
      currentSubPlayRule: {},
      selectedType: props.navigation.state.params.categoryId === '8' ? '六合彩' : 'PC蛋蛋',
      typesList: [],
      heXiaoCategory: '',
      activeTab: 0,
      ...initialOrderState,
    }
    this.sound = -1
  }

  componentDidMount() {
    const { navigation, lotteryMap, getNewPlayList, phoneSettings, cleanIssueList } = this.props
    const { lotteryId } = navigation.state.params

    // 跳转卡顿
    setTimeout(() => {
      this.getLotteryData(lotteryMap[lotteryId])
      getNewPlayList(lotteryId)

      if (!isIos) {
        BackAndroid.addEventListener('hardwareBackPress', cleanIssueList)
      }

      phoneSettings.shakeitoff && RNShakeEventIOS.addEventListener('shake', () => {
        this.randomOrder()
      })
    }, 300)
  }

  componentWillReceiveProps(nextProps) {
    const { navigation, getNewPlayList, lotteryMap } = this.props

    let thisLotteryId = navigation.state.params.lotteryId
    let nextLotteryId = nextProps.navigation.state.params.lotteryId
    if (nextLotteryId !== thisLotteryId) {
      getNewPlayList(nextLotteryId)
    }

    if (!Immutable.is(
        Immutable.fromJS(lotteryMap[thisLotteryId]),
        Immutable.fromJS(nextProps.lotteryMap[nextLotteryId])
      )) {
      this.getLotteryData(nextProps.lotteryMap[nextLotteryId])
    }
    if (nextProps.orderInfo && nextProps.orderInfo.betNum <= 0 && this.state.showOrderSettings) {
      this.setState({
        showOrderSettings: false,
      })
    }
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

  getLotteryData = (lotteryData = {}) => {
    const { navigation, setPlayId } = this.props
    const playList = lotteryData.playInfo
    if (playList && playList.length > 0 ) {
      let defaultData
      const { playIndex } = navigation.state.params
      if (playIndex) {
        defaultData = playList.filter(play => play.name === playIndex)[0]
      } else {
        defaultData = playList.filter(n => n.default === '1')[0] || playList[1]
      }

      if (['连码', '自选不中', '中一', '特码包三'].includes(defaultData.name)) {
        defaultData = this.reconstructPlay(defaultData, lotteryData.categoryId)
      }

      this.setState({
        currentPlay: defaultData,
        selectedType: defaultData.name,
        currentSubPlay: defaultData.play ? defaultData.play[0] : {},
        currentSubPlayRule: defaultData.rule ? defaultData.rule[0] : {},
        typesList: playList.map(play => play.name),
      })
      setPlayId(defaultData.id, null, defaultData.name)
    }
  }

  reconstructPlay = (currentPlay, categoryId) => (
    {
      ...currentPlay,
      play: currentPlay.play[0].detail.map(subPlay => (
        {
          groupName: subPlay.name,
          detail: ballNums(categoryId).map(num => (
            {
              ...subPlay,
              name: num,
            }
          )),
        }
      )),
    }
  )

  _onStartShouldSetResponderCapture = (event) => {
    let target = event.nativeEvent.target
    if(!inputComponents.includes(target)) {
      dismissKeyboard()
    }
    return false
  }

  titleOnPress = () => {
    const { showTypes } = this.state
    if (showTypes) {
      this.setState({
        showTypes: false,
        showHistory: false,
        showGuide: false,
      })
    } else {
      this.setState({
        showTypes: true,
        showHistory: false,
        showGuide: false,
      })
    }
  }

  typesSelectAction = (type) => {
    const { navigation, lotteryMap, orderInfo, setPlayId } = this.props
    const { lotteryId } = navigation.state.params
    const categoryId = orderInfo.categoryId
    let playList = lotteryMap[lotteryId] || []

    let nextPlay = playList['playInfo'].filter(play => play.name === type)[0]
    setPlayId(nextPlay.id, null, nextPlay.name)
    setTimeout(() => { // 解决多tab页面跳到少tab页面时 页面空白问题
      this.scrollView && this.scrollView.goToPage(0)
    }, 0)

    if (['连码', '自选不中', '中一', '特码包三'].includes(nextPlay.name)) {
      nextPlay = this.reconstructPlay(nextPlay, categoryId)
    }
    this.setState(() => ({
      ...resetOrderState,
      selectedType: type,
      showTypes: false,
      currentPlay: nextPlay,
      currentSubPlay: nextPlay.play[0],
      currentSubPlayRule: nextPlay.rule[0],
      heXiaoCategory: '',
    }))
  }

  setHeXiaoCategory = (category) => {
    const { currentSubPlay, heXiaoCategory } = this.state
    const indices = {
      '野兽': [0, 2, 3, 4, 5, 8],
      '家禽': [1, 6, 7, 9, 10, 11],
      '双': [1, 3, 5, 7, 9, 11],
      '单': [0, 2, 4, 6, 8, 10],
      '前肖': [0, 1, 2, 3, 4,5],
      '后肖': [6, 7, 8, 9, 10, 11],
      '天肖': [1, 3, 4, 6, 8, 11],
      '地肖': [0, 2, 5, 7, 9, 10],
    }
    const names = [], ids = []

    if (heXiaoCategory === '' || heXiaoCategory !== category) {
      for (let index of indices[category]) {
        names.push(currentSubPlay.detail[index].name)
        ids.push(currentSubPlay.detail[index].id)
      }
      this.setState({ heXiaoCategory: category })
    } else {
      this.setState({ heXiaoCategory: '' })
    }

    this.updateOrder(names, ids, names.length === 0 ? 0 : 1 )
  }

  updateOrder = (names, ids, betNum) => {
    const { unit, unitPrice } = this.state
    const totalPrice = getTotal(unit, betNum, unitPrice)
    this.setState({ names, ids, betNum, totalPrice })
  }

  setRef = (ref) => {
    this.scrollView = ref
  }

  onChangeTab = (i) => {
    this.setState({
      ...resetOrderState,
      activeTab: i,
      currentSubPlay: this.state.currentPlay.play[i],
      currentSubPlayRule: this.state.currentPlay.rule[i],
    })
  }

  onShowGuide = () => {
    this.setState({ showGuide: true })
  }

  onPressItem = (itemName, itemId, itemIds) => {
    const { orderInfo } = this.props
    let selectValue = itemName
    if (orderInfo.playName === '正码过关') {
      selectValue = itemId
    }

    const names = Immutable.fromJS(this.state.names).toJS()
    const ids = Immutable.fromJS(this.state.ids).toJS()
    if (!names.includes(selectValue)) {
      names.push(selectValue)
      ids.push(itemId)
    } else {
      names.splice(names.indexOf(selectValue), 1)
      ids.splice(ids.indexOf(itemId), 1)
    }
    if (orderInfo.playName === '正码过关') { // 正码间互斥
      for (let name of names) {
        if (itemIds.includes(name) && name !== selectValue) {
          names.splice(names.indexOf(name), 1)
          ids.splice(ids.indexOf(name), 1)
        }
      }
    }

    if(orderInfo.playName === '正码过关') {
      this.updateOrder(names, ids, names.length < 2 ? 0 : 1)
    } else if (['连码', '自选不中', '中一', '连肖连尾', '特码包三'].includes(orderInfo.playName)) {
      const tabName = this.state.currentSubPlay.groupName.slice(0, 2)
      const max = ['连码', '连肖连尾', '特码包三'].includes(orderInfo.playName) ? maxByPlay[orderInfo.playId] : maxBySubPlay[tabName]
      if (names.length < digits[tabName]) {
        this.updateOrder(names, ids, 0)
      } else if (names.length > max) {
        toastShort(`最多选${max}个球`)
      } else {
        this.updateOrder(names, ids, combinatorics(names.length, digits[tabName]))
      }
    } else if (orderInfo.playName === '合肖') {
      if (names.length < 2) {
        this.updateOrder(names, ids, 0)
      } else if (names.length > 11) {
        toastShort('最多选11个球')
      } else {
        this.updateOrder(names, ids, 1)
      }
    } else {
      this.updateOrder(names, ids, names.length)
    }
  }

  randomOrder = () => {
    try {
      const { phoneSettings } = this.props
      const { currentPlay, currentSubPlay, unit, unitPrice } = this.state

      phoneSettings.shake && Vibration.vibrate()
      if (currentSubPlay) {
        const { betNum, names, ids } = randomOrderNew(currentPlay, currentSubPlay, currentSubPlay.detail.length - 1)
        const totalPrice = getTotal(unit, betNum, unitPrice)
        this.setState({ betNum, names, ids, totalPrice })
      }
    } catch (e) {
      console.warn(e)
    }

  }

  setWinShow = () => {
    this.setState({
      showOrderSettings: !this.state.showOrderSettings,
    })
  }

  setUnitPrice = (unitPrice) => {
    const { betNum, unit } = this.state
    const totalPrice = getTotal(unit, betNum, unitPrice)
    this.setState({ unitPrice, totalPrice })
  }

  setUnit = (unit) => {
    const { betNum, unitPrice } = this.state
    const totalPrice = getTotal(unit, betNum, unitPrice)
    this.setState({ unit, totalPrice })
  }

  betConfirm = (rebate) => {
    const { currentPlay, currentSubPlay, unit, unitPrice } = this.state
    const { navigation } = this.props
    this.createOrder(rebate, currentPlay.name, currentSubPlay.groupName)
    this.setState({
      showOrderSettings: false,
      heXiaoCategory: '',
    }, () => {
      navigation.navigate('OrderList', {
        unit,
        unitPrice,
        currentPlay,
        currentSubPlay,
        playName: currentPlay.name,
      })

    })
  }

  createOrder = (rebate, playName, subPlayName) => {
    const { lotteryInfo, addOrder } = this.props
    const { names, ids, betNum, unit, unitPrice, totalPrice } = this.state
    const orderInfo = { names, ids, betNum, unit, unitPrice, totalPrice }
    const orderList = []

    if (['合肖', '正码过关', '特码包三'].includes(playName)) {
      const order = Immutable.fromJS(orderInfo)
        .set('select', names)
        .set('playId', playName === '特码包三' ? orderInfo.ids[0] : orderInfo.ids.join())
        .set('issue', lotteryInfo.issue)
        .set('rebate', rebate)
        .set('playName', playName)
        .set('subPlayName', subPlayName).toJS()
      orderList.push(order)
    } else if (['连肖连尾', '连码', '自选不中', '中一'].includes(playName)) {
      const indices = Array.from(new Array(orderInfo.names.length),(val,index)=>index)
      const tabName = subPlayName.slice(0, 2)
      const indicesCombination = combination(indices, digits[tabName])
      for (let indices of indicesCombination) {
        const names = [], ids = []
        for (let index of indices) {
          names.push(orderInfo.names[index])
          ids.push(orderInfo.ids[index])
        }
        const order = Immutable.fromJS(orderInfo)
          .set('select', names)
          .set('playId', playName === '连肖连尾' ? ids.join() : orderInfo.ids[0])
          .set('betNum', 1)
          .set('totalPrice', MathDiv(totalPrice, betNum))
          .set('issue', lotteryInfo.issue)
          .set('rebate', rebate)
          .set('playName', playName)
          .set('subPlayName', subPlayName).toJS()
        orderList.push(order)
      }
    } else {
      for (let i = 0; i < orderInfo.names.length; i++) {
        const order = Immutable.fromJS(orderInfo)
          .set('select', [orderInfo.names[i]])
          .set('playId', orderInfo.ids[i])
          .set('betNum', 1)
          .set('totalPrice', MathDiv(totalPrice, betNum))
          .set('issue', lotteryInfo.issue)
          .set('rebate', rebate)
          .set('playName', playName)
          .set('subPlayName', subPlayName).toJS()
        orderList.push(order)
      }
    }
    addOrder(orderList)
    this.setState(resetOrderState)
  }

  render() {
    const { navigation, lotteryMap, orderInfo, clearOrderList, lotteryInfo, countdownOver,
      cleanIssueList, orderList, isLogin, removeCurrentIssue } = this.props
    const { lotteryId } = navigation.state.params
    const categoryId = orderInfo.categoryId
    const { currentPlay, currentSubPlay, showTypes, showHistory, activeTab, names, betNum, unit, unitPrice,
      showGuide, showOrderSettings, selectedType, typesList, heXiaoCategory, totalPrice, currentSubPlayRule } = this.state

    return (
      <View
        onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture}
        style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <LotteryNavBar
          extendIsOpen={showTypes}
          navigation={navigation}
          title={selectedType}
          titleOnPress={this.titleOnPress}
          backFun={() => backFun(navigation, orderList, clearOrderList, cleanIssueList)}
          rightIcon={orderList && orderList.length > 0?require('../../src/img/ic_lhc_shopCart.png'):undefined}
          lotteryId={lotteryId}
          categoryId={categoryId}
          lotteryName={'需修改'}
          menu={true}
          rightOnPress={() => {
            Sound.stop()
            Sound.play()
            navigation.navigate('OrderList', {
              currentPlay,
              currentSubPlay,
              playName: currentPlay.name,
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
                categoryId={categoryId}
                recordOnPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.setState({showHistory: !showHistory})}}/>
              {
                ((showHistory && (categoryId === '8' ? lotteryInfo.lotteryRecord[0] : true))) && (
                  <LotteryRecords lotteryRecord={categoryId === '8' ? lotteryInfo.lotteryRecord[0].issue_list : lotteryInfo.lotteryRecord} categoryId={categoryId}/>
                )
              }
              <Image style={{width, height: 10, resizeMode: 'stretch'}} source={require('../../src/img/count_down_shade.png')} />
              <BetArea
                currentPlay={currentPlay}
                heXiaoCategory={heXiaoCategory}
                setHeXiaoCategory={this.setHeXiaoCategory}
                currentSubPlay={currentSubPlay}
                activeTab={activeTab}
                setRef={this.setRef}
                onChangeTab={this.onChangeTab}
                onShowGuide={this.onShowGuide}
                onPressItem={this.onPressItem}
                selectNames={names}/>
              <BetBottom
                isLogin={isLogin}
                navigation={navigation}
                orderInfo={{ playName: orderInfo.playName, betNum, totalPrice }}
                currentSubPlay={currentSubPlay}
                randomOrder={this.randomOrder}
                delOrderInfo={() => {
                  this.setState({
                    ...resetOrderState,
                    heXiaoCategory: '',
                  })
                }}
                setWinShow={this.setWinShow}/>
              {isIos ? <KeyboardSpacer/> : null}
            </View>
          ) : (
            <LoadingView />
          )
        }
        {
          showTypes && (
            <Types
              selectedType={selectedType}
              selectAction={(type) => this.typesSelectAction(type)}
              hideWin={() => this.setState({ showTypes: false })}
              types={typesList}/>
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
              help={currentSubPlayRule.help}
              tips={currentSubPlayRule.tips}
              example={currentSubPlayRule.example}
              closeTips={() => this.setState({ showGuide: false })}/>
          )
        }
        {
          showOrderSettings && orderInfo && orderInfo.playName && betNum > 0 && (
            <BetSettings
              show={showOrderSettings}
              orderInfo={{playName: orderInfo.playName, names, unit, unitPrice, betNum, totalPrice }}
              setWinShow={this.setWinShow}
              setUnitPrice={this.setUnitPrice}
              setUnit={this.setUnit}
              betConfirm={this.betConfirm}
              currentPlay={currentPlay}
              currentSubPlay={currentSubPlay}
              rebatePoint={lotteryMap[lotteryId].rebatePoint}/>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  lotteryRecordMask: {
    position: 'absolute',
    top: 383,
    right: 0,
    left: 0,
    bottom: 0,
  },
})

const mapStateToProps = ({ orderInfo, lotteryInfo, orderList, issueList, lotteryMap, phone, userInfo }) => (
  {
    phoneSettings: phone.phoneSettings,
    orderInfo,
    lotteryInfo,
    orderList,
    isLogin: !!userInfo.token,
    issueList,
    lotteryMap,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
    getNewPlayList: (lotteryId) => {
      dispatch(getNewPlayList(lotteryId))
    },
    setPlayId: (playId, odds, playName) => {
      dispatch(setPlayId(playId, odds, playName))
    },
    addOrder: (orderList) => {
      dispatch(addOrder(orderList))
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

export default connect(mapStateToProps, mapDispatchToProps)(LotteryNew)
