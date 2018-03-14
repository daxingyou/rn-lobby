import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  clearOrderList,
  delOrder,
  addOrder,
  getUserInfo,
  getBetCountdown,
  removeCurrentIssue,
} from '../../actions'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native'
import LotteryNavBar from '../../components/lotteryNavBar'
import Countdown from '../../components/countdown'
import OrderItem from './orderItem'
import { randomOrder, MathAdd, randomOrderNew} from '../../utils'
import Immutable from 'immutable'
import { fetchWithStatus } from '../../utils/fetchUtil'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import { toastShort } from '../../utils/toastUtil'
import AlertModal from '../../components/modal/alertModal'

const { width } = Dimensions.get('window')
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

const getTotal = (unit, betNum, unitPrice) => {
  let coefficient = 0
  if (unit === 'yuan') {
    coefficient = 0
  } else if (unit === 'jiao') {
    coefficient = 1
  } else if (unit === 'fen') {
    coefficient = 2
  }
  return betNum * unitPrice / Math.pow(10, coefficient)
}

class OrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isBetting: false,
      modalVisible: false,
    }
    this.alertPresent = false
  }

  randomBet(num = 1) {
    try {
      const { orderInfo, addOrder, lotteryInfo, navigation } = this.props
      const {
        currentPlay, currentSubPlay, playName, unit, unitPrice, rebate,
        odds, playId,
      } = navigation.state.params
      if (currentSubPlay) {
        const orderList = []
        for (let i = 0; i < num; i++) {
          let randomInfo
          if (['6', '8'].includes(orderInfo.categoryId)) {
            randomInfo = randomOrderNew(currentPlay, currentSubPlay, currentSubPlay.detail.length - 1)
          } else {
            randomInfo = randomOrder(currentSubPlay)
          }
          if (randomInfo) {
            const newOrderInfo = Immutable.fromJS(orderInfo).merge({
              playId: ['6', '8'].includes(orderInfo.categoryId) ?
                ['正码过关', '连肖连尾', '合肖'].includes(orderInfo.playName) ?
                randomInfo.ids.join() : randomInfo.ids[0] : currentSubPlay.play_id,
              checkbox: randomInfo.checkbox,
              input: randomInfo.input,
              select: randomInfo.names || randomInfo.select,
              betNum: randomInfo.betNum,
              // 新六合彩/PC蛋蛋 需要通过navigation传上层state里的unit和unitPrice
              totalPrice: getTotal(unit || orderInfo.unit, randomInfo.betNum, unitPrice || orderInfo.unitPrice),
              playName: playName,
              subPlayName: currentSubPlay.groupName || currentSubPlay.label,
              issue: lotteryInfo.issue,
            }).toJS()

            if (rebate) {
              newOrderInfo.rebate = rebate
            }
            if (odds) {
              newOrderInfo.odds = odds
            }
            if (playId) {
              newOrderInfo.playId = playId
            }
            if (unitPrice) {
              newOrderInfo.unitPrice = unitPrice
            }
            if (unit) {
              newOrderInfo.unit = unit
            }
            orderList.push(newOrderInfo)
          }
        }
        addOrder(orderList)
      }
    } catch (e) {
      console.warn(e)
    }

  }

  betting = (planList = [], winStop = false, callBack) => {
    const { orderList, lotteryInfo, userInfo, orderInfo } = this.props
    const lotteryNew = ['6', '8'].includes(orderInfo.categoryId)
    let order_list = []
    let isDiffIssue = false
    for (let order of orderList) {
      if (order.issue !== lotteryInfo.issue) {
        isDiffIssue = true
      }
      let newOrder = {}
      newOrder.play_id = order.playId
      newOrder.method_name = order.name
      if (order.checkbox && order.checkbox.length > 0) {
        newOrder.position = order.checkbox.join(",")
      }
      if (order.input && order.input.length > 0) {
        newOrder.content = order.input.join(",")
      } else if (!lotteryNew && Object.keys(order.select).length > 0) {
        newOrder.content = this.getSelectContent(order.playId, order.select)
      } else if (lotteryNew) {
        if (['连码', '自选不中', '中一', '特码包三'].includes(order.playName)) {
          newOrder.content = order.select.join()
        } else {
          newOrder.content = ''
        }
      }
      if (order.unit === 'yuan') {
        newOrder.mode = 1
      } else if (order.unit === 'jiao') {
        newOrder.mode = 2
      } else if (order.unit === 'fen') {
        newOrder.mode = 3
      }
      newOrder.point = order.rebate
      newOrder.nums = order.betNum
      newOrder.price = order.unitPrice
      newOrder.money = order.totalPrice

      order_list.push(newOrder)
    }

    let plan_list = [], newPlan = {}
    if (planList && planList.length > 0) {
      planList = planList.filter(n => Number(n.multiple) !== 0)
      for (let plan of planList) {
        newPlan = {}
        newPlan.issue_no = plan.issue_no
        newPlan.multiple = plan.multiple
        plan_list.push(newPlan)
      }
    }

    let requestData = {
      act: 10006,
      lottery_id: orderInfo.lotteryId || -1,
      order_list,
      plan_list,
      win_stop: winStop ? 1 : 0,
      issue_no: lotteryInfo.issue,
    }
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': userInfo.token,
    }

    if (isDiffIssue) {
      Alert.alert('', `期次已变化，当前是${lotteryInfo.issue}期，是否继续投注？`, [
        {text: '取消', onPress: () => {
            callBack()
            return false
          }},
        {text: '确定', onPress: () => {
            this.bettingFetch(requestData, headers, callBack)
          }},
      ], { cancelable: false })
    } else {
      this.bettingFetch(requestData, headers, callBack)
    }
  }

  bettingFetch = (requestData, headers, callBack) => {
    const { userInfo, navigation, clearOrderList, getUserInfo } = this.props
    fetchWithStatus(requestData, headers).then((res) => {
      callBack()
      if (res) {
        if (res.status === 0) {
          clearOrderList()
          getUserInfo(userInfo.token)
          Alert.alert('', res.message, [
            {text: '确定', onPress: () => {
                navigation.goBack()
              }},
          ], { cancelable: false })

        }
      }
    }).catch((res) => {
      callBack()
      if (Number(res.status) !== 0 && res.message.includes('余额不足')) {
        this.setState({ modalVisible: true })
      } else if (Number(res.status) !== 0 && res.message.includes('用户未登')) {
        Alert.alert('', res.message, [
          {text: '取消', onPress: () => {}},
          {text: '去登录', onPress: () => {
              navigation.navigate('LoginPage')
            }},
        ], { cancelable: false })
      } else {
        toastShort(res.message)
      }
    })
  }

  getSelectContent = (playId, data) => {
    let keys = Object.keys(data)
    let newData = Array.from({length: keys.length})
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let item = data[key]
      if (['54', '111', '146', '153', '154', '61', '64', '69', '2020'].includes(playId)) {
        if (!item || item.length <= 0) {
          newData[i] = '_'
        } else {
          newData[i] = item.join(',')
        }
      } else {
        newData[i] = item.join(',')
      }
    }
    return newData.join('|')
  }

  render() {
    const { navigation, orderList, clearOrderList, delOrder, userInfo, lotteryMap,
      lotteryInfo, removeCurrentIssue, orderInfo, countdownOver } = this.props
    const { modalVisible, isBetting } = this.state

    let total = 0
    for (let order of orderList) {
      total = MathAdd(total, order.totalPrice)
    }
    return (
      <View style={{flex: 1, backgroundColor: '#F9FAFC'}}>
        <LotteryNavBar
          navigation={navigation}
          title={'投注单'}/>
          <Countdown
            data={lotteryInfo}
            simpleMode={'A'}
            removeCurrentIssue={removeCurrentIssue}
            countdownOver={() => countdownOver(orderInfo.lotteryId)}
            categoryId={orderInfo.categoryId}/>
        <View style={styles.fns}>
          {
            [{num: 1, text: '机选一注'}, {num: 5, text: '机选五注'}].map((random, index) => (
              <TouchableOpacity
                key={index}
                style={styles.fnWrap}
                underlayColor='transparent'
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.randomBet(random.num)}}>
                <View style={styles.fn}>
                  <Image style={styles.addIcon} source={require('../../src/img/ic_add.png')}/>
                  <Text style={styles.autoText}>{random.text}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
          <TouchableOpacity
            style={styles.fnWrap}
            underlayColor='transparent'
            onPress={() => {
              Sound.stop()
              Sound.play()
              orderList && orderList.length > 0 ?
              navigation.navigate('PlanList', { betting: this.betting }) : toastShort('请先选择号码')
            }}>
            <View style={styles.fn}>
              <Text style={styles.chaseText}>智能追号</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1}}>

          <Image
            style={styles.imgTop}
            source={require('../../src/img/orderitemtop.png')}/>

          <View style={styles.container}>
            {
              orderList.length > 0 ? (
                <ListView
                  removeClippedSubviews={false}
                  bounces={false}
                  dataSource={ds.cloneWithRows([...orderList, { betNum: 'blank' }])}
                  renderRow={(rowData, sectionID, rowID) => (
                    <OrderItem
                      rowData={rowData} delOrder={delOrder} index={rowID}
                      zhengMaGuoGuanPlay={rowData.playName === '正码过关' && lotteryMap[orderInfo.lotteryId].playInfo.filter(play => play.name === '正码过关')[0]}/>
                  )}/>
              ) : (
                <Image
                  style={{resizeMode: 'stretch', width: width-22.5, marginLeft: 8.5}}
                  source={require('../../src/img/orderitembottom.png')}/>
              )
            }
          </View>

        </View>

        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.delBtn}
            underlayColor='transparent'
            onPress={() => {
              Sound.stop()
              Sound.play()
              if (orderList.length > 0 && !this.alertPresent) {
                this.alertPresent = true
                Alert.alert('', '是否删除所有注单？', [
                  {text: '取消', onPress: () => {this.alertPresent = false}},
                  {text: '确定', onPress: () => {
                      clearOrderList()
                      this.alertPresent = false
                    }},
                ], { cancelable: false })
              }
            }}>
            <Text style={styles.delBtnText}>清空</Text>
          </TouchableOpacity>
          <View style={styles.total}>
            <View>
              <Text style={styles.totalText}>
                合计
                <Text style={styles.balance}>
                  {total}元
                </Text>
              </Text>
            </View>
            <View>
              <Text style={styles.totalText}>
                可用余额
                <Text style={styles.balance}>
                  {userInfo && userInfo.account_balance ? Number(userInfo.account_balance) : 0}元
                </Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.betBtn}
            underlayColor='transparent'
            disabled={isBetting}
            onPress={() => {
              Sound.stop()
              Sound.play()
              if (orderList && orderList.length <= 0) {
                toastShort('请先添加投注内容')
              } else {
                this.setState({
                  isBetting: true,
                }, () => {
                  this.betting(null, null, () => {
                    this.setState({
                      isBetting: false,
                    })
                  })
                })
              }
            }}>
            <Text style={styles.betBtnText}>
              {isBetting ? '投注中' : '投注'}
            </Text>
          </TouchableOpacity>
        </View>
        <AlertModal
          modalVisible={modalVisible}
          navigation={navigation}
          setModalVisible={(visibility) => this.setState({modalVisible: visibility})}
          userInfo={userInfo}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fns: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fnWrap: {
    flex: 1,
    paddingHorizontal: 10,
  },
  fn: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C9C9C9',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  addIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  autoText: {
    color: '#000000',
    fontSize: 14,
  },
  chaseText: {
    color: '#EC0909',
    fontSize: 14,
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
  delBtn: {
    width: 60,
    height: 30,
    backgroundColor: '#FFEFEF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Config.baseColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delBtnText:{
    color: Config.baseColor,
    fontSize: 16,
    letterSpacing: 1.37,
  },
  total: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  betBtn: {
    width: 60,
    height: 30,
    backgroundColor: Config.baseColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  betBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.37,
  },
  totalText: {
    fontSize: 15,
    color: '#000000',
  },
  balance: {
    fontSize: 15,
    color: Config.baseColor,
  },
  imgTop: {
    resizeMode: 'contain',
    marginHorizontal: 10,
    width: width - 20,
  },
  container: {
    marginTop: -24,
    marginLeft: 3,
  },
})

const mapStateToProps = ({ orderList, orderInfo, userInfo, lotteryInfo, lotteryMap}) => (
  {
    orderList,
    orderInfo,
    userInfo,
    lotteryInfo,
    lotteryMap,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    dispatch,
    clearOrderList: () => {
      dispatch(clearOrderList())
    },
    delOrder: (index) => {
      dispatch(delOrder(index))
    },
    addOrder: (randomInfo) => {
      dispatch(addOrder(randomInfo))
    },
    getUserInfo: (token) => {
      dispatch(getUserInfo(token))
    },
    removeCurrentIssue: (currentIssue) => {
      dispatch(removeCurrentIssue(currentIssue))
    },
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(OrderList)
