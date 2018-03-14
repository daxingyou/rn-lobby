import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Alert,
  CameraRoll, Image, Platform, Linking, PermissionsAndroid, ScrollView, Clipboard,
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { fetchWithStatus } from '../../../utils/fetchUtil'
import Sound from '../../../components/clickSound'
import { toastShort } from '../../../utils/toastUtil'
import Config from '../../../config/global'

const isAndroid = Platform.OS !== 'ios'
let RNFetchBlob = null
if (isAndroid) {
  RNFetchBlob = require('react-native-fetch-blob').default
}

class FriendsPay extends Component {
  constructor(props) {
    super(props)

    let time = new Date()
    let m = time.getMonth() + 1
    let h = time.getHours()
    if (h < 10) {
     h = '0' + h
    }
    let t = time.getFullYear() + "-" + m + "-" + time.getDate() + " " + h + ":" + time.getMinutes()

    this.state = {
      money: props.money,
      time: t,
      verify: '',
      isLoading: false,
    }

    this.formSubmit = this.formSubmit.bind(this)
    this.screenshot = this.screenshot.bind(this)
  }


  async _requestPermission (imgUrl, schemeURL, payType) {
    let result = await PermissionsAndroid.requestPermission(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: ' 权限请求 ',
        message: ' 该应用需要如下权限 ' + ' 保存图片 ' + ' 请授权! ',
      },
    )
    if (result) {
      RNFetchBlob.config({
        appendExt : 'jpeg',
        fileCache : true,
      })
      .fetch('GET', imgUrl)
      .then((res) => {
        CameraRoll.saveToCameraRoll(res.path()).then(() => {
          Linking.canOpenURL(schemeURL).then(supported => {
            if (supported) {
              Linking.openURL(schemeURL)
            } else {
              toastShort(`请打开${payType}, 然后扫描保存到相册内的二维码!（如已安装请手动打开${payType}）`)
            }
          })
        })
      })
    }
  }

  getConfig(type) {
    let schemeURL = '', payType = '', payAccount = '账号'
    if (type === '8') {
      schemeURL = 'alipay://'
      payType = '支付宝'
      payAccount = '支付宝实名'
    } else if (type === '9') {
      schemeURL = 'weixin://'
      payType = '微信'
      payAccount = '微信账号'
    } else if (type === '19') {
      schemeURL = 'mqqapiwallet://'
      payType = 'QQ钱包'
      payAccount = 'QQ账号'
    } else if (type === '20') {
      schemeURL = 'jdpay://'
      payType = '京东钱包'
      payAccount = '京东账号'
    } else if (type === '21') {
      schemeURL = 'baiduwallet://'
      payType = '百度钱包'
      payAccount = '百度账号'
    } else if (type === '22') {
      schemeURL = ''
      payType = '通用'
      payAccount = '账号'
    }
    return {schemeURL, payType, payAccount}
  }

  screenshot() {
    const { data, type } = this.props.navigation.state.params
    let payConfig = this.getConfig(type)

    if (isAndroid) {
      this._requestPermission(data.code_img_url, payConfig.schemeURL, payConfig.payType)
    } else {
      CameraRoll.saveToCameraRoll(data.code_img_url).then(() => {
        if (payConfig.schemeURL) {
          Linking.canOpenURL(payConfig.schemeURL).then(supported => {
            if (supported) {
              Linking.openURL(payConfig.schemeURL)
            } else {
              toastShort(`请打开${payConfig.payType}, 然后扫描保存到相册内的二维码!（如已安装请手动打开${payConfig.payType}）`)
            }
          })
        }
      })
    }
  }

  formSubmit() {
    this.setState({
      isLoading: true,
    }, () => {
      const { money, time, verify } = this.state
      if (!money) {
        toastShort('请输入金额')
        this.setState({isLoading: false})
      } else if (!time) {
        toastShort('请输入存入时间')
        this.setState({isLoading: false})
      } else if (!verify) {
        toastShort(`请输入${this.props.navigation.state.params.type === '8' ? '支付宝实名' : '微信账号'}`)
        this.setState({isLoading: false})
      } else {
        const { data, type } = this.props.navigation.state.params
        let body = {
          act: 10049,
          amount: money,
          recharge_date: time,
          remark: verify,
          recharge_account_id: data.recharge_account_id,
          recharge_category_id: type === '8' ? 8 : 9,
        }
        const headers = { token: this.props.token }
        fetchWithStatus(body, headers).then((res) => {
          this.setState({isLoading: false})
          if (res) {
            if (res.status == 0) {
              Alert.alert('', res.message, [
                { text: '确认', onPress: () => { this.props.navigation.dispatch({ type: 'RESET_NAV' }) }},
              ], { cancelable: false })
            } else {
              Alert.alert('', res.message, [
                { text: '确认', onPress: () => { return false }},
              ])
            }
          }
        }).catch(err => {
          this.setState({isLoading: false})
          console.warn(err)
          Alert.alert('', err.message, [
            { text: '确认', onPress: () => { return false }},
          ])
        })
      }

    })

  }

  render() {
    const { money, time, verify, isLoading } = this.state
    const { data, type } = this.props.navigation.state.params
    let payConfig = this.getConfig(type)
    let isGeneral = payConfig.payType == '通用'
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.navRight}
            onPress={() => {Sound.stop();Sound.play();this.props.navigation.goBack()}}>
            <Image style={styles.iconBack} source={require('../../../src/img/ic_back.png')} />
          </TouchableOpacity>
          <View style={styles.navCenter}>
            <Text style={styles.title}>{isGeneral ? '通用扫码支付' : `${payConfig.payType}好友支付`}</Text>
          </View>
          <View style={styles.navLeft} />
        </View>

        <ScrollableTabView
          tabBarActiveTextColor={Config.baseColor}
          tabBarUnderlineStyle={{backgroundColor: Config.baseColor}}
          tabBarTextStyle={{fontSize: 16, paddingTop: 10}}>
          <View tabLabel={isGeneral ? '扫码支付' : '我要添加好友支付'} style={{flex: 1}}>
            <ScrollView style={{}}>
              <View style={styles.form}>
                <View style={styles.tips}>
                  <Text>
                    {payConfig.payAccount}：{data.recharge_account_name}
                  </Text>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      Clipboard.setString(data.recharge_account_name)
                    }}>
                    <Text style={styles.copyText}>
                      复制
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: 10}}>
                  <Text>
                    充值金额：{this.props.navigation.state.params.money}
                  </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  {data.code_img_url !== '' && <Image source={{ uri: data.code_img_url }} style={{ height: 200, width: 200, marginVertical: 20 }} />}
                </View>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      this.screenshot()
                    }}>
                    <View style={[styles.btn, {width: 190}]}>
                      <Text style={styles.btnText}>{`立即扫码${!isGeneral ? '加好友' : ''}`}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20 }}>扫码步骤：</Text>
                  <Text style={{ fontSize: 14, color: '#555', lineHeight: 22 }}>{`1.点“立即扫码${!isGeneral ? '加好友' : ''}”将自动保存二维码到相册`}</Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>2、{`请在${!isGeneral ? payConfig.payType : '支付宝，微信，QQ，京东，百度'}中打开“扫一扫”`}</Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>3、在扫一扫中点击右上角，选择“从相册选取二维码”选取截屏的图片</Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>4、输入您要充值的金额并进行转账。</Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>5、支付完成以后请到（已支付，我要提单）填写验证信息（您的{payConfig.payAccount}）</Text>
                  <Text style={{ fontSize: 14, color: '#555' }}>6、如充值未及时到账请联系在线客服</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          <View tabLabel='已支付，我要提单'>
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.left}>
                  <Text style={styles.label}>充值金额：</Text>
                </View>
                <View style={styles.right}>
                  <TextInput
                    underlineColorAndroid={'transparent'}
                    style={styles.input}
                    keyboardType={'numeric'}
                    onChangeText={text => {
                      this.setState({money: text})
                    }}
                    value={money}/>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.left}>
                  <Text style={styles.label}>存入时间：</Text>
                </View>
                <View style={styles.right}>
                  <TextInput
                    underlineColorAndroid={'transparent'}
                    style={styles.input}
                    onChangeText={text => {
                      this.setState({time: text})
                    }}
                    value={time}/>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.left}>
                  <Text style={styles.label}>{payConfig.payAccount}：</Text>
                </View>
                <View style={styles.right}>
                  <TextInput
                    underlineColorAndroid={'transparent'}
                    style={styles.input}
                    onChangeText={text => {
                      this.setState({verify: text})
                    }}
                    value={verify}/>
                </View>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  underlayColor='transparent'
                  disabled={isLoading}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.formSubmit()
                  }}>
                  <View style={[styles.btn, {width: 150}]}>
                    <Text style={styles.btnText}>{isLoading ? '提单中...' : '立即提单'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollableTabView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Config.baseColor,
    height: 64,
    paddingHorizontal: 10,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navRight: {
    flex: 1,
  },
  navCenter: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLeft: {
    flex: 1,
  },
  iconBack: {
    height: 18,
    width: 10,
  },
  title: {
   color: 'white',
   fontSize: 20,
  },
  form: {
    padding: 10,
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyText: {
    marginLeft: 10,
    color: '#7aa7eb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  left: {
    flex: 1,
    alignItems: 'flex-end',
  },
  right: {
    flex: 2,
  },
  label: {
    fontSize: 16,
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0,
    borderColor: '#ccc',
    borderWidth: 1,
    width: 200,
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  btn: {
    backgroundColor: Config.baseColor,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
  },
})

const mapStateToProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}


export default connect(mapStateToProps)(FriendsPay)
