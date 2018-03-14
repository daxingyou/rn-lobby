import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Sound from "../../components/clickSound"
import {toastShort} from "../../utils/toastUtil"
import Config from "../../config/global"
import { digits } from '../../utils/config'

const BetBottom = ({ randomOrder, delOrderInfo, orderInfo, isLogin, navigation, setWinShow, currentSubPlay }) => (
  <View style={styles.bottom}>
    <TouchableOpacity
      style={styles.randomBtn}
      underlayColor='transparent'
      onPress={() => {
        Sound.stop()
        Sound.play()
        if (orderInfo.betNum <= 0 ) {
          randomOrder()
        } else {
          delOrderInfo()
        }
      }}>
      <Text style={styles.randomBtnText}>{orderInfo.betNum <= 0 ? '机选' : '清空'}</Text>
    </TouchableOpacity>
    <View style={styles.total}>
      <Text style={styles.totalTextRed}>{orderInfo.betNum}</Text>
      <Text style={styles.totalText}>注</Text>
      <Text style={styles.totalTextRed}>{orderInfo.totalPrice}</Text>
      <Text style={styles.totalText}>元</Text>
    </View>
    <TouchableOpacity
      style={styles.confirmBtn}
      underlayColor='transparent'
      onPress={() => {
        Sound.stop()
        Sound.play()
        if (!isLogin) {
          navigation.navigate('LoginPage')
        } else if (orderInfo && orderInfo.betNum <= 0) {
          if (['连码', '自选不中', '中一', '连肖连尾', '合肖', '特码包三'].includes(orderInfo.playName)) {
            const tabName = currentSubPlay.groupName.slice(0, 2)
            toastShort(`未选满${digits[tabName]}个球`)
          } else if (orderInfo.playName === '正码过关') {
            toastShort('至少选2组')
          } else {
            toastShort('请先选择号码')
          }
        } else {
          setWinShow()
        }
      }}>
      <Text style={styles.confirmBtnText}>确定</Text>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  bottom: {
    height: 50,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  randomBtn: {
    width: 60,
    height: 30,
    backgroundColor: '#FFEFEF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Config.baseColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomBtnText: {
    color: Config.baseColor,
    fontSize: 16,
    letterSpacing: 1.37,
  },
  total: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 15,
  },
  totalTextRed: {
    fontSize: 15,
    color: Config.baseColor,
    paddingHorizontal: 2,
  },
  confirmBtn: {
    width: 60,
    height: 30,
    backgroundColor: Config.baseColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  confirmBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.37,
  },
})

export default BetBottom
