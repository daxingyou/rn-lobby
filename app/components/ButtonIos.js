import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import Sound from './clickSound'

const ButtonIos = ({ onPress, isCross, disabled, styleTextLeft, activeOpacity,
  styleTextRight, styleTextEnd, containerStyle, text, flexOrientation, wrapBallStyle }) => {
  const textListTemp = text.split(' ')
  const textList = []
  textList[0] = textListTemp[0]

   if (textListTemp[2]) {
     if (textListTemp[1].indexOf(',') !== -1) {
      textList[1] = textListTemp[1]+textListTemp[2]
    }
    if (textListTemp[2].indexOf('/') !== -1) {
      textList[1] = textListTemp[1]
      textList[2] = textListTemp[2].split("/").join(" ")
    }
   } else {
     if (textListTemp[1]){
       if(textListTemp[1].indexOf('/') !== -1){
         textList[1] = textListTemp[1].split("/").join(" ")
       } else {
         textList[1] = textListTemp[1]
       }

     }
   }
  return (
    <TouchableOpacity
      style={disabled ? [containerStyle, { backgroundColor: '#EEEEEE' }] : containerStyle}
      onPress={() => {Sound.stop();Sound.play();onPress()}}
      underlayColor='transparent'
      disabled={disabled}
      activeOpacity={activeOpacity}>
      <View style={{ flexDirection: flexOrientation, alignItems: 'center' }}>
        <View style={wrapBallStyle}>
          <Text  allowFontScaling={false} style={styleTextLeft}>
            {textList[0] || ''}
          </Text>
        </View>
        {
          (textList[1] && flexOrientation === 'row') ? <Text>{' '} </Text> : null
        }
        <Text  allowFontScaling={false} style={styleTextRight}>{textList[1] || ''}</Text>
        {
          textList[2]?
          <View style={wrapBallStyle}>
          <Text  allowFontScaling={false} style={styleTextEnd}>
            {textList[2] || ''}
          </Text>
        </View>:null
        }
      </View>
      {
        isCross ? <Image source={require('../src/img/ic_cross.png')} style={styles.cross} /> : null
      }
    </TouchableOpacity>
  )
}

ButtonIos.defaultProps = {
  onPress() {},
  disabled: false,
  activeOpacity: 0.85,
  flexOrientation: 'row',
}

const styles = StyleSheet.create({
  cross: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
  },
})

export default ButtonIos
