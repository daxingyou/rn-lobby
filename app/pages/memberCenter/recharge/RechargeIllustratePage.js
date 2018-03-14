import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import Config from '../../../config/global'

const DATAS = [
  { content: '单笔充值金额必须消费满该笔充值金额的打码量才方可提款' },
  { content: '微信、支付宝支付（扫一扫直接到账）方便快捷支付完成立即到账,24小时存款不限次数，免除手续费，3分钟火速到账' },
  { content: `推荐使用银行转账：更快捷 / 3分钟到账
更划算/ 更大额` },
  { content: '第三方支付仅供小额度存款。跨行汇款或存款金额低于1000元建议使用在线支付，无需手续费，支付完成，立即到账' },
  { content: '存款遇到问题？立即联络在线客服为您服务' },
]
export default class RechargeIllustratePage extends Component {

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
        <HeaderToolBar
          title={'充值说明'}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>
        <ScrollView>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 14, lineHeight: 15 }}>{'        为防止少数用户利用信用卡套现和洗钱的行为,保护正常用户资金安全，充值时请注意以下几点：'}</Text>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            {
              DATAS.map((item, index) => {
                return (
                  <View key={`detail${index}`} style={{ flexDirection: 'row', marginBottom: 10, paddingRight: 10 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, marginRight: 5, marginTop: 13, backgroundColor: Config.baseColor }} />
                  <Text style={{ fontSize: 14, color: '#666', lineHeight: 30 }}>{item.content}</Text>
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}
