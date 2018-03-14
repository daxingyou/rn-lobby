import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import HeaderToolBar from '../../../components/HeadToolBar'
import Config from '../../../config/global'

class LimitIllustratePage extends Component {

  render() {
    const { userInfo } = this.props

    const DATAS = [
      { content: `确认提款时提交的的银行信息的正确性
必须保证银行卡用户名与注册时提交的用户真实姓名一致` },
      { content: `单笔提款金额最低金额为${userInfo.everytime_withdraw_min_amount}元,最高限额为${userInfo.everytime_withdraw_max_amount}元` },
      { content: `为保证账户资金安全,会员提款每日限${userInfo.everyday_withdraw_count}次,每日限制金额${userInfo.everyday_withdraw_max_amount}元,每日免手续费${userInfo.everyday_withdraw_free_count}次,超出${userInfo.everyday_withdraw_free_count}次需扣除手续费按：提款金额 ＊ ${userInfo.withdraw_fee}计算` },
      { content: `您今日已提款次数为${userInfo.today_withdraw_count}次,已提现金额为${userInfo.today_withdraw_amount}元` },

    ]

    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
        <HeaderToolBar
          title={'限额说明'}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>
        <Text style={{ fontSize: 14, fontWeight: 'bold', margin: 10 }}>温馨提示:</Text>
        <View style={{ paddingHorizontal: 10 }}>
          {
            DATAS.map((item, index) => {
              return (
                <View key={`detail${index}`} style={{ flexDirection: 'row', marginBottom: 10, paddingRight: 10 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, marginRight: 5, marginTop: 10, backgroundColor: Config.baseColor }} />
                <Text style={{ fontSize: 14, color: '#666', lineHeight: 25, letterSpacing: 0.8 }}>{item.content}</Text>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  }
}

export default connect(mapStateToProps)(LimitIllustratePage)
