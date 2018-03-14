import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import HeaderToolBar from '../../../components/HeadToolBar'
import ButtonIos from '../../../components/ButtonIos'
import { isEmptyStr } from '../../../utils/stringUtil'
import { fetchWithStatus } from '../../../utils/fetchUtil'
import { ModalLoading } from '../../../components/common'
import ModalPopup from '../../../components/modal/ModalPopup'
import { resetUserInfo } from '../../../actions'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'
import { toastShort } from '../../../utils/toastUtil'
import { NavigationActions } from 'react-navigation'

const TITLES = ['登录', '资金']
const PASSWORD = ['密码须为6-12位数字或字母结合', '密码须为6位数字']
// type为0是修改登录密码，type为1时修改资金密码
class ModifyLoginPwdPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      oldPwd: '',
      newPwd: '',
      newPwdAgain: '',
      isLoading: false,
      isErrorPopup: false,
      errorMsg: '',
      securePassword: true,
    }
  }

_onPressModify() {
  const { navigation } = this.props
  const { type } = navigation.state.params
  this.setState({isLoading: true})
  const oldPwd = this.state.oldPwd.trim()
  const newPwd = this.state.newPwd.trim()
  const newPwdAgain = this.state.newPwdAgain.trim()
  const action = type === 0 ? 10029 : 10030
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'MemberCenterMainPage'}),
    ],
  })
  let body = {
    act: action,
    old_login_pwd: oldPwd,
    new_login_pwd: newPwd,
    re_new_login_pwd: newPwdAgain,
  }
  if (type == 1) {
    body = {
      act: action,
      old_funds_pwd: oldPwd,
      new_funds_pwd: newPwd,
      re_new_funds_pwd: newPwdAgain,
    }
  }
  fetchWithStatus(body).then((result) => {
    if (type == 0) {
      this.props.resetUserInfo() // 用户信息置空
    }
    this.setState({
      isLoading: false,
    }, () => {
      toastShort(result.message)
      setTimeout(() => {
        navigation.dispatch(resetAction)
      }, 1000)
    })
  }).catch((reason) => {
    this.setState({isLoading: false, isErrorPopup: false})
    toastShort(reason.message || '绑定银行卡失败')
  })
}

  render() {
    const { oldPwd, newPwd, newPwdAgain, securePassword } = this.state
    const navigation = this.props.navigation
    let type = 0
    if (navigation.state.params && navigation.state.params.type) {
      type = navigation.state.params.type
    }
    const maxLength = type == 0 ? 12 : 6
    const isClickAvailable = !isEmptyStr(oldPwd) && !isEmptyStr(newPwd) && !isEmptyStr(newPwdAgain)
    return (
      <View style={styles.container}>
        <ModalPopup
          visible={this.state.isErrorPopup}
          onPressCancel={null}
          onPressConfirm={() => this.setState({ isErrorPopup: false })}>
          {this.state.errorMsg}
        </ModalPopup>
        <ModalLoading visible={this.state.isLoading} text={'修改中...'} />
        <HeaderToolBar
          title={`修改${TITLES[type]}密码`}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>
        <View style={styles.textContainer}>
          <View style={styles.itemWrap}>
            <Text style={styles.text}>旧密码</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              secureTextEntry={securePassword}
              keyboardType='ascii-capable'
              maxLength={maxLength}
              placeholder={`${PASSWORD[type]}`}
              clearButtonMode='while-editing'
              onChangeText={text => this.setState({ oldPwd: text })}/>
            <TouchableOpacity
              onPress={() => {this.setState(preState => { return { securePassword: !preState.securePassword } })}}>
              <Image style={styles.icon} source={securePassword ? require('../../../src/img/eye_close.png') : require('../../../src/img/eye_open.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.text}>新密码</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              secureTextEntry={true}
              maxLength={maxLength}
              placeholder='请输入新密码'
              clearButtonMode='while-editing'
              keyboardType='ascii-capable'
              onChangeText={text => this.setState({ newPwd: text })}/>
          </View>
          <View style={[styles.itemWrap, { borderBottomWidth: 0 }]}>
            <Text style={styles.text}>确认新密码</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              secureTextEntry={true}
              maxLength={maxLength}
              clearButtonMode='while-editing'
              placeholder='请再次确认密码'
              keyboardType='ascii-capable'
              onChangeText={text => this.setState({ newPwdAgain: text })}/>
          </View>
        </View>

        <View style={styles.labelWrap}>
          <Text style={styles.label}>{type === 0 ? '密码须为' : '密码应为' }</Text>
          <Text style={[styles.label, { color: Config.baseColor }]}>{type === 0 ? '6-12位' : '6位' }</Text>
          <Text style={styles.label}>{type === 0 ? '数字或字母结合' : '数字' }</Text>
        </View>

        <ButtonIos
          flexOrientation='row'
          disabled={!isClickAvailable}
          containerStyle={[styles.confirmBtn, isClickAvailable ? { borderColor: 'black' } : { borderColor: Config.baseColor }]}
          styleTextLeft={[{ fontSize: 20 }, isClickAvailable ? { color: '#FFFFFF' } : { color: '#999999' }]}
          onPress={() => {
            Sound.stop()
            Sound.play()
            this._onPressModify.bind(this)()
          }}
          text='确认'/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  textContainer: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  itemWrap: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  text: {
    fontSize: 17,
    marginRight: 5,
  },
  input: {
    padding: 0,
    flex: 1,
    color: 'black',
    fontSize: 16,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  confirmBtn: {
    paddingVertical: 12,
    marginHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    marginTop: 20,
    borderRadius: 4,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginBottom: 1,
  },
})


const mapDispatchToProps = (dispatch) => {
  return {
    resetUserInfo: () => dispatch(resetUserInfo()),
  }
}

export default connect(null, mapDispatchToProps)(ModifyLoginPwdPage)
