import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Dimensions, DeviceEventEmitter } from 'react-native'
import ButtonIos from '../../../components/ButtonIos'
import dismissKeyboard from '../../../utils/dismissKeyboard'
import HeaderToolBar from '../../../components/HeadToolBar'
import { fetchWithStatus, fetchWithOutStatus } from '../../../utils/fetchUtil'
import { ModalLoading } from '../../../components/common'
import ModalPopup from '../../../components/modal/ModalPopup'
import ModalPickerBank from '../../../components/modal/ModalPickerBank'
import { isEmptyStr } from '../../../utils/stringUtil'
import { formatCard4Space, formatClearSpace } from '../../../utils/formatUtil'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'
import { toastShort } from '../../../utils/toastUtil'

const windowWidth = Dimensions.get('window').width

class BankCardAddPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bankDatas: [],
      showCardNum: '',
      bankSelected: '',
      bankAddr: '',
      fundPwd: '',
      isLoading: false,
      isErrorPopup: false,
      errorTip: '',
      exclamationon: false,
    }
  }

  componentDidMount() {
    const headers = { token: this.props.userInfo.token }
    fetchWithOutStatus({ act: 10028 }, headers).then((res) => {
      this.setState({ bankDatas: res })
    })
  }

  _onPress2AddCard() {
    const { showCardNum, bankSelected, bankAddr, fundPwd, bankDatas } = this.state
    const { navigation, userInfo } = this.props

    this.setState({ isLoading: true })
    let bankId = 1
    bankDatas.forEach((item) => {
      if (item.bank_name === bankSelected) {
        bankId = item.bank_id
        return
      }
    })
    const headers = { token: userInfo.token }
    fetchWithStatus({
      act: 10024,
      bank_id: bankId,
      bank_addr: bankAddr,
      bank_card_no: formatClearSpace(showCardNum),
      funds_password: fundPwd,
    }, headers).then(() => {
      this.setState({ isLoading: false })
      DeviceEventEmitter.emit('lISTENER_UPDATE_SYS_INFOS') // 银行卡状态为1
      if (navigation.state.params && navigation.state.params.fromCardMain) {
        DeviceEventEmitter.emit('lISTENER_BANK_CARDS') // 更新绑定银行列表
        navigation.goBack(navigation.state.params.fwdPageKey)
      } else {
        navigation.navigate('WithDrawCashPage', { fromCardAdd: true })
      }
    }).catch((reason) => {
      this.setState({ isLoading: false, isErrorPopup: false })
      toastShort(reason.message || '绑定银行卡失败')
    })
  }

  render() {
    const { showCardNum, bankSelected, bankAddr, fundPwd, isErrorPopup, errorTip, isLoading, exclamationon, bankDatas } = this.state
    const { userInfo, navigation } = this.props
    const isClickAvailable = !isEmptyStr(userInfo.realname) && !isEmptyStr(fundPwd) && !isEmptyStr(showCardNum) && !isEmptyStr(bankSelected) && !isEmptyStr(bankAddr)
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {Sound.stop();Sound.play();dismissKeyboard()}}
        activeOpacity={1}>
        <HeaderToolBar
          title={'绑定银行卡'}
          leftIcon={'back'}
          leftIconAction={() => navigation.goBack(navigation.state.params && navigation.state.params.fwdPageKey)}/>
        <ModalPopup
          visible={isErrorPopup}
          onPressCancel={null}
          onPressConfirm={() => this.setState({ isErrorPopup: false })}>
          {errorTip}
        </ModalPopup>
        <ModalLoading visible={isLoading} text={'绑定中...'} />

        <Text style={{ margin: 10, fontSize: 12, color: '#999' }}>{'为了您账户安全,真实姓名需要与绑定银行卡姓名一致'}</Text>

        <View style={styles.textContainer}>
          <View style={[styles.itemWrap]}>
            <Text style={styles.text}>姓名</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              editable={false}
              value={userInfo.realname}/>
            <ModalPopup
              visible={exclamationon}
              title={'持卡人说明'}
              onPressCancel={null}
              onPressConfirm={() => this.setState({ exclamationon: false })}>
              {'为保证账户资金安全，只能绑定认证用户本人的银行卡。'}
            </ModalPopup>
            <TouchableOpacity
              onPress={()=>this.setState({exclamationon: true})}>
              <Image source={require('../../../src/img/exclamation.png')} style={styles.exclamationStyle} />
            </TouchableOpacity>
          </View>
          <View style={styles.itemWrap}>
            <Text style={styles.text}>卡号</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              placeholder='请输入银行卡号'
              keyboardType='numeric'
              value={showCardNum}
              maxLength={24}
              onChangeText={(text) => {
                this.setState({ showCardNum: formatCard4Space(text) })
              }}/>
          </View>
          <View style={[styles.itemWrap, { justifyContent: 'space-between' }]}>
            <Text style={styles.textTitle}>银行</Text>
            <View style={styles.pickerWrap}>
              <ModalPickerBank
                data={bankDatas}
                cancelText='请选择银行'
                isHead={true}
                listHeight={bankDatas.length * 30}
                onChange={(option) => { this.setState({ bankSelected: option.bank_name }) }}>
                <Text style={styles.textInput}>{bankSelected?bankSelected:"请选择银行"}</Text>
              </ModalPickerBank>
              <Image source={require('../../../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
            </View>
          </View>
          <View style={[styles.itemWrap, { borderBottomWidth: 0 }]}>
            <Text style={styles.text}>开户行</Text>
            <TextInput underlineColorAndroid='transparent'
              style={styles.input}
              placeholder='请输入开户行地址'
              onChangeText={(text) => this.setState({ bankAddr: text })}/>
          </View>
        </View>

        <View style={styles.pwdWrap}>
          <Text style={styles.text}>资金密码</Text>
          <TextInput underlineColorAndroid='transparent'
            style={styles.input}
            secureTextEntry={true}
            maxLength={6}
            keyboardType='numeric'
            placeholder='请输入6位数字的资金密码'
            onChangeText={(text) => this.setState({ fundPwd: text })}/>
        </View>

        <ButtonIos
          flexOrientation='row'
          disabled={!isClickAvailable}
          containerStyle={[styles.confirmBtn, isClickAvailable ? { borderColor: 'black' } : { borderColor: Config.baseColor }]}
          styleTextLeft={[{ fontSize: 20 }, isClickAvailable ? { color: '#FFFFFF' } : { color: '#999999' }]}
          text='确认'
          onPress={() => {Sound.stop();Sound.play();this._onPress2AddCard.bind(this)()}}/>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  exclamationStyle: {
    width: 21,
    height: 21,
    marginRight: 2,
  },
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
  text: {
    fontSize: 17,
    marginRight: 5,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    color: 'black',
    fontSize: 16,
  },
  itemWrap: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  textTitle: {
    fontSize: 17,
    marginRight: 10,
  },
  pickerWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textInput: {
    padding: 0,
    fontSize: 16,
    width: windowWidth / 2,
    paddingVertical: 10,
    textAlign: 'right',
  },
  imgStyle: {
    width: 10,
    height: 10,
    marginLeft: 10,
  },
  pwdWrap: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
    marginTop: 10,
    paddingHorizontal: 10,
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
    userInfo: state.userInfo,
  }
}

export default connect(mapStateToProps)(BankCardAddPage)
