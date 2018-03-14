import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Clipboard } from 'react-native'
import { formatCard4Space } from '../utils/formatUtil'
import Sound from './clickSound'

const CHECK_ICON = [require('../src/img/ic_unselected.png'), require('../src/img/ic_selected.png')]

const CheckBoxBank = ({ checked, onPress, cardNum, bankinfo,
    userName, activeOpacity, bankAddr }) => {
  return (
    <TouchableOpacity
      style={styles.containerStyle}
      onPress={() => {Sound.stop();Sound.play();onPress()}}
      activeOpacity={activeOpacity}>
      {
        checked ? <Image source={CHECK_ICON[1]} style={styles.icon} /> : <Image source={CHECK_ICON[0]} style={styles.icon} />
      }
      <View style={styles.bankInfoWrap}>
        <View style={styles.imgWrap}>
          <Image source={bankinfo.bank_image_long ? {uri:bankinfo.bank_image_long} : require('../src/img/img_default_bank.png')} style={styles.bankImg} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{bankAddr}</Text>
        </View>
        <View style={styles.textWrap}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.label}>卡号：{formatCard4Space(cardNum)}</Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(cardNum)
              }}>
              <Text style={{marginTop: 2, marginLeft: 20, color: '#59A3EC'}}>复制</Text>
            </TouchableOpacity>
          </View>

        </View>
        <View style={[styles.row, {flexDirection: 'row'}]}>
          <Text style={styles.label}>账户：{userName}</Text>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(userName)
            }}>
            <Text style={{marginTop: 2, marginLeft: 20, color: '#59A3EC'}}>复制</Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  bankImg: {
    height: 30,
    width: 150,
    paddingLeft: 0,
    resizeMode: 'contain',
  },
  bankInfoWrap: {
    flex: 1,
    flexDirection: 'column',
  },
  imgWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 15,
  },
  row: {
    marginTop: 10,
  },
})

CheckBoxBank.defaultProps = {
  cardNum: '',
  userName: '',
  checked: false,
  underlayColor: 'white',
  activeOpacity: 0.9,
}

export default CheckBoxBank
