import React, { Component } from 'react'
import { StyleSheet, Image, DeviceEventEmitter, NetInfo, AsyncStorage, Platform } from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
import { connect } from 'react-redux'
import LobbyCenter from '../pages/lobby/main'
import Home from '../pages/home/main'
import MemberCenterMainPage from '../pages/memberCenter/MemberCenterMainPage'
import RecordMainPage from '../pages/order/RecordMainPage'
import ResultMainPage from '../pages/result/ResultMainPage'
import storageUtil from '../utils/storageUtil'
import { changeNetworkStatus, getUserInfo, setClientServiceUrl, setTabName } from '../actions'
import Sound from '../components/clickSound'
import Config from '../config/global'
import UmengPush from 'react-native-umeng-push'
import { fetchWithStatus } from '../utils/fetchUtil'

class TabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: props.selectedTab || 'home',
    }
    this.tabs = [
      {
        title: '首页',
        alias: 'home',
        icon: require('../src/img/home.png'),
        iconSelected: require('../src/img/home-full.png'),
        component: <Home navigation={props.navigation} />,
      },
      {
        title: '购彩',
        alias: 'lottery',
        icon: require('../src/img/buy.png'),
        iconSelected: require('../src/img/buy-full.png'),
        component: <LobbyCenter navigation={props.navigation} />,
        componentDefaultPcDD:  <LobbyCenter navigation={props.navigation} categoryId={'6'}/>,
      },
      {
        title: '开奖',
        alias: 'draw',
        icon: require('../src/img/lottery.png'),
        iconSelected: require('../src/img/lottery-full.png'),
        component: <ResultMainPage navigation={props.navigation} />,
      },
      {
        title: '注单',
        alias: 'form',
        icon: require('../src/img/bills.png'),
        iconSelected: require('../src/img/bills-full.png'),
        component: <RecordMainPage navigation={props.navigation} />,
      },
      {
        title: '会员中心',
        alias: 'memberCenter',
        icon: require('../src/img/user.png'),
        iconSelected: require('../src/img/user-full.png'),
        component: <MemberCenterMainPage navigation={props.navigation} />,
      },
    ]
    this.myTimeout = -1
  }

  componentDidMount() {
    this.props.setTabName(this.props.selectedTab || 'home')
    if (this.props.isConnectedNetWork) {
      this.reportEquipement(this.props.tokenVal)
      this.getService()
    }

    storageUtil.save('isInit', true) // 是否已安装初始化(首次安装有欢迎页)

    // 点击存款充值可能要跳到会员中心
    this.subscriptTabSelected = DeviceEventEmitter.addListener('lISTENER_TAB_SELECTED', (alias) => {
      let isDirePCDD = false
      if (alias === 'lottery') {
        isDirePCDD = true
      }

      this.setState({ selectedTab: alias, isDirePCDD })
    })

    NetInfo.isConnected.addEventListener('change', this.handleConnectionChange)

    if (!this.props.closeModal) {
      this.props.onReady(true)
    }

    this.ivUserInfo = setInterval(this.refreshUserInfo, 60000 * 5)
  }

  componentWillUnmount() {
    this.subscriptTabSelected.remove()
    NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange)
    clearInterval(this.ivUserInfo)
    clearTimeout(this.myTimeout)
  }

  async reportEquipement(tokenVal) {
    let pushToken = ''
    pushToken = await AsyncStorage.getItem('pushToken')
    UmengPush.getDeviceToken(async (deviceToken) => {
      if (deviceToken !== pushToken) {
        pushToken = deviceToken
        await AsyncStorage.setItem('pushToken', pushToken)
        let isIos = Platform.OS === 'ios'
        let appKey = isIos ? Config.umengAppKeyIos : Config.umengAppKeyAndroid
        const body = {
          act: 10048,
          push_token: pushToken,
          platform: isIos ? 1 : 2,
          app_key: appKey,
        }
        const headers = { 'token': tokenVal }
        fetchWithStatus(body, headers).then(() => {
        }).catch(res => {
          console.warn('err', res)
        })
      }
    })
  }

  getService = () => {
    fetchWithStatus({act: 10106}).then((res) => {// 获取客服地址
      if (res.status === 0) {
        this.props.setClientServiceUrl(res)
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  handleConnectionChange = (isConnected) => { // 监听是否联网
    if (isConnected) {
      this.reportEquipement(this.props.tokenVal)
      this.getService()
      DeviceEventEmitter.emit('lISTENER_REFRESH_LOTTERY_LIST')
      DeviceEventEmitter.emit('lISTENER_REFRESH_BONUS_LIST')
      DeviceEventEmitter.emit('lISTENER_REFRESH_ORDER_LIST')
    }
    this.props.updateNetworkStatus(isConnected)
  }

  refreshUserInfo = () => {
    const { getUserInfo, tokenVal, loginStatus } = this.props
    if (loginStatus && tokenVal) {
      getUserInfo(tokenVal)
    }
  }

  render() {
    const { loginStatus, setTabName } = this.props
    return (
      <TabNavigator>
      {
        this.tabs.map((item, index) => {
          return (
            <TabNavigator.Item
              key={index}
              selected={this.state.selectedTab === item.alias}
              tabStyle={styles.tab}
              title={item.title}
              titleStyle={styles.title}
              selectedTitleStyle={styles.selectedTitle}
              renderIcon={() => <Image style={styles.tabIcon} source={item.icon} resizeMode='contain'/>}
              renderSelectedIcon={() => <Image style={styles.tabIcon} source={item.iconSelected} resizeMode='contain'/>}
              badgeText={item.badge}
              onPress={() => {
                clearTimeout(this.myTimeout)
                Sound.stop()
                Sound.play()
                this.setState({ selectedTab: item.alias, isDirePCDD: false })
                if (item.alias === 'draw') {
                  DeviceEventEmitter.emit('lISTENER_REFRESH_BONUS_LIST') // 刷新开奖列表
                } else if (item.alias === 'memberCenter') {
                  if (loginStatus) {
                    DeviceEventEmitter.emit('lISTENER_UPDATE_SYS_INFOS') // 更新余额
                  }
                }
                this.myTimeout = setTimeout(() => {
                  setTabName(item.alias)
                }, 500)

              }}>
              {item.alias === 'lottery' && this.state.isDirePCDD ? item.componentDefaultPcDD : item.component}
            </TabNavigator.Item>
          )
        }

        )
      }
      </TabNavigator>
    )
  }

}

const styles = StyleSheet.create({
  tab: {
    justifyContent: 'center',
    backgroundColor: '#FAFCFF',
  },
  tabIcon: {
    width: 25,
    height: 25,
  },
  title: {
    fontSize: 11,
    color: '#666666',
  },
  selectedTitle: {
    fontSize: 11,
    color: Config.baseColor,
  },
})

const mapStateToProps = (state) => {
  return {
    loginStatus: state.sysInfo.loginStatus,
    tokenVal: state.sysInfo.tokenVal,
    isConnectedNetWork: state.sysInfo.isConnectedNetWork,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNetworkStatus: (isConnected) => dispatch(changeNetworkStatus(isConnected)),
    getUserInfo: (token) => {dispatch(getUserInfo(token))},
    setClientServiceUrl: (data) => dispatch(setClientServiceUrl(data)),
    setTabName: (tabName) => dispatch(setTabName(tabName)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBar)
