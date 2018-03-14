import React, { Component } from 'react'
import {
  View, StyleSheet, Text, Image, TextInput, Alert,
  TouchableOpacity, Platform, ScrollView,
  PermissionsAndroid, KeyboardAvoidingView, Dimensions,
} from 'react-native'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import Keychain from 'react-native-keychain'
import HeaderToolBar from '../../components/HeadToolBar'
import ButtonIos from '../../components/ButtonIos'
import dismissKeyboard from '../../utils/dismissKeyboard'
import {
  isEmptyStr, matchUserName, matchPassword, matchPhoneNum, matchEmail, matchQQ,
} from '../../utils/stringUtil'
import { _fetch, fetchWithOutStatus } from '../../utils/fetchUtil'
import { ModalLoading } from '../../components/common'
import CheckBoxLogin from '../../components/CheckBoxLogin'
import ModalRegisterSuccess from '../../components/modal/ModalRegisterSuccess'
import { setUserInfo } from '../../actions'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import { reportEquipement } from '../../utils/reportUmengConfig'

const isIos = Platform.OS === 'ios'
let RNFS, path
if (!isIos) {
  RNFS = require('react-native-fs')
  path = RNFS.ExternalStorageDirectoryPath
}

const { height } = Dimensions.get('window').width

let UMNative = -1
if (isIos) {
  UMNative = require('react-native').NativeModules.UMNative
} else {
  UMNative = require('react-native').NativeModules.UmengNativeModule
}

let guid = (function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
})()

if(isIos) {
  Keychain.getGenericPassword()
    .then(credentials => {
      guid = credentials.password
    })
    .catch(() => {
      const username = 'UniqueID'
      Keychain.setGenericPassword(username, guid)
    })
}

class RegisterPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      introducer: '',
      userName: '',
      password: '',
      isChecked: true,
      isRegisterSucc: false,
      verifyImg: `${Config.host}/Base/verify`,
      verifyCode: '',
      isLoading: false,
      errorMsg: '',
      regExtend: {},
      email: '',
      qq: '',
      phoneNum: '',
      securePassword: true,
      RegisterSuccess: false,
    }
  }
  componentDidMount(){
    fetchWithOutStatus({act: 10052}).then(res => {
      if (res) {
        this.setState({
          regExtend: res,
        })
      }
    }).catch(err => {
      console.warn(err)
    })
    this.setState({ verifyImg: `${this.state.verifyImg}?${Math.random() * 10}` })
  }

  readFile = () => {
    if(!isIos){
      RNFS.readDir(path)
        .then((result) => {
          let n = "false"
          result.forEach((v,i)=>{
            if(v.name === 'suncache.pid'){
              n = i
            }
          })
          if(n==="false"){ this.PermissionsAndroidWrite() }
          return Promise.all([RNFS.stat(result[n].path), result[n].path])
        })
        .then((statResult) => {
          if (statResult[0].isFile()) {
            return RNFS.readFile(statResult[1], 'utf8')
          }
        })
        .then((contents)=>{
          if(contents !== undefined && contents.length === 36){
            this.handleRegister(contents)
          }
        })
        .catch(() => {
          this.PermissionsAndroidWrite()
        })
    }
  }

  async PermissionsAndroidWrite() {
    if(!isIos){
      const pwrite = await PermissionsAndroid.checkPermission(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      if(pwrite){
        RNFS.writeFile(path+'/suncache.pid', guid, 'utf8')
          .then(() => {
            this.handleRegister(guid)
          })
          .catch((err) => {
            console.warn(err.message)
          })

      } else {
        const pwrite = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: ' 权限请求 ',
            message: ' 该应用需要如下权限 ' + ' 写入数据 ' + ' 请授权! ',
          },
        )
        if(pwrite){
          RNFS.writeFile(path, guid, 'utf8')
            .then(() => {
              this.handleRegister(guid)
            })
            .catch((err) => {
              console.warn(err.message)
            })
        }
      }
    }
  }

  async PermissionsAndroidRead() {
    if(!isIos){
      const pstate = await PermissionsAndroid.checkPermission(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      )
      if(pstate){
        this.readFile()
      } else {
        const pread = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: ' 权限请求 ',
            message: ' 该应用需要如下权限 ' + ' 写入数据 ' + ' 请授权! ',
          },
        )
        if(pread){
          this.readFile()
        }
      }
    }
  }

  handleRegister = (uuid) => {
    this.setState({ isRegisterSucc: false })
    const { regExtend } = this.state
    const userName = this.state.userName.trim()
    const password = this.state.password.trim()
    const email = this.state.email.trim()
    const qq = this.state.qq.trim()
    const phoneNum = this.state.phoneNum.trim()
    const introducer = this.state.introducer.trim()
    const verifyCode = this.state.verifyCode.trim()

    if (regExtend.need_mobile === '1' && !phoneNum) {
      Alert.alert('', '手机号码不能为空!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
      return false
    }
    if (phoneNum && !matchPhoneNum(phoneNum)) {
      Alert.alert('', '手机号码格式不正确!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
      return false
    }

    if (regExtend.need_email === '1' && !email) {
      Alert.alert('', '电子邮件不能为空!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
      return false
    }
    if (email && !matchEmail(email)) {
      Alert.alert('', '电子邮件格式不正确!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
      return false
    }

    if (regExtend.need_qq === '1' && !qq) {
      Alert.alert('', 'QQ号码不能为空!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
      return false
    }
    if (qq && !matchQQ(qq)) {
      Alert.alert('', 'QQ号码格式不正确!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
      return false
    }

    if (regExtend.need_reg_code === '1') {
      if (!introducer) {
        Alert.alert('', '推荐人ID必填!', [
          {text: '确定', onPress: () => {return false}},
        ], { cancelable: false })
        return false
      }
    }

    if (!matchUserName(userName)) {
      Alert.alert('', '账号需以字母开头的6-16位数字或字母组成', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
    } else if (!matchPassword(password)) {
      Alert.alert('', '密码仅限于6-12位的数字及字母组成', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
    } else {

      const deviceInfo = {
        unique_id: uuid,
        manufacturer: DeviceInfo.getManufacturer(),
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
        device_id: DeviceInfo.getDeviceId(),
        system_name: DeviceInfo.getSystemName(),
        system_version: DeviceInfo.getSystemVersion(),
        bundle_id: DeviceInfo.getBundleId(),
        build_number: DeviceInfo.getBuildNumber(),
        device_name: DeviceInfo.getDeviceName(),
        user_agent: DeviceInfo.getUserAgent(),
      }

      let channelName = isIos ? 'App Store' : 'default'
      try {
        if (UMNative !== -1 && UMNative.channelId) {
          channelName = UMNative.channelId
        }
      } catch (e) {
        console.warn('get channel errer: ', e)
      }

      let body = {
        act: 10021,
        reg_code: introducer,
        auto_login: 1,
        user_name: userName,
        password,
        re_password: password,
        verify_code: verifyCode,
        device_info: deviceInfo,
        user_email: email,
        user_qq: qq,
        user_mobile: phoneNum,
        reg_terminal: isIos ? 3 : 4,
        channel_name: channelName,
      }
      this.setState({ isLoading: true })
      _fetch({postData: body}).then((result) => {
        if (result.status === 0) {
          this.setState({ isLoading: false }, () => {
            delete result.status
            delete result.message
            this.props.setUserInfo(result) // 更新用户信息
            reportEquipement(result.token, true)
            this.setState({isRegisterSucc: true})
          })
        } else {
          this.setState({
            isLoading: false,
            verifyImg: `${this.state.verifyImg}?${Math.random() * 10}` })
            Alert.alert('', result.message || '注册失败!', [
              {text: '确定', onPress: () => {return false}},
            ], { cancelable: false })
        }

      }).catch((reason) => {
        this.setState({
          isLoading: false,
          verifyImg: `${this.state.verifyImg}?${Math.random() * 10}` })
          Alert.alert('', reason.message || '注册失败!', [
            {text: '确定', onPress: () => {return false}},
          ], { cancelable: false })
      })
    }
  }

  _onPressRegister = () => {
    if(isIos){
      Keychain.getGenericPassword()
        .then(credentials => {
          guid = credentials.password
          this.handleRegister(guid)
        })
    }else {
      this.PermissionsAndroidRead(1)
    }
  }

  _onPress2Setting = () => {
      this.setState({ isRegisterSucc: false })
      this.props.navigation.navigate('FundPwdPage', { isFromSettingItem: true })
  }

  _onPress3Setting = () => {
      this.setState({ isRegisterSucc: false })
      this.props.navigation.dispatch({ type: "RESET_NAV" })

  }

  _onPressClose = () => {
      this.setState({ isRegisterSucc: false })
      this.props.navigation.goBack()
  }

  render() {
    const isClickAvailable = (!isEmptyStr(this.state.userName)
      && !isEmptyStr(this.state.password) && this.state.isChecked
      && !isEmptyStr(this.state.verifyCode))
    const { regExtend, securePassword } = this.state
    const { navigation } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          Sound.stop()
          Sound.play()
          dismissKeyboard()
        }}
        activeOpacity={1}>
        <HeaderToolBar
          containerStyles={{backgroundColor: '#FFFFFF'}}
          title={'免费注册'}
          titleStyle={{fontSize: 18, color: '#333'}}
          leftIcon={'backB'}
          rightIcon1={'text'}
          rightText={'免费试玩'}
          rightTextStyle={{fontSize: 15, color: '#333333'}}
          rightIconAction1={() => { navigation.navigate('FreeAccountPage') }}
          leftIconAction={() => { navigation.dispatch({ type: 'RESET_NAV' })}}/>
        <ModalLoading
          visible={this.state.isLoading}
          text={'注册中...'}/>

        <ModalRegisterSuccess
          visible={this.state.isRegisterSucc}
          onPress2Setting={this._onPress2Setting}
          onPress3Setting={this._onPress3Setting}
          onPressClose={this._onPressClose}/>
        <ScrollView>
          <KeyboardAvoidingView behavior='padding'>
            <View style={[styles.form, height < 667 ? { marginTop:20 } : null]}>
              <View style={styles.row}>
                <Text style={styles.label}>账号</Text>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={styles.formInput}
                  autoCapitalize='none'
                  autoFocus={true}
                  keyboardType='ascii-capable'
                  placeholder='字母开头6-16位数字或字母'
                  maxLength = {16}
                  clearButtonMode='while-editing'
                  onChangeText={text => this.setState({ userName: text })}/>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={styles.formInput}
                  placeholder='6-12位的数字及字母组成'
                  maxLength = {12}
                  keyboardType='ascii-capable'
                  secureTextEntry={securePassword}
                  clearButtonMode='while-editing'
                  onChangeText={text => this.setState({ password: text })}/>
                <TouchableOpacity
                  onPress={() => {this.setState(preState => { return { securePassword: !preState.securePassword } })}}>
                  <Image style={styles.icon} source={securePassword ? require('../../src/img/eye_close.png') : require('../../src/img/eye_open.png')} />
                </TouchableOpacity>
              </View>
              {
                regExtend.need_mobile && (
                  <View style={styles.row}>
                    <Text style={styles.label}>手机号码</Text>
                    <TextInput
                      underlineColorAndroid='transparent'
                      style={styles.formInput}
                      autoCapitalize='none'
                      keyboardType='ascii-capable'
                      placeholder={`请输入手机号码（${regExtend.need_mobile === '1' ? '必填' : '选填'}）`}
                      clearButtonMode='while-editing'
                      onChangeText={text => this.setState({ phoneNum: text })}/>
                  </View>
                )
              }
              {
                regExtend.need_email && (
                  <View style={styles.row}>
                    <Text style={styles.label}>电子邮箱</Text>
                    <TextInput
                      underlineColorAndroid='transparent'
                      style={styles.formInput}
                      autoCapitalize='none'
                      keyboardType='ascii-capable'
                      placeholder={`请输入电子邮箱（${regExtend.need_email === '1' ? '必填' : '选填'}）`}
                      clearButtonMode='while-editing'
                      onChangeText={text => this.setState({ email: text })}/>
                  </View>
                )
              }
              {
                regExtend.need_qq && (
                  <View style={styles.row}>
                    <Text style={styles.label}>QQ号码</Text>
                    <TextInput
                      underlineColorAndroid='transparent'
                      style={styles.formInput}
                      autoCapitalize='none'
                      keyboardType='ascii-capable'
                      placeholder={`请输入QQ号码（${regExtend.need_qq === '1' ? '必填' : '选填'}）`}
                      clearButtonMode='while-editing'
                      onChangeText={text => this.setState({ qq: text })}/>
                  </View>
                )
              }
              {
                regExtend.need_reg_code && (
                  <View style={styles.row}>
                    <Text style={styles.label}>推荐人ID</Text>
                    <TextInput
                      underlineColorAndroid='transparent'
                      style={styles.formInput}
                      autoCapitalize='none'
                      keyboardType='ascii-capable'
                      placeholder={`请输入推荐人ID（${regExtend.need_reg_code === '1' ? '必填' : '选填'}）`}
                      clearButtonMode='while-editing'
                      onChangeText={text => this.setState({ introducer: text })}/>
                  </View>
                )
              }
              <View style={styles.row}>
                <Text style={styles.label}>验证码</Text>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={styles.formInput}
                  autoCapitalize='none'
                  keyboardType='ascii-capable'
                  placeholder='输验证码'
                  onChangeText={text => this.setState({ verifyCode: text })}/>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.setState({ verifyImg: `${this.state.verifyImg}?${Math.random() * 10}` })
                  }}>
                  {this.state.verifyImg !== '' && <Image source={{ uri: this.state.verifyImg }} style={{ height: 49, width: 130 }}/>}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.checkBoxWrap}>
              <CheckBoxLogin
                label='我已经满合法博彩年龄，且同意各项开户条约, '
                labelStyle={{color: '#666666', fontSize: 12}}
                checked={this.state.isChecked}
                activeOpacity={0.9}
                textRight={'"开户协议"'}
                onPressRight={() => { this.props.navigation.navigate('RegisterAgreementPage') }}
                underlayColor={'red'}
                onChange={(checked) => { this.setState({ isChecked: checked }) }}/>
            </View>

            <ButtonIos
              flexOrientation='row'
              disabled={!isClickAvailable}
              containerStyle={[styles.confirmBtn,
                !isClickAvailable ? { borderColor: Config.baseColor } : { borderColor: 'black' }]}
              styleTextLeft={[{ fontSize: 18 }, !isClickAvailable ? { color: '#B5B5B5' } : { color: '#FFFFFF' }]}
              text='立即注册'
              onPress={() => {
                Sound.stop()
                Sound.play()
                this._onPressRegister()
              }}/>

            <View style={styles.loginWrap}>
              <Text style={{ color: '#999', fontSize: 12, marginRight: 4 }}>{'已有账号?'}</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  navigation.navigate('LoginPage')
                }}>
                <Text style={{ color: Config.baseColor, fontSize: 12 }}>{'立即登录'}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    marginTop: 50,
    paddingHorizontal: 25,
  },
  row: {
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  label: {
    color: '#333333',
    fontSize: 16,
  },
  formInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 50,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  checkBoxWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 26,
    marginHorizontal: 15,
  },
  confirmBtn: {
    marginTop: 40,
    marginHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    borderRadius: 6,
  },
  loginWrap: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginBottom: 1,
  },
})
const mapStateToProps = (state) => {
  return {
    nav: state.nav,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (data) => dispatch(setUserInfo(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
