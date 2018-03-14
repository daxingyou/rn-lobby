import React from 'react'
import { View, StyleSheet, Dimensions, Image, Text } from 'react-native'
import ButtonIos from '../../components/ButtonIos'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

const windowWidth = Dimensions.get('window').width

const NotLoginComponent = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
      <Image source={require('../../src/img/img_not_login_new.png')} style={{ height: windowWidth * 2 / 6, resizeMode: 'contain', marginTop: 100, marginRight: 10 }} />
      <Text style={{ fontSize: 14, color: '#666', marginTop: 20, marginBottom: 30 }}>登录后才能看到注单哟</Text>
      <ButtonIos
        containerStyle={[styles.btnWrap, { marginBottom: 10, borderWidth: 3, marginTop: 50 }]}
        styleTextLeft={{ fontSize: 16, color: '#FFFFFF', textAlign: 'center' }}
        text={'登录／注册'}
        onPress={() => {
          Sound.stop()
          Sound.play()
          navigation.navigate('LoginPage')
        }}/>
    </View>
  )
}

const styles = StyleSheet.create({
  btnWrap: {
    width: windowWidth / 2 - 40,
    flexDirection: 'row',
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Config.baseColor,
  },
})

export default NotLoginComponent
