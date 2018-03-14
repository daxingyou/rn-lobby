import React from 'react'
import { View, Dimensions, Modal, Text, Image } from 'react-native'
import Button from '../ButtonIos'
import Sound from '../clickSound'
import Config from '../../config/global'

const { width } = Dimensions.get('window')
const ModalRegisterSuccess = ({ visible, onPress2Setting, onPress3Setting}) => {
  const { overLayContainer, centerContainer, centerWrap, registerSuccImg, registerSucclay,
    downTitle, itemText, btnContainer, btnTextStyle, registersecurityImg, btnContainer2, btnTextStyle2 } = styles
  return (
    <Modal
      animationType='fade'
      visible={visible}
      transparent={true}>
      <View style={overLayContainer}>
        <View style={centerContainer}>
          <Image source={require('../../src/img/registersuccess.png')} style={registerSuccImg} />
          <View style={centerWrap}>
            <Image source={require('../../src/img/registersecurity.png')} style={registersecurityImg} />
            <Image source={require('../../src/img/registerlay.png')} style={registerSucclay} />
            <Text style={downTitle}>{'为您账户资金安全'}</Text>
            <Text style={itemText}>请在第一时间设置资金密码</Text>
            <Button
              onPress={() => {Sound.stop();Sound.play();onPress2Setting()}}
              text={'去设置'}
              containerStyle={btnContainer}
              styleTextLeft={btnTextStyle}/>
            <Button
              onPress={() => {Sound.stop();Sound.play();onPress3Setting()}}
              text={'暂不设置'}
              containerStyle={btnContainer2}
              styleTextLeft={btnTextStyle2}/>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = {
  overLayContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width / 10,
  },
  centerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    zIndex: 200,
    color: '#FFF',
    marginTop: 10,
  },
  closeWrap: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 500,
  },
  closeIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  registerSuccImg: {
    resizeMode: 'stretch',
    width: width * 0.8 - 36,
    height: 149,
    zIndex: -100,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  registerSucclay: {
    resizeMode: 'contain',
    right: -20,
    width: width * 0.8,
    zIndex: 100,
    position: 'absolute',
    top: -245,
  },
  registersecurityImg: {
    width: 50,
    height: 50,
  },
  centerWrap: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.8 - 36,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    paddingTop: 15,
  },
  downTitle: {
    paddingTop: 14,
    fontSize: 18,
    color: '#333',
  },
  itemWrap: {
    width: width * 0.8 - 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 28,
  },
  itemIcon: {
    width: 8,
    height: 8,
    backgroundColor: '#D8D8D8',
    borderRadius: 4,
  },
  itemText: {
    color: '#666666',
    fontSize: 13,
    marginLeft: 6,
    paddingTop: 7,
  },
  btnContainer: {
    backgroundColor: Config.baseColor,
    width: width / 2,
    height: 40,
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 10,
    marginVertical: 24,
  },
  btnTextStyle: {
    textAlign: 'center',
    alignSelf: 'stretch',
    fontSize: 18,
    color: '#FFF',
  },
  btnContainer2: {
    backgroundColor: '#fff',
    width: width / 2,
    height: 30,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 10,
  },
  btnTextStyle2: {
    textAlign: 'center',
    alignSelf: 'stretch',
    fontSize: 18,
    color: '#999',
  },
}

export default ModalRegisterSuccess
