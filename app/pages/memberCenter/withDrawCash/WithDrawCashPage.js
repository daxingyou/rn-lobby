import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Image, StyleSheet, Dimensions, Text,
  TouchableOpacity, InteractionManager, DeviceEventEmitter, TouchableWithoutFeedback } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import ButtonIos from '../../../components/ButtonIos'
import ModalPickerBank from '../../../components/modal/ModalPickerBank'
import ModalGridPassword from '../../../components/modal/ModalGridPassword'
import { formatMoney } from '../../../utils/formatUtil'
import { isEmptyStr, isMatchInputMoney } from '../../../utils/stringUtil'
import { toastShort } from '../../../utils/toastUtil'
import { fetchWithOutStatus, fetchWithStatus } from '../../../utils/fetchUtil'
import { ModalLoading } from '../../../components/common'
import ModalPopup from '../../../components/modal/ModalPopup'
import dismissKeyboard from '../../../utils/dismissKeyboard'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'
import CoustomKeyboard from '../../../components/github/keyboardpopup'

const windowWidth = Dimensions.get('window').width

class WithDrawCashPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      allBanks: [],
      selectedBank: {},
      moneyInput: '',
      isShowPwdModal: false,
      isLoading: false,
      isErrorPopup: false,
      errorMsg: '',
      isShowKeyboard: false,
    }
    this.changeValue = this.changeValue.bind(this)
    this.toggleKeyboard = this.toggleKeyboard.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  componentDidMount() {
    const headers = { token: this.props.userInfo.token }
    InteractionManager.runAfterInteractions(() => {
      return fetchWithOutStatus({ act: 10025 }, headers).then(result => {
        let defaultBank = result[0] // 默认显示银行
        result.forEach(item => {
          if (item.is_default === '1') {
            defaultBank = item
            return
          }
        })
        this.setState({ allBanks: result, selectedBank: defaultBank })
      }).catch(() => {
        this.setState({ isLoading: false })
        toastShort('网络异常, 请检查网络连接后重新打开页面!')
      })
    })
  }

  _onPress2CheckDetail() {
    const { navigation, userInfo } = this.props
    navigation.navigate('CheckDetailPage', { token: userInfo.token })
  }
  _onPressNext() {
    const { moneyInput } = this.state

    dismissKeyboard()
    if (!isMatchInputMoney(moneyInput) || parseFloat(moneyInput) <= 0) {
      toastShort('请输入正确的金额!')
    } else if (parseFloat(moneyInput) > parseFloat(this.props.userInfo.withdraw_amount)) {
      toastShort('提现金额不能大于可提现金额!')
    } else {
      this.setState({ isShowPwdModal: true })
    }
  }
  _withDrawConfirm(pwd) {
    const { navigation, userInfo } = this.props
    const { selectedBank, moneyInput } = this.state

    this.setState({ isShowPwdModal: false })

    const headers = { token: userInfo.token }
    this.setState({ isLoading: true })
    fetchWithStatus({
      act: 10035,
      user_bank_id: selectedBank.id,
      amount: moneyInput,
      funds_password: pwd,
    }, headers).then(() => {
      this.setState({ isLoading: false })
      DeviceEventEmitter.emit('lISTENER_UPDATE_SYS_INFOS') // 银行卡状态为1
      navigation.state.params && navigation.state.params.fromCardAdd ? navigation.dispatch({ type: 'RESET_NAV' }) : navigation.goBack()
    }).catch((reason) => {
      this.setState({ isLoading: false, errorMsg: (reason.message || '提现失败!') })
      toastShort(reason.message || '提现失败!')
    })
  }

  changeValue(val) {
    this.setState({ moneyInput: val })
  }

  toggleKeyboard(val) {
    this.setState({ isShowKeyboard: val })
  }

  onConfirm() {
    this.setState({ isShowKeyboard: false })
  }

  render() {
    const { allBanks, selectedBank, isShowKeyboard, moneyInput, isShowPwdModal, isErrorPopup, errorMsg, isLoading } = this.state
    const { userInfo, navigation } = this.props
    const isClickAvailable = !isEmptyStr(moneyInput)
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => {Sound.stop();Sound.play();dismissKeyboard()}}>
        <ModalGridPassword
          visible={isShowPwdModal}
          onPressClose={() => this.setState({ isShowPwdModal: false })}
          onEndInput={this._withDrawConfirm.bind(this)}/>
        <ModalPopup
          visible={isErrorPopup}
          onPressCancel={null}
          onPressConfirm={() => this.setState({ isErrorPopup: false })}>
          {errorMsg}
        </ModalPopup>
        <ModalLoading
          visible={isLoading}
          text={'提现中...'}/>
        <HeaderToolBar
          title={'提现'}
          leftIcon={'back'}
          rightIcon1={'text'}
          rightText={'限额说明'}
          rightIconAction1={() => navigation.navigate('LimitIllustratePage')}
          leftIconAction={() => navigation.state.params && navigation.state.params.fromCardAdd ? navigation.dispatch({ type: 'RESET_NAV' }) : navigation.goBack()}/>

      <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 13 }}>{'余额: '}</Text>
            <Text style={{ fontSize: 13, color: Config.baseColor }}>{`${formatMoney(userInfo.account_balance || 0)}`}</Text>
            <Text style={{ fontSize: 13 }}>元</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 13 }}>可提现金额</Text>
            <Text style={{ fontSize: 13, color: Config.baseColor }}>{`${formatMoney(userInfo.withdraw_amount || 0)}`}</Text>
            <Text style={{ fontSize: 13 }}>元</Text>
          </View>
        </View>

        <View style={styles.chooseContainer}>
          <Image source={selectedBank.bank_image && selectedBank.bank_image !== '' ? {uri:selectedBank.bank_image} : require('../../../src/img/ic_default_bank.png')} style={styles.imgIcon} />
          <ModalPickerBank
            style={styles.chooseWrap}
            data={allBanks}
            isHead={true}
            listHeight={allBanks.length * 70}
            cancelText='请选择银行卡'
            onChange={(option) => { this.setState({ selectedBank: option }) }}>
          <Text style={{ fontSize: 17, padding: 0, width: windowWidth * 4 / 5, marginBottom: 10, textAlign: 'left' }}>
            {selectedBank.bank_name}
          </Text>
          <Text style={{ fontSize: 14, padding: 0, color: '#999', width: windowWidth * 4 / 5, textAlign: 'left' }}>
            {selectedBank.bank_account}
          </Text>
          </ModalPickerBank>
          <Image source={require('../../../src/img/ic_arrow_right.png')} style={styles.icon} />
        </View>

        <View style={styles.limitWrap}>
          <Text style={{ fontSize: 12, color: '#666666', paddingVertical: 5 }}>{'提现金额'}</Text>
          <View style={styles.moneyWrap}>
            <Image source={require('../../../src/img/ic_rmb.png')} style={styles.unitImg} />
            <TouchableWithoutFeedback
              style={{flex: 1, justifyContent: 'center'}}
              onPress={() => {this.toggleKeyboard(true)}}>
              <View style={{flex: 1}}>
                {
                  moneyInput ? (
                    <Text style={styles.input}>{ moneyInput }</Text>
                  ) : (
                    <Text style={styles.inputTips}>0.00</Text>
                  )
                }

              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.leftTextWrap}>
            <Text style={{ fontSize: 12, color: '#666666' }} />
            <Text style={{ fontSize: 12, color: '#FF0000' }} />
            <Text style={{ fontSize: 12, color: '#666666' }} />
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {Sound.stop();Sound.play();this._onPress2CheckDetail.bind(this)()}}>
            <Text style={{ fontSize: 12, color: '#FF0000' }}>稽核详情</Text>
          </TouchableOpacity>
        </View>


        <ButtonIos
          flexOrientation='row'
          disabled={!isClickAvailable}
          containerStyle={[styles.confirmBtn]}
          styleTextLeft={[{ fontSize: 20 }, isClickAvailable ? { color: '#FFFFFF' } : { color: '#999999' }]}
          text='下一步'
          onPress={() => {Sound.stop();Sound.play();this._onPressNext.bind(this)()}}/>
        <CoustomKeyboard
          isOpen={isShowKeyboard}
          defaultValue={moneyInput}
          buttonLabel='确认'
          onTextChange={(text) => this.changeValue(text)}
          onClosedHandle={() => this.toggleKeyboard(false)}
          onButtonPress={(text) => this.onConfirm(text)}/>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F9',
  },
  chooseContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  imgIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  chooseWrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  icon: {
    width: 10,
    height: 10,
  },
  limitWrap: {
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    marginTop: 10,
  },
  unitImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 5,
    paddingHorizontal: 10,
  },
  moneyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  input: {
    color: '#000000',
    fontSize: 24,
    lineHeight: 24,
  },
  inputTips: {
    fontSize: 24,
    lineHeight: 24,
    color: '#ccc',
  },
  textContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftTextWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  confirmBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    marginTop: 20,
    borderRadius: 4,
    marginHorizontal: 10,
  },

})

const mapStateToProps = ({ userInfo }) => (
  { userInfo }
)

export default connect(mapStateToProps)(WithDrawCashPage)
