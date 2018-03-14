import React from 'react'

import { View, Dimensions, Modal, Text, TouchableOpacity, Image } from 'react-native'
import Password from '../github/PasswordInput'
import Sound from '../clickSound'

const { width } = Dimensions.get('window')

const ModalGridPassword = ({ visible, onPressClose, onEndInput }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType='fade'>
      <View style={styles.overlayStyle}>
        <View style={styles.centerWrap}>
          <Text style={{ fontSize: 17, paddingVertical: 12 }}>{'请输入资金密码'}</Text>
          <View style={{ height: 1, width: width * 3 / 4, backgroundColor: '#999' }} />
          <Password
            style={{ marginVertical: 15 }}
            maxLength={6}
            onEnd={(text) => {
              onEndInput(text)
            }}/>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.wrapIcon}
            onPress={() => {Sound.stop();Sound.play();onPressClose()}}>
            <Image source={require('../../src/img/ic_close.png')} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = {
  overlayStyle: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width / 8,
  },
  centerWrap: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapIcon: {
    position: 'absolute',
    right: 3,
    top: 3,
  },
  closeIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

}

export default ModalGridPassword
