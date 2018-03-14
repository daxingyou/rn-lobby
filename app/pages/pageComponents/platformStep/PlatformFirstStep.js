import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import ButtonIos from '../../../components/ButtonIos'
import CheckBoxBank from '../../../components/CheckBoxBank'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'

export default class PlatformFirstStep extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cardInfos: [],
      checkedkeeping: [],
    }
  }
  componentDidMount() {
    const headers = { token: this.props.token }
    fetchWithOutStatus({ act: 10026 }, headers).then((res) => {
      const initKeeping = res.map((item, index) => {
        if (index === 0) {
          return true
        }
        return false
      })
      this.setState({ cardInfos: res, checkedkeeping: initKeeping })
    })
  }

  _onPressCheck(i) {
    const resetKeeping = this.state.checkedkeeping.map(() => false)
    const keeping = [...resetKeeping.slice(0, i), true, ...resetKeeping.slice(i + 1)]
    this.setState({ checkedkeeping: keeping })
  }
  _onPressNext(index) {
    let selectItem = null
    this.state.cardInfos.forEach((item, i) => {
      if (this.state.checkedkeeping[i]) {
        selectItem = item
        return
      }
    })
    const obj = { recharge_account_id: selectItem.id, recharge_bank: selectItem.bank_name }
    this.props.onPressNextStep(index, obj)
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.state.cardInfos.map((item, index) => {
            return (
              <CheckBoxBank
                key={index}
                bankinfo={item}
                bankType={item.bank_code}
                cardNum={item.bank_account}
                bankAddr={item.bank_addr}
                userName={item.bank_user_name}
                onPress={() => {Sound.stop();Sound.play();this._onPressCheck.bind(this, index)()}}
                checked={this.state.checkedkeeping[index]}/>
            )
          })
        }
        <View style={{marginLeft: 10}}>
          <Text style={{color: 'red'}}>*提交订单前，请先进行转账操作，以便更迅速的为您服务</Text>
        </View>
        {
          this.state.cardInfos.length > 0 ?
            <ButtonIos
              flexOrientation='row'
              containerStyle={[styles.confirmBtn, { borderColor: Config.baseColor }]}
              styleTextLeft={{ fontSize: 20, color: '#FFFFFF' }}
              text='下一步'
              onPress={() => {Sound.stop();Sound.play();this._onPressNext.bind(this, 1)()}}/> : null
        }

      </ScrollView>
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
    marginVertical: 20,
    borderRadius: 5,
  },
})
