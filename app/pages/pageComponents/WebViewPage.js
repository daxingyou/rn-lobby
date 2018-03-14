import React, { Component } from 'react'
import {
  View, Image, StyleSheet, Text, Dimensions, Linking, UIManager,
  TouchableOpacity, WebView, ScrollView, CameraRoll, Platform, PermissionsAndroid,
  Clipboard,
} from 'react-native'
import { connect } from 'react-redux'
import HeaderToolBar from '../../components/HeadToolBar'
import { toastShort } from '../../utils/toastUtil'
import { LoadingView } from '../../components/common'
import { getUserInfo } from '../../actions'
import Config from '../../config/global'

const isAndroid = Platform.OS !== 'ios'
let RNFetchBlob = null
if (isAndroid) {
  RNFetchBlob = require('react-native-fetch-blob').default
}

import Sound from '../../components/clickSound'

const TITLES = {
  '1': '网银在线充值',
  '7': '微信扫码充值',
  '6': '支付宝扫码充值',
  '11': 'QQ钱包充值',
  '12': 'QQ钱包APP充值',
}
// ['网银在线充值', '微信快捷充值', '支付宝快捷充值', '支付宝扫一扫', '微信扫一扫']
const windowWidth = Dimensions.get('window').width


class WebViewPage extends Component {

  constructor() {
    super()
    this.state = {
      imgUrl: "",
    }
    this._hanldePressHadPay = this._hanldePressHadPay.bind(this)
    this._requestPermission = this._requestPermission.bind(this)
  }

  async _requestPermission (imgUrl,schemeURL,payType) {
      let result = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: ' 权限请求 ',
          message:
            ' 该应用需要如下权限 ' + ' 保存图片 ' + ' 请授权! ',
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
            Linking.canOpenURL(schemeURL).then(supported => { // weixin://  alipay://
              if (supported) {
                Linking.openURL(schemeURL)
              } else {
                toastShort(`请先安装${payType}, 然后打开${payType}扫码支付!（如已安装请手动打开${payType}）`)
              }
            })
          })
        })
      }
    }

  hanldePressRecharge(type, name) {
    const { data } = this.props.navigation.state.params
    let payType = name
    let schemeURL = 'xxx://'
    if (type === '3' || type === '6') {
      payType = '支付宝'
      schemeURL = 'alipay://'
    } else if (type === '11') {
      payType = 'QQ钱包'
      schemeURL = 'mqq://'
    } else if (type === '13') {
      payType = '京东钱包'
      schemeURL = 'jdpay://'
    } else if (type === '7') {
      payType = '微信'
      schemeURL = 'weixin://'
    } else if (type === '17') {
      payType = '银联钱包'
      schemeURL = 'uppaywallet://'
    }
    if (data.recharge_url !== '') { // 网页
      UIManager.takeSnapshot(this.webview, { format: 'png', quality: 1 })

        .then(uri => {
          CameraRoll.saveToCameraRoll(uri)
        }).then(() => {
          Linking.canOpenURL(schemeURL).then(supported => { // weixin://  alipay://
            if (supported) {
              Linking.openURL(schemeURL)
            } else {
              toastShort(`已保存截图, 请下载安装${payType}APP扫码支付!（如已安装请手动打开${payType}）`)
            }
          })
        })
        .catch((error) => console.warn(error))
    } else { // 只返回图片
      this.setState({
        imgUrl: data.code_img_url,
      }, () => {
        if (isAndroid) {
          this._requestPermission(this.state.imgUrl, schemeURL, payType)
        } else {
          CameraRoll.saveToCameraRoll(this.state.imgUrl).then(() => {
            Linking.canOpenURL(schemeURL).then(supported => { // weixin://  alipay://
              if (supported) {
                Linking.openURL(schemeURL)
              } else {
                toastShort(`请先安装${payType}, 然后打开${payType}扫码支付!（如已安装请手动打开${payType}）`)
              }
            })
          })
        }
      })
    }
  }
  _hanldePressHadPay() {
    this.props.getUserInfo(this.props.token) // 更新redux中的用户信息
    this.props.navigation.dispatch({ type: 'RESET_NAV' })
  }

  renderLoading() {
    return <LoadingView />
  }

  renderContent() {
    const { data, type, name } = this.props.navigation.state.params
    let payType = name
    if (type === '3' || type === '6') {
      payType = '支付宝'
    } else if (type === '1') {
      payType = '扫码APP'
    } else if (type === '11') {
      payType = 'QQ钱包'
    } else if (type === '12') {
      payType = 'QQ钱包快捷支付'
    } else if (type === '13') {
      payType = '京东钱包'
    }

    if (data.recharge_url !== '' && type !== '1') {
      return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <WebView
            scalesPageToFit={true}
            ref={(ref) => { this.webview = ref }}
            automaticallyAdjustContentInsets={false}
            style={isAndroid ? {flex: 1} : { flex: 1, marginBottom: 200 }}
            source={{ uri: data.recharge_url }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            decelerationRate='normal'
            onShouldStartLoadWithRequest={() => true}
            renderLoading={this.renderLoading}/>
          {
          !isAndroid && (
            <CaptureCom
              onPressLeft={this.hanldePressRecharge.bind(this, type, name)}
              onPressRight={this._hanldePressHadPay}
              payType={payType}
              type={type}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}/>
          )

          }
        </View>
      )
    } else if (data.recharge_url !== '') {
      return (
        <WebView
          ref={(ref) => { this.webview = ref }}
          automaticallyAdjustContentInsets={false}
          style={{ flex: 1 }}
          source={{ uri: data.recharge_url }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          decelerationRate='normal'
          onShouldStartLoadWithRequest={() => true}
          renderLoading={this.renderLoading}/>
      )
    }
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ margin: 10, fontSize: 13, fontWeight: 'bold' }}>{`${payType}支付扫码信息:`}</Text>
        <ScrollView style={{ flex: 1, paddingVertical: 10, backgroundColor: '#FFF' }}>
          <View style={{ paddingLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Text>{`订单号：${data.order_no || ''}`}</Text>
            <TouchableOpacity
              underlayColor='transparent'
              onPress={() => {
                Sound.stop()
                Sound.play()
                Clipboard.setString(data.order_no)
              }}>
              <Text style={styles.copyText}>
                复制
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ paddingLeft: 10, paddingVertical: 5 }}>
            充值金额：
            <Text style={{ color: '#E41C1C' }}>{ data.money || ''}</Text>
            元
          </Text>
          {
            data.float == 1 && (
              <Text style={{ paddingLeft: 10, color: '#999999' }}>{`为了更快的到账，系统会自动随机多加两位小数金额，实际充值金额以此为准！`}</Text>
            )
          }
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
            {data.code_img_url !== '' && <Image source={{ uri: data.code_img_url }} style={{ height: 200, width: 200, marginVertical: 10 }} />}
          </View>
        </ScrollView>
        <CaptureCom
          onPressLeft={this.hanldePressRecharge.bind(this, type, name)}
          onPressRight={this._hanldePressHadPay}
          payType={payType}
          type={type}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}/>
      </View>
    )
  }

  render() {
    const { navigation } = this.props
    const { type, name } = navigation.state.params
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={TITLES[type] || name || '充值'}
          leftIcon={'back'}
          leftIconAction={() => navigation.goBack()}/>
        {
          this.renderContent()
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  copyText: {
    marginLeft: 10,
    color: '#7aa7eb',
  },
  tipsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
})

const mapStateToProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: (token, isCheckLogin) => dispatch(getUserInfo(token, isCheckLogin)),
  }
}

const CaptureCom = ({ onPressLeft, onPressRight, payType, style, type }) => {
  return (
    <View style={[style, { padding: 10, backgroundColor: '#fff' }]}>

      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#FFF' }}>
        <TouchableOpacity
          style={{ width: windowWidth / 3, paddingVertical: 8, backgroundColor: Config.baseColor, alignItems: 'center' }}
          onPress={() => {Sound.stop();Sound.play();onPressLeft()}}>
          <Text style={{ fontSize: 18, color: 'white' }}>立即充值</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: windowWidth / 3, paddingVertical: 8, backgroundColor: Config.baseColor, alignItems: 'center' }}
          onPress={() => {Sound.stop();Sound.play();onPressRight()}}>
          <Text style={{ fontSize: 18, color: 'white' }}>我已支付</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 20 }}>扫码步骤：</Text>
      <Text style={styles.tipsText}>{'1、点“立即充值”将自动保存二维码到相册'}</Text>
      {
        type === '7' ? (
          <View>
            <Text style={styles.tipsText}>{'2、请使用另一台手机扫描二维码进行充值'}</Text>
            <Text style={styles.tipsText}>{'3、或把二维码传到电脑，再使用手机扫码支付'}</Text>
            <Text style={styles.tipsText}>{'4、如充值金额未及时到账，请联系在线客服'}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.tipsText}>{`2、请在${payType}中打开“扫一扫”点击右上角的相册`}</Text>
            <Text style={styles.tipsText}>{'3、选取截屏的二维码进行充值（如无法充值，请使用另一台手机扫码，或把二维码传到电脑，再使用手机扫码充值）'}</Text>
            <Text style={styles.tipsText}>{'4、如充值金额未及时到账，请联系在线客服'}</Text>
          </View>
        )
      }

    </View>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(WebViewPage)
