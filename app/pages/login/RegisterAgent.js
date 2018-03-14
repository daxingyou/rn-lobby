import React, { Component } from 'react'
import {
  View, StyleSheet, Text, Image, TextInput, Alert,
  TouchableOpacity, Platform,
} from 'react-native'
import HeaderToolBar from '../../components/HeadToolBar'
import ButtonIos from '../../components/ButtonIos'
import dismissKeyboard from '../../utils/dismissKeyboard'
import { isEmptyStr, matchUserName, matchPassword } from '../../utils/stringUtil'
import { _fetch, fetchWithOutStatus } from '../../utils/fetchUtil'
import { ModalLoading } from '../../components/common'
import CheckBoxLogin from '../../components/CheckBoxLogin'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

const isIos = Platform.OS === 'ios'

let UMNative = -1
if (isIos) {
  UMNative = require('react-native').NativeModules.UMNative
} else {
  UMNative = require('react-native').NativeModules.UmengNativeModule
}

export default class RegisterAgent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      introducer: '',
      userName: '',
      password: '',
      isChecked: true,
      isRegisterSucc: false,
      verifyImg: `${Config.host}/Base/verify?${Math.random() * 10}`,
      verifyCode: '',
      isLoading: false,
      errorMsg: '',
      qq: '',
      contact: '',
      regExtend: {},
      securePassword: true,
    }
    this.handleRegister = this.handleRegister.bind(this)
  }

  componentDidMount(){
    fetchWithOutStatus({act: 10053}).then(res => {
      if (res) {
        this.setState({
          regExtend: res,
        })
      }
    }).catch(err => {
      console.warn(err)
    })
  }

  handleRegister = () => {
    const { regExtend } = this.state
    this.setState({ isRegisterSucc: false })
    const userName = this.state.userName.trim()
    const password = this.state.password.trim()
    const verifyCode = this.state.verifyCode.trim()
    const contact = this.state.contact.trim()
    const qq = this.state.qq.trim()

    if (!matchUserName(userName)) {
      Alert.alert('', '账号需以字母开头的6-16位数字或字母组成', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
    } else if (!matchPassword(password)) {
      Alert.alert('', '密码仅限于6-12位的数字及字母组成', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
    } else if (regExtend.need_contact_info == 1 && !contact) {
      Alert.alert('', '联系方式不能为空!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
    } else if (regExtend.need_qq == 1 && !qq) {
      Alert.alert('', 'QQ号码不能为空!', [
        {text: '确定', onPress: () => {return false}},
      ], { cancelable: false })
    } else {
      this.setState({ isLoading: true })

      let channelName = isIos ? 'App Store' : 'default'
      try {
        if (UMNative !== -1 && UMNative.channelId) {
          channelName = UMNative.channelId
        }
      } catch (e) {
        console.warn('get channel errer: ', e)
      }

      let body = {
        act: 10041,
        user_name: userName,
        password,
        re_password: password,
        verify_code: verifyCode,
        contact_info: contact,
        qq_info: qq,
        reg_terminal: isIos ? 3 : 4,
        channel_name: channelName,
      }

      _fetch({postData: body}).then((result) => {
        if (result.status == 0) {
          this.setState({ isLoading: false }, () => {
            Alert.alert('', result.message || '申请成功!', [
              {text: '确定', onPress: () => {
                this.props.navigation.goBack()
              }},
            ], { cancelable: false })
          })
        } else {
          this.setState({
            isLoading: false,
            verifyImg: `${this.state.verifyImg}?${Math.random() * 10}`,
          }, () => {
            Alert.alert('', result.message || '注册失败!', [
              {text: '确定', onPress: () => {return false}},
            ], { cancelable: false })
          })
        }

      }).catch((reason) => {
        this.setState({
          isLoading: false,
          verifyImg: `${this.state.verifyImg}?${Math.random() * 10}`,
        }, () => {
          Alert.alert('', reason.message || '注册失败!', [
            {text: '确定', onPress: () => {return false}},
          ], { cancelable: false })
        })
      })
    }
  }

  render() {
    const { regExtend, securePassword } = this.state
    const isClickAvailable = (!isEmptyStr(this.state.userName)
      && !isEmptyStr(this.state.password) && this.state.isChecked
      && !isEmptyStr(this.state.verifyCode))

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
          title={'代理注册'}
          titleStyle={{fontSize: 18, color: '#333333'}}
          leftIcon={'backB'}
          leftIconAction={() => this.props.navigation.goBack()}/>
        <ModalLoading
          visible={this.state.isLoading}
          text={'注册中...'}/>
        <View style={styles.form}>
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
              <Image style={[styles.icon, {marginBottom: 2}]} source={securePassword ? require('../../src/img/eye_close.png') : require('../../src/img/eye_open.png')} />
            </TouchableOpacity>
          </View>
          {
            regExtend.need_contact_info && (
              <View style={styles.row}>
                <Text style={styles.label}>联系方式</Text>
                <TextInput
                  underlineColorAndroid='transparent'
                  style={styles.formInput}
                  autoCapitalize='none'
                  keyboardType='ascii-capable'
                  placeholder='请输入微信号或手机号'
                  clearButtonMode='while-editing'
                  onChangeText={text => this.setState({ contact: text })}/>
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
                  placeholder='请输入QQ号码'
                  clearButtonMode='while-editing'
                  onChangeText={text => this.setState({ qq: text })}/>
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
            this.handleRegister()
          }}/>
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
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginBottom: 2,
  },
})
