import React, { Component } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, DeviceEventEmitter, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import ButtonIos from '../../../components/ButtonIos'
import { isEmptyStr } from '../../../utils/stringUtil'
import dismissKeyboard from '../../../utils/dismissKeyboard'
import HeaderToolBar from '../../../components/HeadToolBar'
import { fetchWithStatus } from '../../../utils/fetchUtil'
import { ModalLoading } from '../../../components/common'
import ModalPopup from '../../../components/modal/ModalPopup'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'

class FundPwdPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      fundPwd: '',
      isLoading: false,
      isErrorPopup: false,
      errorTip: '',
    }
  }

  _onPress2SetFundPwd() {
    const { navigation, token } = this.props
    const { name, fundPwd } = this.state

    this.setState({ isLoading: true })
    const headers = { token }
    fetchWithStatus({
      act: 10023,
      real_name: name,
      funds_password: fundPwd,
    }, headers).then(() => {
      this.setState({ isLoading: false })
      DeviceEventEmitter.emit('lISTENER_UPDATE_SYS_INFOS') // 资金密码状态为1
      if (navigation.state.params && navigation.state.params.isFromSettingItem) {
        navigation.dispatch({ type: 'RESET_NAV' })
      } else {
        navigation.navigate('BankCardAddPage', {
          fromCardMain: navigation.state.params && navigation.state.params.fromCardMain,
          fwdPageKey: navigation.state.key,
        })
      }
    }).catch((reason) => {
      this.setState({ isLoading: false, isErrorPopup: false }, () => {
        this.setState({ isErrorPopup: true, errorTip: (reason.message || '设置资金密码失败!') })
      })
    })
  }

  render() {
    const { name, fundPwd, isErrorPopup, errorTip, isLoading } = this.state
    const { navigation } = this.props

    const isClickAvailable = (!isEmptyStr(name) && !isEmptyStr(fundPwd))
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {Sound.stop();Sound.play();dismissKeyboard()}}
        activeOpacity={1}>
        <HeaderToolBar
          title={'资金密码'}
          leftIcon={'back'}
          leftIconAction={() => navigation.goBack(navigation.state.params && navigation.state.params.cardMainKey)}/>
        <ModalPopup
          visible={isErrorPopup}
          onPressCancel={null}
          onPressConfirm={() => this.setState({ isErrorPopup: false })}>
          {errorTip}
        </ModalPopup>
        <ModalLoading visible={isLoading} text={'设置中...'} />

        <Text style={{ margin: 10, fontSize: 12, color: '#999' }}>{'为了您账户安全,真实姓名需要与绑定银行卡姓名一致'}</Text>

        <View style={styles.textContainer}>
          <View style={[styles.inputWrap, { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E5E5E5' }]}>
            <Text style={styles.text}>真实姓名</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              placeholder='请输入真实姓名'
              onChangeText={(text) => this.setState({ name: text })}/>
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.text}>资金密码</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              maxLength={6}
              placeholder='请输入6位数字的密码'
              secureTextEntry={true}
              keyboardType='numeric'
              onChangeText={(text) => this.setState({ fundPwd: text })}/>
          </View>
        </View>

        <ButtonIos
          flexOrientation='row'
          disabled={!isClickAvailable}
          containerStyle={[styles.confirmBtn, isClickAvailable ? { borderColor: 'black' } : { borderColor: Config.baseColor }]}
          styleTextLeft={[{ fontSize: 20 }, isClickAvailable ? { color: '#FFFFFF' } : { color: '#999999' }]}
          text='确认'
          onPress={() => {
            Sound.stop()
            Sound.play()
            this._onPress2SetFundPwd.bind(this)()
            Keyboard.dismiss()
          }}/>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  textContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    fontSize: 17,
    marginHorizontal: 5,
  },
  input: {
    padding: 0,
    flex: 1,
    color: 'black',
    fontSize: 16,
  },
  confirmBtn: {
    paddingVertical: 12,
    marginHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    marginTop: 25,
    borderRadius: 4,
  },
})

const mapStateToProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}

export default connect(mapStateToProps)(FundPwdPage)
