import React from 'react'
import { Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import Sound from './clickSound'

const SettingListItem = ({ onPress, styleText,
  containerStyle, text, activeOpacity }) => {
  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => {Sound.stop();Sound.play();onPress()}}
      activeOpacity={activeOpacity}>
      <Text style={styleText}>
        {text}
      </Text>
      <Image source={require('../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
    </TouchableOpacity>
  )
}

SettingListItem.defaultProps = {
  onPress() {},
  disabled: false,
  activeOpacity: 0.85,
}
const styles = StyleSheet.create({
  imgStyle: {
    width: 12,
    height: 20,
    resizeMode: 'contain',
  },
})

export default SettingListItem
