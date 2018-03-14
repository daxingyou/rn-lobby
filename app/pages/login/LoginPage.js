import React, { Component } from 'react'
import { View, Image, StyleSheet, DeviceEventEmitter,
  TouchableOpacity, TextInput, Platform, Alert } from 'react-native'
import { connect } from 'react-redux'
import HeaderToolBar from '../../components/HeadToolBar'
import ButtonIos from '../../components/ButtonIos'
import { _fetch } from '../../utils/fetchUtil'
import { toastShort } from '../../utils/toastUtil'
import dismissKeyboard from '../../utils/dismissKeyboard'
import { ModalLoading } from '../../components/common'
import { isEmptyStr } from '../../utils/stringUtil'
import { storeState, setUserInfo } from '../../actions'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import { reportEquipement } from '../../utils/reportUmengConfig'

const isIos = Platform.OS === 'ios'
let UMNative = -1
if (isIos) {
  UMNative = require('react-native').NativeModules.UMNative
} else {
  UMNative = require('react-native').NativeModules.UmengNativeModule
}

class LoginPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nameInput: '',
      pwdInput: '',
      isLoading: false,
      errorTip: '',
      specialAgentLogin: false,
      securePassword: true,
    }
  }

  componentDidMount() {
    this.setState({nameInput: this.props.getIDNum ? this.props.getIDNum : null})
    this.setState({pwdInput: this.props.getpassword ? this.props.getpassword : null})
  }

  _onPress2Login = () => {
    this.setState({ isLoading: true })
    const user_name = this.state.nameInput.trim()
    const password = this.state.pwdInput.trim()
    let channelName = isIos ? 'App Store' : 'default'
    try {
      if (UMNative !== -1 && UMNative.channelId) {
        channelName = UMNative.channelId
      }
    } catch (e) {
      console.warn('get channel errer: ', e)
    }
    _fetch({postData: {
      act: 10022,
      user_name: user_name,
      password: password,
      is_special_agent: this.state.specialAgentLogin ? 1 : 0,
      login_terminal: isIos ? 3 : 4,
      channel_name: channelName,
    }}).then((result) => {
      if (result.status === 0) {
        const { navigation } = this.props
        this.props.storeState(user_name, password)
        this.setState({ isLoading: false }, () => {
          delete result.status
          delete result.message
          this.props.setUserInfo(result) // 更新用户信息
          reportEquipement(result.token, true)
          navigation.dispatch({ type: 'RESET_NAV' })
          DeviceEventEmitter.emit('LOGIN') //登录弹窗
        })
      } else {
        this.setState({ isLoading: false }, () => {
          Alert.alert('', result.message || '登录失败!', [{text: '确定'}])
        })
      }
    }).catch((reason) => {
      Alert.alert('', reason.message || '登录失败!', [{text: '确定'}])
      this.setState({ isLoading: false })
    })
  }

  _onPressForgotPassword = () => {
    toastShort('请联系在线客服找回密码')
  }

  render() {
    const isClickAvailable = (!isEmptyStr(this.state.nameInput) && !isEmptyStr(this.state.pwdInput))
    const { navigation, isSpecialAgent, getIDNum, getpassword } = this.props
    const { specialAgentLogin, securePassword, nameInput, pwdInput } = this.state

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          Sound.stop()
          Sound.play()
          dismissKeyboard()}}
        activeOpacity={1}>
        <HeaderToolBar
          containerStyles={{backgroundColor: '#FFFFFF'}}
          title={specialAgentLogin ? '特殊代理登录' : Config.platformName + '登录'}
          titleStyle={{fontSize: 18, color: '#333333'}}
          leftIcon={'backX'}
          leftIconAction={() => {
            navigation.dispatch({ type: 'RESET_NAV' })
          }}/>
        <View style={styles.inputContainer}>
          <View style={styles.inputName}>
            {
              nameInput ? <Image style={styles.icon} source={require('../../src/img/login_profile.png')} /> :
              <Image style={styles.icon} source={require('../../src/img/graylogin_profile.png')} />
            }
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              autoCapitalize='none'
              maxLength = {16}
              autoFocus={true}
              placeholder='请输入用户名'
              keyboardType='ascii-capable'
              clearButtonMode='while-editing'
              defaultValue={getIDNum}
              onChangeText={text => {
                this.setState({ nameInput: text })
              }}/>
          </View>
          <View style={styles.inputPwd}>
            {
              pwdInput ? <Image style={styles.icon} source={require('../../src/img/login_pwd.png')} /> :
              <Image style={styles.icon} source={require('../../src/img/graylogin_pwd.png')} />
            }
            <TextInput underlineColorAndroid='transparent'
                       style={styles.input}
                       secureTextEntry={securePassword}
                       maxLength = {12}
                       defaultValue={getpassword}
                       placeholder='请输入密码'
                       keyboardType='ascii-capable'
                       clearButtonMode='while-editing'
                       onChangeText={text => this.setState({ pwdInput: text })}/>
            <TouchableOpacity
              onPress={() => {this.setState(preState => { return { securePassword: !preState.securePassword } })}}>
                <Image style={[styles.icon, {marginBottom: 2}]} source={securePassword ? require('../../src/img/eye_close.png') : require('../../src/img/eye_open.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{
          marginTop: 8, marginHorizontal: 25,
          justifyContent: 'flex-end', alignItems: 'flex-end',
          }}>
          <ButtonIos
            flexOrientation='row'
            styleTextLeft={styles.forgetPwdText}
            text='忘记密码?'
            onPress={() => {
              Sound.stop()
              Sound.play()
              this._onPressForgotPassword()}}/>
        </View>

        <ButtonIos
          flexOrientation='row'
          disabled={!isClickAvailable}
          containerStyle={[styles.confirmBtn,
            isClickAvailable ? { borderColor: 'black' } : { borderColor: Config.baseColor }]}
          styleTextLeft={[{ fontSize: 18 },
            isClickAvailable ? { color: '#FFFFFF' } : { color: '#B5B5B5' }]}
          text='登录'
          onPress={() => {
            Sound.stop()
            Sound.play()
            this._onPress2Login()}}/>

        <View style={styles.bottomContainer}>
          <ButtonIos
            flexOrientation='row'
            styleTextLeft={styles.bottomText}
            text='立即注册'
            onPress={() => {
              Sound.stop()
              Sound.play()
              navigation.navigate('RegisterPage')
            }}/>
          <View style={{ height: 14, width: 1, marginHorizontal: 10, backgroundColor: '#EEEEEE' }} />
          <ButtonIos
            flexOrientation='row'
            styleTextLeft={styles.bottomText}
            text='免费试玩'
            onPress={() => {
              Sound.stop()
              Sound.play()
              navigation.navigate('FreeAccountPage')
            }}/>
        {
          isSpecialAgent && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{ height: 14, width: 1, marginHorizontal: 10, backgroundColor: '#EEEEEE' }} />
              <ButtonIos
                flexOrientation='row'
                styleTextLeft={styles.bottomText}
                text={specialAgentLogin ? '会员登录' : '特殊代理登录'}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.setState({
                    specialAgentLogin: !specialAgentLogin,
                  })
                }}/>
            </View>
          )
        }
        </View>
        <ModalLoading visible={this.state.isLoading} text={'登录中...'} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    marginTop: 55,
    paddingHorizontal: 25,
  },
  inputName: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  inputPwd: {
    marginTop: 4,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  input: {
    paddingHorizontal: 9,
    flex: 1,
    fontSize: 16,
  },
  confirmBtn: {
    marginTop: 8.5,
    marginHorizontal: 15,
    height: 40,
    borderRadius: 6,
    backgroundColor: Config.baseColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 39,
  },
  bottomText: {
    fontSize: 14,
    color: '#666666',
  },
  forgetPwdText: {
    fontSize: 13,
    color: '#999999',
  },
})

const mapStateToProps = (state) => {
  return {
    isSpecialAgent: state.sysInfo.isSpecialAgent,
    getIDNum: state.sysInfo.IDNum,
    getpassword: state.sysInfo.password,
    nav: state.nav,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeState: (IDNum, password)=> dispatch(storeState(IDNum, password)),
    setUserInfo: (data) => dispatch(setUserInfo(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
