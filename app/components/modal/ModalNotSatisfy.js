import React from 'react'
import { View, Dimensions, Modal, Text, Image } from 'react-native'
import Button from '../ButtonIos'
import Sound from '../clickSound'
const { width } = Dimensions.get('window')
import Config from '../../config/global'

const ModalNotSatisfy = ({ visible, title, content, tip, onPressUp, onPressDown, textUp }) => {
  const { overLayContainer, centerContainer, imgStyle, titleStyle, contentStyle, tipStyle, btnContainer, btnTextStyle } = styles

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'>
      <View style={overLayContainer}>
        <View style={centerContainer}>
          <Image
            source={require('../../src/img/ic_popup.png')}
            style={imgStyle}/>
          <Text style={titleStyle}>{title}</Text>
          <Text style={contentStyle}>{content}</Text>
          <Text style={tipStyle}>{tip}</Text>
          <Button
            onPress={() => {Sound.stop();Sound.play();onPressUp()}}
            text={textUp}
            containerStyle={[btnContainer, { marginTop: 20, backgroundColor: Config.baseColor }]}
            styleTextLeft={[btnTextStyle, { color: '#FFF' }]}/>
          <Button
            onPress={() => {Sound.stop();Sound.play();onPressDown()}}
            text={'知道了'}
            containerStyle={[btnContainer, { marginVertical: 10 }]}
            styleTextLeft={[btnTextStyle, { color: Config.baseColor }]}/>
        </View>
      </View>
    </Modal>
  )
}
const styles = {
  overLayContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width / 5,
  },
  centerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    height: 40,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  titleStyle: {
    fontSize: 18,
  },
  contentStyle: {
    fontSize: 18,
    marginVertical: 5,
  },
  tipStyle: {
    fontSize: 14,
    color: '#666',
  },
  btnContainer: {
    borderColor: Config.baseColor,
    borderWidth: 1,
    width: width / 2,
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 8,
  },
  btnTextStyle: {
    textAlign: 'center',
    alignSelf: 'stretch',
    fontSize: 18,
  },

}

export default ModalNotSatisfy
