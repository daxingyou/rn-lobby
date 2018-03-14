import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import Sound from "../../components/clickSound"

const Guide = ({ tabs, onShowGuide, zhengMaGuoGuan, teMaBaoSan }) => (
  <View style={[styles.tipsWrap, !tabs && {marginTop: -10}, (zhengMaGuoGuan || teMaBaoSan) && {marginTop: -40}]}>
    <TouchableOpacity
      style={styles.tips}
      underlayColor='transparent'
      onPress={() => {
        Sound.stop()
        Sound.play()
        onShowGuide()
      }}>
      <Text style={styles.tipsText}>玩法提示</Text>
      <View style={{height: 25, backgroundColor: '#EDF1F6', justifyContent: 'center'}}>
        <Image source={require('../../src/img/tips_arrow.png')} style={styles.tipsIcon}/>
      </View>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  tipsWrap: {
    height: 30,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF1F6',
    height: 25,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  tipsIcon: {
    height: 11,
    resizeMode: 'contain',
    backgroundColor: '#EDF1F6',
    marginRight: 2,
  },
  tipsText: {
    marginLeft: 10,
    color: '#6B839C',
    fontSize: 12,
  },
})

export default Guide
