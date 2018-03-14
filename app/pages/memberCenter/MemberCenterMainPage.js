import React, { Component } from 'react'
import {
  View, Image, StyleSheet, Dimensions, Linking, Text, TouchableOpacity,
  DeviceEventEmitter, ScrollView, Alert, Animated, Easing, Clipboard,
} from 'react-native'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { toastShort } from '../../utils/toastUtil'
import ModalNotSatisfy from '../../components/modal/ModalNotSatisfy'
import { getUserInfo } from '../../actions'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

const RECORDS = [
  { action: 'bettingRecord', text: '投注记录', imgSrc: require('../../src/img/ic_record.png') },
  { action: 'accountDetails', text: '账户明细', imgSrc: require('../../src/img/ic_detail.png') },
  { action: 'rechargeRecord', text: '充值记录', imgSrc: require('../../src/img/ic_recharge.png') },
  { action: 'withdrawRecord', text: '提现记录', imgSrc: require('../../src/img/ic_withdraw.png') },
]

const FEATURES = [
  { action: 'bonusDetails', text: '奖金详情', imgSrc: require('../../src/img/ic_bonus.png') },
  { action: 'rulesPlay', text: '玩法规则', imgSrc: require('../../src/img/ic_rule.png') },
  { action: 'detailedSettings', text: '详细设定', imgSrc: require('../../src/img/ic_setting.png') },
  { action: 'announcement', text: '信息公告', imgSrc: require('../../src/img/ic_msg.png') },
  { action: 'myCollection', text: '我的收藏', imgSrc: require('../../src/img/ic_collection.png') },
  { action: 'onlineCustomers', text: '在线客服', imgSrc: require('../../src/img/ic_hotline.png') },
  { action: 'QQCustomers', text: 'QQ客服', imgSrc: require('../../src/img/ic_qq.png') },
  { action: 'securityCenter', text: '安全中心', imgSrc: require('../../src/img/ic_security_center.png') },
]

const windowWidth = Dimensions.get('window').width

class MemberCenterMainPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isShowFundPwdModal: false,
      isShowBankCardModal: false,
    }
    this.spinValue = new Animated.Value(0)
    this.needAnimate = false
    this._onPressSetting = this._onPressSetting.bind(this)
    this._onPressUserFuns = this._onPressUserFuns.bind(this)
    this._onPressFeature = this._onPressFeature.bind(this)
    this.spin = this.spin.bind(this)
  }

  componentDidMount() {
    if (this.props.userInfo.token) {
      this._fetchSysData()
    }
    this.subscriptUpdateSysInfos = DeviceEventEmitter.addListener('lISTENER_UPDATE_SYS_INFOS', () => {
      this._fetchSysData()
    })
  }

  componentWillUpdate(nextProps){
    if (this.props.userInfo.token && !nextProps.userInfo.token) {
      this.setState({ isLogin: false })
    }
  }

  componentWillUnmount() {
    this.subscriptUpdateSysInfos.remove()
  }

  _fetchSysData() {
    const { getUserInfo, userInfo } = this.props
    getUserInfo(userInfo.token)
  }

  _onPressFeature(action) { // 后续用组件数组匹配index
    const { userInfo, navigation, clientServiceUrl, qqLink } = this.props
    if (!userInfo.token && !['rulesPlay', 'detailedSettings', 'bonusDetails',
      'announcement', 'onlineCustomers', 'QQCustomers', 'securityCenter', 'agentRegister'].includes(action)) {
      toastShort('请先登录!')
      return
    }
    if (userInfo.account_type === 2 ){
      if(action === 'rechargeRecord' || action === 'withdrawRecord'){
        toastShort('试玩账号不能操作该功能!')
        return
      }
    }
    if (action === 'bettingRecord') {
      navigation.navigate('RecordStack')
    } else if (action === 'accountDetails') {
      navigation.navigate('AccountDetailMainPage')
    } else if (action === 'rechargeRecord') {
      navigation.navigate('RechargeRecordPage')
    } else if (action === 'withdrawRecord') {
      navigation.navigate('WithDrawRecordPage')
    } else if (action === 'rulesPlay') {
      navigation.navigate('Rules')
    } else if (action === 'detailedSettings') {
      navigation.navigate('SettingDetailMainPage')
    } else if (action === 'bonusDetails') {
      navigation.navigate('BonusMainPage')
    } else if (action === 'myCollection') {
      navigation.navigate('CollectionMainPage', { token: userInfo.token })
    } else if (action === 'announcement') {
      navigation.navigate('InfoMainPage', { token: userInfo.token })
    } else if (action === 'onlineCustomers') {
      if (clientServiceUrl) {
        Linking.openURL(clientServiceUrl)
      } else {
        toastShort('无法获取客服地址！')
      }
    } else if (action === 'QQCustomers') {
      let url =  qqLink
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url)
        } else {
          let val = this.getParam(url, 'uin')
          Alert.alert('', `请手动添加QQ客服: ${val}`, [
            { text: '复制', onPress: () => {
              Clipboard.setString(val)
            }},
          ])
        }
      })
    } else if (action === 'securityCenter') {
      this._onPressSetting(true)
    } else if (action === 'agentCenter') {
      navigation.navigate( 'AgentMain', {userInfo: userInfo})
    } else if (action === 'agentRegister') {
      navigation.navigate('RegisterAgent')
    }
  }

  getParam(url, key) {
    let val = ''
    if (url.indexOf('?') != -1) {
      let paramsStr= url.substring(url.indexOf('?') + 1)
      let params = paramsStr.split('&')
      for (let param of params) {
        let obj = param.split('=')
        if (obj[0] == key) {
          val = obj[1]
          break
        }
      }
    }
    return val
  }

  _onPressSetting(securityCenter=false) {
    const { navigation } = this.props
    navigation.navigate( 'SettingPage', { securityCenter: securityCenter, navigation })
  }

  _onPressUserFuns(action) {
    const { userInfo, navigation } = this.props

    if (!userInfo.token) {
      toastShort('请先登录!')
      return
    }
    const { funds_pwd_status, user_bank_status } = userInfo
    if (userInfo.account_type === 2) {
      toastShort('试玩账号不能操作该功能!')
    } else if (action === 'recharge') {
      navigation.navigate('RechargeMainPage')
    } else if (action === 'withdraw') {
      if (funds_pwd_status === 0) { // 未设置资金密码
        this.setState({ isShowFundPwdModal: true })
      } else if (user_bank_status === 0) { // 未设置银行卡
        this.setState({ isShowBankCardModal: true })
      } else {
        navigation.navigate('WithDrawCashPage')
      }
    }
  }
  spin () {
      this.spinValue.setValue(0)
      Animated.timing(
          this.spinValue,
          {
              toValue: 1,
              duration: 1000,
              easing: Easing.linear,
          }
      ).start(() => {
        if (this.needAnimate) {
            this.spin()
        }
      })
  }

  render() {
    const { isShowFundPwdModal, isShowBankCardModal } = this.state
    const { navigation, userInfo, qqLink, getUserInfo } = this.props
    const { user_name, account_balance, user_is_agent } = userInfo
    let featuresData = Immutable.fromJS(FEATURES).toJS()
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })
    if (userInfo.token) {
      if (user_is_agent == 1) {
        featuresData.unshift(
          { action: 'agentCenter', text: '代理中心', imgSrc: require('../../src/img/ic_agent_center.png') }
        )
      }
    } else {
      featuresData.unshift(
        { action: 'agentRegister', text: '加入代理', imgSrc: require('../../src/img/ic_agent_center.png') }
      )
      featuresData.pop()
    }
    if (!qqLink) {
      featuresData = featuresData.filter(n => n.text !== 'QQ客服')
    }
    if (featuresData.length % 3 !== 0) {
      featuresData = featuresData.concat(Array.from({length: 3 - ((featuresData.length) % 3)}))
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            {
              userInfo.token ? (
                <View style={styles.logged}>
                  <View style={styles.loggedRow}>
                    <View style={styles.userInfoLeft}>
                      <Image style={styles.avatar} source={require('../../src/img/user_profile_not_logined.png')} />
                    </View>
                    <View style={styles.userInfoRight}>
                      <View style={styles.userName}>
                        <Text style={styles.userNameText}>{user_name}</Text>
                      </View>
                      <View style={styles.balance}>
                        <Image style={styles.walletIcon} source={require('../../src/img/wallet.png')} />
                        <Text style={styles.balanceText}>{account_balance}</Text>
                        <TouchableOpacity onPress={() => {
                          this.spin()
                          getUserInfo(userInfo.token)
                        }}>
                          <Animated.Image style={[styles.refreshIcon, {transform: [{rotate: spin}] }]}
                                          source={require('../../src/img/refresh.png')} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.loggedRow, {marginTop: 13}]}>
                    <View style={styles.userFunsLeft} />
                    <View style={styles.userFunsRight}>
                      <TouchableOpacity
                        style={[styles.userFunsBtn, styles.rechargeBtn]}
                        onPress={() => {this._onPressUserFuns('recharge')}}>
                        <Text style={styles.rechargeText}>充值</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.userFunsBtn, styles.withdrawBtn]}
                        onPress={() => {this._onPressUserFuns('withdraw')}}>
                        <Text style={styles.withdrawText}>提现</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.notLoggedIn}>
                  <View>
                    <Text style={styles.welcomeText}>Hello,你好</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.loginWrap}
                    activeOpacity={0.85}
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      navigation.navigate('LoginPage')
                    }}>
                    <Text style={styles.loginText}>登录／注册</Text>
                  </TouchableOpacity>
                </View>
              )
            }
            <View style={styles.iconWrap}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  this._onPressSetting()
                }}>
                <Image style={styles.iconRight} source={require('../../src/img/ic_set.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.recordWrap}>
          {
            RECORDS.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.recordItem}
                  activeOpacity={0.85}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this._onPressFeature(item.action)
                  }}>
                  <Image style={styles.recordIcon} source={item.imgSrc} />
                  <Text style={styles.recordText}>{item.text}</Text>
                </TouchableOpacity>
              )
            })
          }
          </View>
          <View style={styles.featuresWrap}>
          {
            featuresData.map((item, index) => {
              if (item) {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.feature, index !== 0 && (index + 1) % 3 === 0 && {marginRight: 0}]}
                    activeOpacity={0.85}
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      this._onPressFeature(item.action)
                    }}>
                    <Image style={styles.featureIcon} source={item.imgSrc} />
                    <Text style={styles.featureText}>{item.text}</Text>
                  </TouchableOpacity>
                )
              } else {
                return (
                  <View key={index} style={[styles.feature, index !== 0 && (index + 1) % 3 === 0 && {marginRight: 0}]} />
                )
              }

            })
          }
          </View>
          <ModalNotSatisfy
            visible={isShowFundPwdModal}
            title={'陛下'}
            content={'您没有设置资金密码'}
            tip={'请第一时间设置资金密码'}
            textUp={'去设置'}
            onPressUp={() => {
              this.setState({ isShowFundPwdModal: false })
              navigation.navigate('FundPwdPage')
            }}
            onPressDown={() => this.setState({ isShowFundPwdModal: false })}/>
          <ModalNotSatisfy
            visible={isShowBankCardModal}
            title={'陛下'}
            content={'您没有绑定银行卡'}
            tip={'请第一时间绑定银行卡'}
            textUp={'去绑定'}
            onPressUp={() => {
              this.setState({ isShowBankCardModal: false })
              navigation.navigate('BankCardAddPage')
            }}
            onPressDown={() => this.setState({ isShowBankCardModal: false })}/>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  header: {
    backgroundColor: Config.baseColor,
    height: 150,
    paddingTop: 27,
  },
  iconWrap: {
    position: 'absolute',
    top: 27,
    right: 11,
  },
  iconRight: {
    width: 25,
    height: 25,
  },
  notLoggedIn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  loginWrap: {
    marginTop: 20,
    width: 110,
    height: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFFFFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  recordWrap: {
    height: 75,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  recordItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordIcon: {
    width: 25,
    height: 25,
  },
  recordText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 14,
  },
  featuresWrap: {
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  feature: {
    backgroundColor: '#FFFFFF',
    width: (windowWidth - 2) / 3,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    marginRight: 1,
  },
  featureIcon: {
    width: 30,
    height: 30,
  },
  featureText: {
    marginTop: 14,
    color: '#333333',
    fontSize: 14,
  },
  logged: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loggedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoLeft: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  userInfoRight: {
    flex: 4,
    flexDirection: 'column',
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  balance: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    width: 18,
    height: 17,
  },
  balanceText: {
    marginLeft: 9,
    marginRight: 20,
    color: '#FFFFFF',
    fontSize: 20,
  },
  refreshIcon: {
    width: 20,
    height: 20,
  },
  userFunsLeft: {
    flex: 1.5,
  },
  userFunsRight: {
    flex: 4,
    flexDirection: 'row',
  },
  userFunsBtn: {
    width: 73,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  rechargeBtn: {
    backgroundColor: '#FFEB2E',
  },
  withdrawBtn: {
    marginLeft: 25,
    backgroundColor: '#C90028',
  },
  rechargeText: {
    fontSize: 15,
    color: '#FF0033',
    letterSpacing: 1.5,
  },
  withdrawText: {
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
})

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    clientServiceUrl: state.sysInfo.clientServiceUrl,
    qqLink: state.sysInfo.qqLink,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: (token) => {dispatch(getUserInfo(token))},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberCenterMainPage)
