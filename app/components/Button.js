import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Sound from './clickSound'

const Button = ({ onPress, children, textColor }) => {
  const { buttonStyle, textStyle } = styles

  return (
    <TouchableOpacity onPress={() => {Sound.stop();Sound.play();onPress()}} style={buttonStyle}>
      <Text style={[textStyle, { color: textColor }]}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 16,
    fontWeight: '400',
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
  },
}

export default Button
