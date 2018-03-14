import React, { Component } from 'react'
import { StyleSheet, Image, View, Text, ScrollView, Dimensions,
  TouchableOpacity, Alert, InteractionManager, Platform } from 'react-native'
import HeadToolBar from '../../components/HeadToolBar'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import { connect } from 'react-redux'
import { RemoveLHClistItem, ClearLHClistItem, getUserInfo, getBetCountdown } from '../../actions'
import { toastShort } from '../../utils/toastUtil'
import CountDown from "../../components/countdown"
import Sound from './../../components/clickSound'
import Config from '../../config/global'
import BetItem from './betItem'
import AlertModal from '../../components/modal/alertModal'

const windowWidth = Dimensions.get('window').width

class BetDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isBetting: false,
      showDelay: false,
      modalVisible: false,
    }
  }

  delItem = (index, key) => {
    key? this.props.RemoveLHClistItem(index, key) : this.props.RemoveLHClistItem(index)

    if (Platform.OS !== 'ios') {
      this.setState({ showDelay: true }, () => {
        InteractionManager.runAfterInteractions(() => {
          this.setState({ showDelay: false })
        })
      })
    }
  }

  clearItem = () => {
    const num = this.props.LHCbetDetails['order_list'].length
    if(num > 0){
      Alert.alert('', '是否删除所有注单？', [
        {text: '取消', onPress: () => {}},
        {text: '确认', onPress: () => {
          Sound.stop()
          Sound.play()
          this.onPressClearTrue()
        }},
      ])
    }
  }

  onPressConfirm = (callback) => {
    if(this.props.LHCbetDetails['order_list'].length <= 0) {
      toastShort('请先添加投注内容')
        callback()
      return
    }
    const { LHCbetDetails, lotteryInfo } = this.props
    let isDiffIssue = false
    for (let item of LHCbetDetails['order_list']) {
      if (item.issue !== lotteryInfo.issue) {
        isDiffIssue = true
      }
    }
    if (isDiffIssue) {
      Alert.alert('', `期次已变化，当前是${lotteryInfo.issue}期，是否继续投注？`, [
        {text: '取消', onPress: () => {
          callback()
          return false
        }},
        {text: '确定', onPress: () => {
          this.bettingFetch(callback)
        }},
      ])
    } else {
      this.bettingFetch(callback)
    }
  }

  bettingFetch = (callbacck) => {
    const { LHCbetDetails, userInfo, ClearLHClistItem, navigation } = this.props
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': userInfo.token,
    }
    fetchWithOutStatus(LHCbetDetails, headers).then((res)=>{
      callbacck()
      if(res.status === 0){
        ClearLHClistItem()
        getUserInfo(userInfo.token)
        Alert.alert('', res.message, [
          {text: '确定', onPress: () => {
            Sound.stop()
            Sound.play()
            navigation.goBack()
          }},
        ], { cancelable: false })
      } else {
        if (Number(res.status) !== 0 && res.message.includes('余额不足')) {
          this.setState({ modalVisible: true })
        } else {
          Alert.alert('', res.message, [
            {text: '确定', onPress: () => {}},
          ], { cancelable: false })
        }
      }
    })
  }

  onPressGoRecharge = () => {
    const { userInfo, navigation } = this.props
    if (userInfo.account_type === 2) {
      toastShort('试玩账号不能操作该功能!')
    } else {
      navigation.navigate(
        'RechargeMainPage',
        {
          userName: userInfo.user_name,
          balance: userInfo.account_balance,
        }
      )
    }
  }
  onPressClearTrue = () => {
    this.props.ClearLHClistItem()
  }

  render() {
    const { orderInfo, lotteryInfo, countdownOver, userInfo, navigation, ClearLHClistItem } = this.props
    const data = this.props.LHCbetDetails
    const { modalVisible, showDelay, isBetting } = this.state

    let money = 0
    let bets = 0
    return(
      <View style={styles.container}>
        <HeadToolBar title={'投注单'} leftIcon={'back'} leftIconAction={() => navigation.goBack()} />
        <CountDown
          simpleMode={'A'}
          data={lotteryInfo}
          clearBet={() => ClearLHClistItem()}
          countdownOver={() => countdownOver(orderInfo.lotteryId)}
          lotteryId={20}
          categoryId={orderInfo.categoryId}
          recordOnPress={()=>{}}/>

        <View style={styles.content}>
          <View style={styles.betList}>
            <Image style={styles.contentBG} source={require('../../src/img/bg_betDetails.png')} >
          <ScrollView
            style={{flex: 1, width:windowWidth*0.9}}
            removeClippedSubviews={false}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}>
            { !showDelay &&
              data['order_list'].map((item, index)=>{
                if(item.gameNum === 6) {
                  bets += 1
                  money += Number(item.money)
                  let labels = []
                  let odds = []
                  let title = ``
                  let itemMoney = Number(item.money)
                  Object.keys(item.orders).map((v,i)=>{
                    const d = item.orders[v]
                    labels.push(<Text key={i}>{d.title+d.label+" "}</Text>)
                    odds.push(<Text key={i} style={styles.odds}>{d.odds+" "}</Text>)
                    title = `${Object.keys(item.orders).length}串1`
                  })
                  return <BetItem key={index} labels={labels} odds={odds}
name={item.name} title={title} itemMoney={itemMoney}
delItem={this.delItem} index={index} />
                }else if(item.gameNum === 7) {
                  const  typeArr = {"CH_4":"四全中","CH_3":"三全中","CH_32":"三中二","CH_2":"二全中","CH_2S":"二中特","CH_2SP":"特串"}
                  bets += item.zuhe
                  let labels = []
                  let odds = item.odds
                  let title = ``
                  let itemMoney = Number(item.money)
                  let totalMoney = itemMoney * item.zuhe
                  money += Number(totalMoney)
                  Object.keys(item.orders).map((v,i)=>{
                    const d = item.orders[v]
                    labels.push(<Text key={i}>{d+" "}</Text>)
                    title = typeArr[item.model]
                  })
                  return <BetItem key={index} labels={labels} odds={odds}
name={item.name} title={title} itemMoney={itemMoney}
delItem={this.delItem} index={index} zuhe={item.zuhe}
totalMoney={totalMoney} />
                }else if(item.gameNum === 8) {
                  const  typeArr = {"LX2":"二肖连","LX3":"三肖连","LX4":"四肖连","LX5":"五肖连"}
                  bets += item.zuhe
                  let labels = []
                  let odds = []
                  let title = ``
                  let itemMoney = Number(item.money)
                  let totalMoney = itemMoney * item.zuhe
                  money += Number(totalMoney)
                  Object.keys(item.orders).map((v,i)=>{
                    const d = item.orders[v]
                    labels.push(<Text key={i}>{d.label+" "}</Text>)
                    odds.push(<Text key={i} style={styles.odds}>{d.odds+" "}</Text>)
                    title = typeArr[item.model]
                  })
                  return <BetItem key={index} labels={labels} odds={odds}
name={item.name} title={title} itemMoney={itemMoney}
delItem={this.delItem} index={index} zuhe={item.zuhe}
totalMoney={totalMoney} />
                }else if(item.gameNum === 9) {
                  bets += item.zuhe
                  let labels = []
                  let odds = []
                  let itemMoney = Number(item.money)
                  let totalMoney = itemMoney * item.zuhe
                  money += Number(totalMoney)
                  Object.keys(item.orders).map((v,i)=>{
                    const d = item.orders[v]
                    labels.push(d.label)
                    odds.push(<Text key={i} style={styles.odds}>{d.odds+" "}</Text>)
                  })
                  return <BetItem key={index} labels={labels} odds={odds}
name={item.name} title={item.title} itemMoney={itemMoney}
delItem={this.delItem} index={index} zuhe={item.zuhe}
totalMoney={totalMoney} />
                }else if(item.gameNum === 10 ||item.gameNum === 23) {
                  bets += item.zuhe
                  let labels = []
                  let odds = item.odds
                  let itemMoney = Number(item.money)
                  let totalMoney = itemMoney * item.zuhe
                  money += Number(totalMoney)
                  Object.keys(item.orders).map((v,i)=>{
                    const d = item.orders[v]
                    labels.push(<Text style={styles.betItemText1} key={i}>{d+" "}</Text>)
                  })
                  return <BetItem key={index} labels={labels} odds={odds}
name={item.name} title={item.title} itemMoney={itemMoney}
delItem={this.delItem} index={index} zuhe={item.zuhe}
totalMoney={totalMoney} />
                }else if(item.gameNum === 14) {
                  bets += 1
                  money += Number(item.money)
                  let labels = []
                  let title
                  let odds = item.odds
                  let itemMoney = Number(item.money)
                  Object.keys(item.orders).map((v,i)=>{
                    const d = item.orders[v]
                    title = d.title
                    labels.push(<Text key={i}>{d.label+" "}</Text>)
                  })
                  return <BetItem key={index} labels={labels} odds={odds}
name={item.name} title={title} itemMoney={itemMoney}
delItem={this.delItem} index={index} />
                }else {
                  return(
                    Object.keys(item.orders).map((v,i)=>{
                      const d = item.orders[v]
                      money += Number(d.money)
                      bets += 1
                      return <BetItem key={index + i} labels={d.label} odds={d.odds}
name={item.name} title={d.title} itemMoney={d.money}
delItem={this.delItem} index={index} v={v} />
                    })
                  )
                }
              })
            }
             </ScrollView>
             </Image>
          </View>

        </View>
        <View style={styles.buyContent}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.delBtn}
            onPress={() => {
              Sound.stop()
              Sound.play()
              this.clearItem()
            }}>
            <Text style={styles.delBtnText}>清空</Text>
          </TouchableOpacity>
          <View style={styles.betInputLeft}>
            <Text style={styles.betMsg}> {bets}注  {money}元</Text>
          </View>
          <TouchableOpacity
            style={styles.betBtn}
            underlayColor='transparent'
            disabled={isBetting}
            onPress={() => {
              Sound.stop()
              Sound.play()
              this.setState({
                isBetting: true,
              }, () => { this.onPressConfirm(() => {
                this.setState({
                  isBetting: false,
                })
              }) })
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f9',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f9',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentBG: {
    width: windowWidth,
    height: windowWidth*1.15,
    paddingTop: 25,
    paddingBottom: 25,
    alignItems: 'center',
    resizeMode: 'contain',
    overflow: 'hidden',
  },
  betList: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  betItemText1: {
    fontSize: 13,
    fontWeight: '400',
    color: '#ff0000',
  },
  odds: {
    paddingRight: 5,
  },
  betMsg: {
    fontSize: 15,
    color: '#000000',
  },
  buyContent: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
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
  betInputLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const mapStateToProps = (state) => {
  const { LHCbetDetails, orderInfo, lotteryInfo, userInfo } = state
  return {
    LHCbetDetails,
    orderInfo,
    lotteryInfo,
    userInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    RemoveLHClistItem: (index, key) => {
      dispatch(RemoveLHClistItem(index, key))
    },
    ClearLHClistItem: () => {
      dispatch(ClearLHClistItem())
    },
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
    getUserInfo: (token) => {
      dispatch(getUserInfo(token))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetDetails)
