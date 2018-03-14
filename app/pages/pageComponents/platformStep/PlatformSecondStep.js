import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, TextInput, Dimensions } from 'react-native'
import ButtonIos from '../../../components/ButtonIos'
import ModalPicker from '../../../components/github/modalPicker/ModalPicker'
import ModalPickerBank from '../../../components/modal/ModalPickerBank'
import { isEmptyStr } from '../../../utils/stringUtil'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import DatePicker from 'react-native-datepicker'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'

const windowWidth = Dimensions.get('window').width

export default class PlatformSecondStep extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bankDatas: [],
      cashTypes: [],
      name: '',
      cashType: '',
      bankType: '',
      time: '',
      detail: '',
    }
  }
  componentDidMount() {
    const headers = { token: this.props.token }
    fetchWithOutStatus({ act: 10028 }, headers).then((res) => {
      this.setState({ bankDatas: res })
    })
    fetchWithOutStatus({ act: 10027 }, headers).then((res) => {
      this.setState({ cashTypes: res })
    })
  }
  _onPressNext(index) {
    let rechargeBankId = 1
    let rechargeType = 1
    const { name, bankType, cashType, time, detail } = this.state
    this.state.bankDatas.forEach((item) => {
      if (item.bank_name === bankType) {
        rechargeBankId = item.bank_id
        return
      }
    })
    this.state.cashTypes.forEach((item) => {
      if (item.name === cashType) {
        rechargeType = item.id
        return
      }
    })
    const obj = {
      user_name: name,
      recharge_type: rechargeType,
      rechargeTypeName: cashType,
      recharge_date: time,
      recharge_bank_id: rechargeBankId,
      inBank: bankType,
      detail: detail,
    }
    this.props.onPressNextStep(index, obj)
  }
  render() {
    const { name, cashType, bankType, time, detail } = this.state
    let isClickAvailable = false
    if (cashType === 'ATM自动柜员机' || cashType === 'ATM现金入款') {
      isClickAvailable = !isEmptyStr(name)
        && !isEmptyStr(cashType)
        && !isEmptyStr(bankType)
        && !isEmptyStr(time)
        && !isEmptyStr(detail)
    }else {
      isClickAvailable = !isEmptyStr(name)
        && !isEmptyStr(cashType)
        && !isEmptyStr(bankType)
        && !isEmptyStr(time)
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={[styles.itemWrap, { borderBottomWidth: .5, borderColor: '#E5E5E5' }]}>
            <Text style={styles.textTitle}>姓名</Text>
            <View style={styles.inputWrap}>
              <TextInput underlineColorAndroid='transparent'
                style={styles.input}
                placeholder={'请输入存款人姓名'}
                onChangeText={text => this.setState({ name: text })}/>
            </View>
          </View>

          <View style={[styles.itemWrap, { justifyContent: 'space-between' }]}>
            <Text style={styles.textTitle}>方式</Text>
            <View style={styles.pickerWrap}>
              <ModalPicker
                data={this.state.cashTypes}
                isHead={false}
                onChange={(option) => {
                  this.setState({ cashType: option.name })
                }}>
                {
                  this.state.cashType ?
                    (<Text style={styles.textInput}>{this.state.cashType}</Text>)
                    :
                    (<Text style={[styles.textInput,{color : "#ccc"}]}>请选择存款方式</Text>)
                }
              </ModalPicker>
              <Image source={require('../../../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
            </View>
          </View>

          {
            cashType == 'ATM现金入款' || cashType == 'ATM自动柜员机' ?
              (
                <View style={[styles.itemWrap, { justifyContent: 'space-between' }]}>
                <Text style={styles.textTitle}>支行地址</Text>
                <View style={styles.inputWrap}>
                  <TextInput underlineColorAndroid='transparent'
                    style={styles.input}
                    placeholder={'请输入支行地址'}
                    onChangeText={(text) => this.setState({detail:text})}/>
                </View>
              </View>
            )
             : null
          }

          <View style={[styles.itemWrap, { justifyContent: 'space-between' }]}>
            <Text style={styles.textTitle}>银行</Text>
            <View style={styles.pickerWrap}>

              <ModalPickerBank
                data={this.state.bankDatas}
                cancelText='请选择银行卡'
                onChange={(option) => {this.setState({ bankType: option.bank_name })}}>
                {
                  this.state.bankType ?
                    (<Text style={styles.textInput}>{this.state.bankType}</Text>)
                    :
                    (<Text style={[styles.textInput,{color : "#ccc"}]}>请选择银行</Text>)
                }
              </ModalPickerBank>
              <Image source={require('../../../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
            </View>
          </View>

          <View style={[styles.itemWrap]}>
            <Text style={styles.textTitle}>金额</Text>
            <View style={styles.inputWrap}>
              <TextInput underlineColorAndroid='transparent'
                style={styles.input}
                editable={false}
                value={`${this.props.datas.amount}元`}/>
            </View>
          </View>

          <View style={[styles.itemWrap, { justifyContent: 'space-between',borderBottomWidth: 0}]}>
            <Text style={styles.textTitle}>存款时间</Text>
            <View style={styles.pickerWrap}>
              <DatePicker
                style={{width: windowWidth / 2,height : 40}}
                date={this.state.time}
                mode='datetime'
                placeholder='请选择日期'
                format='YYYY-MM-DD' minDate='2017-01-01'
                maxDate={new Date()} showIcon={false}
                confirmBtnText='确定' cancelBtnText='取消'
                customStyles={{
                  dateInput: { borderWidth: 0, alignItems : "flex-end" },
                }}
                onDateChange={(date) => {this.setState({ time: date })}}/>
              <Image source={require('../../../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
            </View>
          </View>
        </View>
        <ButtonIos
          flexOrientation='row'
          disabled={!isClickAvailable}
          containerStyle={[styles.confirmBtn,
            isClickAvailable ?
              { borderColor: 'black' }
              : { borderColor: Config.baseColor }]}
          styleTextLeft={[{ fontSize: 20 }, isClickAvailable ? { color: '#FFF' } : { color: '#999' }]}
          text='下一步'
          onPress={() => {Sound.stop();Sound.play();this._onPressNext.bind(this, 2)()}}/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    paddingHorizontal: 10,
  },
  itemWrap: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    justifyContent: 'space-between',
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
  imgStyle: {
    width: 10,
    height: 10,
    marginLeft: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    fontSize: 15,
    justifyContent: 'flex-end',
    textAlign: 'right',
    marginRight: 20,
    height: 20,
    width: 160,
    padding: 0,
  },
  textInput: {
    fontSize: 15,
    width: windowWidth / 2,
    textAlign: 'right',
    paddingVertical: 5,
  },
  confirmBtn: {
    paddingVertical: 12,
    marginHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 5,
  },
})
