import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ListView,
  Alert,
} from 'react-native'
import {
  getBetCountdown,
  getUserInfo,
} from '../../actions'
import LotteryNavBar from '../../components/lotteryNavBar'
import Countdown from '../../components/countdown'
import Immutable from 'immutable'
import { fetchWithStatus } from '../../utils/fetchUtil'
import { toastShort } from '../../utils/toastUtil'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import AlertModal from '../../components/modal/alertModal'


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class PcddOrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: Immutable.fromJS(props.navigation.state.params.data).toJS(),
      isBetting: false,
      modalVisible: false,
    }
    this.delOrder = this.delOrder.bind(this)
    this.handleBetting = this.handleBetting.bind(this)
    this.bettingFetch = this.bettingFetch.bind(this)
  }

  delOrder(index) {
    let data = this.state.data
    data.splice(index, 1)
    this.setState({
      data,
    }, () => {
      this.props.navigation.state.params.delBetItem(index)
    })
  }

  handleBetting(callBack) {
    const { lotteryInfo, userInfo, navigation } = this.props
    const { lotteryId } = navigation.state.params
    let data = this.state.data
    if (data && data.length <= 0) {
      toastShort("请先添加投注内容",()=>{
        callBack()
      })
    } else {
      let isDiffIssue = false
      let order_list = []
      for (let order of data) {
        if (order.issue != lotteryInfo.issue) {
          isDiffIssue = true
        }
        order_list.push({
          play_id: order.play_id,
          bet_content: order.label,
          price: order.money,
        })
      }

      let body = {
        act: 10060,
        lottery_id: lotteryId,
        issue_no: lotteryInfo.issue,
        order_list,
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
            this.bettingFetch(body, headers, callBack)
          }},
        ])
      } else {
        this.bettingFetch(body, headers, callBack)
      }

    }
  }

  bettingFetch(body, headers, callBack) {
    const { getUserInfo, userInfo, navigation } = this.props
    const { delBetResults } = navigation.state.params
    fetchWithStatus(body, headers).then((res) => {
      callBack()
      if (res) {

        if (res.status === 0) {
          this.setState({
            data: [],
          }, () => {
            delBetResults()
            getUserInfo(userInfo.token)
          })
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
        Alert.alert('', res.message, [
          {text: '确定', onPress: () => {}},
        ], { cancelable: false })
      }
    })
  }

  render() {
    const { navigation, lotteryInfo, countdownOver, userInfo } = this.props
    const { lotteryId, delBetResults } = navigation.state.params
    const { modalVisible, data, isBetting } = this.state

    let totalPrice = 0
    for (let item of data) {
      totalPrice += Number(item.money)
    }
    return (
      <View style={{flex: 1, backgroundColor: '#f2f2f8'}}>
        <LotteryNavBar
          navigation={navigation}
          title={'投注单'}/>
        <Countdown
          data={lotteryInfo}
          simpleMode={'A'}
          countdownOver={() => countdownOver(lotteryId)}/>
        <View style={{flex: 1}}>
          <Image style={styles.bgImg} source={require('../../src/img/bg_betDetails.png')} >
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.cell}>下注类型</Text>
                <Text style={styles.cell}>号码</Text>
                <Text style={styles.cell}>赔率</Text>
                <Text style={styles.cell}>金额</Text>
                <Text style={styles.del} />
              </View>
              <ListView
                enableEmptySections = {true}
                bounces={false}
                style={{flex: 1}}
                dataSource={ds.cloneWithRows(data)}
                removeClippedSubviews={false}
                renderRow={(rowData, sectionID, rowID) =>
                  <View style={styles.item}>
                    <Text style={styles.cell}>{rowData.typeName}</Text>
                    <Text style={[styles.cell, styles.highLine]}>{rowData.label}</Text>
                    <Text style={styles.cell}>{rowData.odds}</Text>
                    <Text style={[styles.cell, styles.highLine]}>{rowData.money}</Text>
                    <TouchableOpacity
                      style={styles.del}
                      underlayColor='transparent'
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        this.delOrder(rowID)
                      }}>
                      <Image style={styles.delImg} source={require('../../src/img/ic_del_small.png')} />
                    </TouchableOpacity>
                  </View>}/>
            </View>
          </Image>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.delBtn}
            underlayColor='transparent'
            onPress={() => {
              Sound.stop()
              Sound.play()
            if(data.length > 0){
              Alert.alert('', '是否要重置所选内容？', [
                {text: '取消', onPress: () => {return false}},
                {text: '确定', onPress: () => {
                  this.setState({
                    data: [],
                  }, () => {
                    delBetResults()
                  })
                }},
              ])
            }
            }}>
            <Text style={styles.delBtnText}>清空</Text>
          </TouchableOpacity>
          <View style={styles.money}>
            <Text style={[styles.moneyText, {color: '#ff0000', paddingHorizontal: 3}]}>{data.length}</Text>
            <Text style={styles.moneyText}>注</Text>
            <Text style={[styles.moneyText, {color: '#ff0000', paddingHorizontal: 3}]}>{totalPrice}</Text>
            <Text style={styles.moneyText}>元</Text>
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
              }, () => {
                this.handleBetting(() => {
                  this.setState({
                    isBetting: false,
                  })
                })
              })
            }}>
            <Text style={styles.betBtnText}>{isBetting ? '投注中' : '投注'}</Text>
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

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  bgImg: {
    width: width,
    height: width * 845 / 722,
    marginTop: 10,
  },
  container: {
    marginTop: 20,
    marginRight:12,
    marginLeft: 14,
    height: width * 845 / 722 - 38,
  },
  header: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6E2D1',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
  },
  item: {
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#979797',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  highLine: {
    color: '#ff0000',
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
  del: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delImg: {
    width: 15,
    height: 15,
  },
})

const mapStateToProps = (state) => {
  const { lotteryInfo, userInfo } = state
  return {
    userInfo,
    lotteryInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
    getUserInfo: (token) => {
      dispatch(getUserInfo(token))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PcddOrderList)
