import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import HeaderToolBar from '../../components/HeadToolBar'
import ButtonIos from '../../components/ButtonIos'
import { fetchWithStatus } from '../../utils/fetchUtil'
import { toastShort } from '../../utils/toastUtil'
import { isEmptyStr } from '../../utils/stringUtil'
import { ModalLoading } from '../../components/common'
import ModalPopup from '../../components/modal/ModalPopup'
import { setUserInfo } from '../../actions'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

class FreeAccountPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      password: '',
      isChecked: true,
      isRegisterSucc: false,
      isLoading: false,
      isErrorPopup: false,
      errorTip: '',
      securePassword: true,
    }
  }

  componentDidMount() {
    fetchWithStatus({ act: 10038 }).then(result => {
      this.setState({ account: result.user_name })
    }).catch(() => {
      toastShort("获取测试账号失败，请联系客服")
    })
  }

  _onPress2Play = () => {
    const { account, password } = this.state
    const { navigation, nav } = this.props
    this.setState({ isLoading: true })
    fetchWithStatus({
      act: 10039,
      user_name: account.trim(),
      password: password.trim(),
      re_password: password.trim(),
      auto_login: 1,
    }).then((result) => {
      const topIndex = nav.index
      const tabIndex = nav.routes[topIndex].index
      this.setState({ isLoading: false })
      delete result.status
      delete result.message
      this.props.setUserInfo(result) // 更新用户信息
      navigation.goBack(nav.routes[topIndex].routes[tabIndex].routes[1].key)
    }).catch((reason) => {
      console.warn('reason', reason)
      this.setState({ isLoading: false, isErrorPopup: false })

      setTimeout(() => {
        this.setState({ isErrorPopup: true, errorTip: (reason.message || '登录试玩失败!') })
      }, 500)
    })
  }

  render() {
    const { account, password, isChecked, securePassword } = this.state
    const { navigation } = this.props
    const isClickAvailable = !isEmptyStr(account) && !isEmptyStr(password) && isChecked
    return (
      <View style={styles.container}>
        <ModalLoading visible={this.state.isLoading} text={'登录中...'} />
        <ModalPopup
          visible={this.state.isErrorPopup}
          onPressCancel={null}
          onPressConfirm={() => this.setState({ isErrorPopup: false })}>
          {this.state.errorTip}
        </ModalPopup>
        <HeaderToolBar
          containerStyles={{backgroundColor: '#FFFFFF'}}
          title={'免费试玩'}
          titleStyle={{fontSize: 18, color: '#333333'}}
          leftIcon={'backB'}
          leftIconAction={() => {
            navigation.dispatch({ type: 'RESET_NAV' })
          }}/>
        <ScrollView>
          <View style={styles.form}>
            <View style={styles.row}>
              <Text style={styles.label}>测试账号</Text>
              <Text style={[styles.label1, {marginLeft: 10}]}>{this.state.account}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, {width: 50}]}>密码</Text>
              <TextInput
                underlineColorAndroid='transparent'
                style={styles.formInput}
                maxLength = {12}
                secureTextEntry={securePassword}
                placeholder='6-12位的数字及字母组成'
                keyboardType='ascii-capable'
                clearButtonMode='while-editing'
                onChangeText={text => this.setState({ password: text })}/>
              <TouchableOpacity
                onPress={() => {this.setState(preState => { return { securePassword: !preState.securePassword } })}}>
                <Image style={styles.icon} source={securePassword ? require('../../src/img/eye_close.png') : require('../../src/img/eye_open.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <ButtonIos
              flexOrientation='row'
              disabled={!isClickAvailable}
              containerStyle={[styles.confirmBtn, !isClickAvailable ? { borderColor: Config.baseColor } : { borderColor: 'black' }]}
              styleTextLeft={[{ fontSize: 20 }, !isClickAvailable ? { color: '#B5B5B5' } : { color: '#FFFFFF' }]}
              text='开始试玩'
              onPress={() => {
                Sound.stop()
                Sound.play()
                this._onPress2Play()
              }}/>

            <View style={styles.detailWrap}>
              <Text style={{ fontSize: 14, color: '#FF0000', marginBottom: 5 }}>{'温馨提示:'}</Text>
              <Text style={styles.detailText}>{'1.每个试玩帐号初始金额为2000RMB，不允许充值提现。'}</Text>
              <Text style={styles.detailText}>{'2.每个试玩帐号从注册开始，有效时间为72小时，超过时间系统自动收回。'}</Text>
              <Text style={styles.detailText}>{'3.试玩帐号的赔率仅供参考，可能与正式帐号赔率不相符。'}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
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
    width: 70,
  },
  label1: {
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
  bottomContainer: {
    marginHorizontal: 15,
    marginTop: 26,
  },
  confirmBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    marginTop: 15,
    borderRadius: 4,
  },
  detailWrap: {
    flexDirection: 'column',
    margin: 10,
  },
  detailText: {
    color: '#666',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginBottom: 2,
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

export default connect(mapStateToProps, mapDispatchToProps)(FreeAccountPage)
