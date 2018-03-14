import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Sound from './clickSound'
import Config from '../config/global'

const ButtonBall = ({ onPress, isSelect, ballType, styleTextLeft,
  styleTextRight, styleTextEnd, containerStyle, text, wrapBallStyle }) => {

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
  let ballWidth = 0
  let ballHeight = 0

  if (ballType === 'small') {
    ballWidth = 40
    ballHeight = 40
  } else if (ballType === 'big') {
    ballWidth = 64
    ballHeight = 64
  } else if (ballType === 'sx') {
    ballWidth = 90
    ballHeight = 75
  }
  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => {
        Sound.stop()
        Sound.play()
        onPress()
      }}
      underlayColor='transparent'>
        <View style={[styles.wrapBallStyle,{width:ballWidth,height:ballHeight},ballType=='sx'?{borderRadius:8}:{},isSelect?{backgroundColor:Config.baseColor}:{}]}>
          <Text allowFontScaling={false} style={[styleTextLeft, textList[1] === '' && {marginTop: -25}]}>
            {textList[0] || ''}
          </Text>
        </View>
        {
          textList[1]?
          <View style={wrapBallStyle}>
          <Text allowFontScaling={false} style={styleTextRight}>
            {textList[1] || ''}
          </Text>
        </View>:null
        }
        {
          textList[2]?
          <View style={wrapBallStyle}>
          <Text allowFontScaling={false} style={[styleTextEnd, textList[1] === '' && {marginTop: -28}]}>
            {textList[2] || ''}
          </Text>
        </View>:null
        }
    </TouchableOpacity>
  )
}

ButtonBall.defaultProps = {
  onPress() {},
  disabled: false,
  activeOpacity: 0.4,
}

const styles = StyleSheet.create({
  wrapBallStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    shadowOpacity: 0.2,
    shadowOffset: {height:2,width:0},
    shadowColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor:'#d3d3d3',
  },
})

export default ButtonBall
