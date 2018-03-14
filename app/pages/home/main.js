import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Linking,
} from 'react-native'
import { connect } from 'react-redux'
import { toastShort } from '../../utils/toastUtil'
import { fetchWithStatus } from '../../utils/fetchUtil'
import { formatMoney } from '../../utils/formatUtil'
import HotLottery from './hotLottery'
import WinningList from './winningList'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import Activity from './activity'
import Notice from './notice'
import { getHomeData, getAdvert } from '../../actions'

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      isRefreshing: false,
    }
  }

  componentDidMount() {
    this.props.getAdvert()
    fetchWithStatus({act: 10106}).then((res) => { // 获取红包
      if (res.status === 0) {
        this.setState({ redPack: res.red_package_link })
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  handleRecharge = () => {
    const { userInfo } = this.props
    if (userInfo.account_type === 2) {
      toastShort('试玩账号不能操作该功能!')
    } else if (userInfo.token) {
      this.props.navigation.navigate('RechargeMainPage')
    } else {
      this.props.navigation.navigate('LoginPage')
    }
  }

  handleToTry = () => {
    const { userInfo, navigation } = this.props
    if (userInfo.account_type === 2) {
      toastShort('您正在使用的是试玩账号!')
    } else if (userInfo.token) {
      Alert.alert('', '你当前使用正式账号，确定进入试玩?', [
        { text: '点错了', onPress: () => {} },
        { text: '确认', onPress: () => { navigation.navigate('FreeAccountPage', { login: true }) } },
      ])
    } else {
      navigation.navigate('FreeAccountPage')
    }
  }

  handleLoginStatus = (status) => {
    const { navigation, userInfo } = this.props
    if (userInfo.token) {
      navigation.navigate('MemberCenterMainPage')
    } else if (status === 'login') {
      navigation.navigate('LoginPage')
    } else if (status === 'register') {
      navigation.navigate('RegisterPage')
    }
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true })
    setTimeout(() => {
      this.props.getHomeData()
      this.setState({ isRefreshing: false })
    }, 1000)
  }

  render() {
    const { navigation, clientServiceUrl, userInfo } = this.props
    const { isRefreshing, redPack } = this.state
    const isLogin = userInfo.token ? true : false
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f9' }}>
        <View style={styles.nav}>
          <View style={styles.navLeft}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.handleLoginStatus('login')
              }}>
              {
                !isLogin && (<Text allowFontScaling={false} style={styles.navText}>登录</Text>)
              }
            </TouchableOpacity>
          </View>
          <View style={styles.navMid}>
            <Text allowFontScaling={false}
              style={{ fontSize: 20, color: '#fff', fontWeight: '600', fontFamily: 'PingFang SC' }}>
              {Config.platformName}
            </Text>
          </View>
          <View style={styles.navRight}>
          {
            isLogin ? (
              <View style={styles.userBalance}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.handleLoginStatus()
                  }}>
                  <Image
                    source={require('../../src/img/ic_login.png')}
                    style={{ width: 22, height: 22 }}/>
                  <Text allowFontScaling={false} style={{ fontSize: 12, color: '#fff', paddingLeft: 5 }}>
                    {`¥ ${formatMoney(userInfo.account_balance)}`}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.handleLoginStatus('register')
                }}>
                {
                  !isLogin && (<Text allowFontScaling={false} style={styles.navText}>注册</Text>)
                }
              </TouchableOpacity>
            )
          }
          </View>
        </View>
            <ScrollView refreshControl={<RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh}
                tintColor={Config.baseColor}
                title='刷新加载中...'
                colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}/>}>
              <Activity navigation={navigation} />
              <View style={styles.container}>
                <View style={styles.main}>
                  <Notice navigation={navigation} />
                  <View style={styles.fun}>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        this.handleRecharge()
                      }}>
                      <Image source={require('../../src/img/fun_recharge.png')} style={styles.funIcon}/>
                      <Text allowFontScaling={false} style={{fontSize: 14, color: '#333333'}}>
                        存款充值
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        this.handleToTry()
                      }}>
                      <Image source={require('../../src/img/fun_free.png')} style={styles.funIcon}/>
                      <Text allowFontScaling={false} style={{ fontSize: 14, color: '#333333'}}>
                        免费试玩
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        navigation.navigate('Promotion')
                      }}>
                      <Image source={require('../../src/img/fun_agent.png')} style={styles.funIcon}/>
                      <Text allowFontScaling={false} style={{fontSize: 14, color: '#333333'}}>
                        优惠活动
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        if (clientServiceUrl) {
                          Linking.openURL(clientServiceUrl)
                        } else {
                          toastShort('无法获取客服地址！')
                        }

                      }}>
                      <Image source={require('../../src/img/fun_service.png')} style={styles.funIcon}/>
                      <Text allowFontScaling={false} style={{fontSize: 14, color: '#333333'}}>
                        在线客服
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <HotLottery navigation={navigation}/>
                <WinningList/>
              </View>
            </ScrollView>
            {
              !!redPack &&
              <TouchableOpacity
                style={styles.redpackTouch}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  Linking.openURL(redPack)
                }}
                >
                <Image
                  source={require('../../src/img/redpack.png')}
                  style={styles.redpack}
                  />
              </TouchableOpacity>
            }

      </View>
    )
  }
}

const styles = StyleSheet.create({
  nav: {
    paddingTop: 20,
    height: 64,
    backgroundColor: Config.baseColor,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 6,
    paddingBottom: 7,
  },
  navLeft: {
    flex: 1,
  },
  navMid: {
    flex: 1,
    alignItems: 'center',

  },
  navRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingBottom: 4,
  },
  userBalance: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f9",
    position: 'relative',
  },
  main: {
    backgroundColor: '#FFFFFF',
  },
  fun: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 13,
  },
  funIcon: {
    width: 45,
    height: 45,
    marginBottom: 5,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redpack: {
    height: 80,
    width: 80,
  },
  redpackTouch: {
    position: 'absolute',
    right: 10,
    bottom: 20,
  },
})

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    clientServiceUrl: state.sysInfo.clientServiceUrl,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHomeData: () => {
      dispatch(getHomeData())
    },
    getAdvert: () => {
      dispatch(getAdvert())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
