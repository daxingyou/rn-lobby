import React from 'react'
import { View, Dimensions, Modal, Text, StyleSheet } from 'react-native'
import Sound from '../clickSound'
import Button from '../Button'
import Config from '../../config/global'

const { width } = Dimensions.get('window')

const ModalPopup = ({ children, visible, onPressCancel, onPressConfirm, title }) => {
  const { containerStyle, textStyle, textSectionStyle, buttonSectionStyle, titleStyle, weeline } = styles

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'>
      <View style={containerStyle}>
        <View style={textSectionStyle}>
          {
            title ?
            <Text style={titleStyle}>
              {title}
            </Text>
            :
            null
          }
          <Text style={textStyle}>
            {children}
          </Text>
        </View>

        <View style={{backgroundColor: '#fff'}}>
          <View style={weeline}  />
        </View>


        <View style={buttonSectionStyle}>
          {
            onPressCancel ? <Button onPress={() => {Sound.stop();Sound.play();onPressCancel()}} textColor={'#449EFC'}>取消</Button> : null
          }
          {
            onPressCancel ? <View style={{ backgroundColor: '#999', width: StyleSheet.hairlineWidth }} /> : null
          }
          <Button onPress={() => {Sound.stop();Sound.play();onPressConfirm()}} textColor={Config.baseColor}>确定</Button>
        </View>
      </View>
    </Modal>
  )
}
const styles = {
  weeline: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width / 8,
  },
  textSectionStyle: {
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#FFF',
  },
  textStyle: {
    fontSize: 17,
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: 24,
  },
  titleStyle: {
    fontSize: 17,
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonSectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#FFF',
  },

}

export default ModalPopup
