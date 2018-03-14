import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import ButtonIos from '../../../components/ButtonIos'
import { fetchWithStatus } from '../../../utils/fetchUtil'
import { ModalLoading } from '../../../components/common'
import ModalPopup from '../../../components/modal/ModalPopup'
import { getUserInfo } from '../../../actions'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'

class PlatformSecondStep extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      isErrorPopup: false,
      errorTip: '',
    }
  }
  _onPressConfirm() {
    this.setState({ isLoading: true })
    const { user_name, amount, recharge_account_id, recharge_type, recharge_date, recharge_bank_id, detail } = this.props.datas
    const headers = { token: this.props.token }
    fetchWithStatus({
      act: 10036,
      user_name,
      amount,
      recharge_account_id,
      recharge_type,
      recharge_date,
      recharge_bank_id,
      detail,
    }, headers).then(() => {
      this.setState({ isLoading: false })
      this.props.getUserInfo(this.props.token) // 更新redux中的用户信息
      this.props.navigation.dispatch({ type: 'RESET_NAV' })
    }).catch(reason => {
      this.setState({ isLoading: false, isErrorPopup: false })
      setTimeout(() => {
        this.setState({ isErrorPopup: true, errorTip: (reason.message || '充值失败!') })
      }, 500)
    })
  }

  render() {
    const { datas } = this.props
    return (
      <View style={styles.container}>
        <ModalPopup
          visible={this.state.isErrorPopup}
          onPressCancel={null}
          onPressConfirm={() => this.setState({ isErrorPopup: false })}>
          {this.state.errorTip}
        </ModalPopup>
        <ModalLoading visible={this.state.isLoading} text={'充值中...'} />
        <View style={styles.inputContainer}>
          <View style={[styles.itemWrap]}>
            <Text style={styles.textTitle}>姓名</Text>
            <Text style={styles.textTitle}>{datas.user_name}</Text>
          </View>
          <View style={[styles.itemWrap]}>
            <Text style={styles.textTitle}>存款金额</Text>
            <Text style={styles.textTitle}>{`${datas.amount}元`}</Text>
          </View>
          <View style={[styles.itemWrap]}>
            <Text style={styles.textTitle}>存入银行</Text>
            <Text style={styles.textTitle}>{datas.recharge_bank}</Text>
          </View>
          {
            datas.detail ?
            (
              <View style={[styles.itemWrap]}>
                <Text style={styles.textTitle}>支行地址</Text>
                <Text style={styles.textTitle}>{datas.detail}</Text>
              </View>
            ) : null
          }
          <View style={[styles.itemWrap]}>
            <Text style={styles.textTitle}>存款方式</Text>
            <Text style={styles.textTitle}>{datas.rechargeTypeName}</Text>
          </View>
          <View style={[styles.itemWrap]}>
            <Text style={styles.textTitle}>存款时间</Text>
            <Text style={styles.textTitle}>{datas.recharge_date}</Text>
          </View>
          <View style={[styles.itemWrap, { borderBottomWidth: 0 }]}>
            <Text style={styles.textTitle}>你使用的银行</Text>
            <Text style={styles.textTitle}>{datas.inBank}</Text>
          </View>
        </View>
        <ButtonIos
          flexOrientation='row'
          containerStyle={[styles.confirmBtn, { borderColor: Config.baseColor }]}
          styleTextLeft={{ fontSize: 20, color: '#FFFFFF' }}
          text='确认'
          onPress={() => {Sound.stop();Sound.play();this._onPressConfirm.bind(this)()}}/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  confirmBtn: {
    paddingVertical: 12,
    marginHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    marginTop: 30,
    borderRadius: 5,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#E5E5E5',
    paddingHorizontal: 10,
  },
  itemWrap: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: .5,
    borderColor: '#E5E5E5',
  },
  textTitle: {
    fontSize: 17,
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

export default connect(mapStateToProps, mapDispatchToProps)(PlatformSecondStep)
