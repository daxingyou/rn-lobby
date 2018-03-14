import React from 'react'
import { Text, View, Image, Dimensions } from 'react-native'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const NoNetworkView = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start',backgroundColor:'#fff' }}>
      <Image source={require('../../src/img/ic_no_network_new.png')} style={{ marginTop: windowHeight / 8, height: windowWidth * 2 / 6, resizeMode: 'contain'}} />
      <Text style={{ fontSize: 14, marginTop: 20, marginBottom: 50, color: '#666' }}>{'网络不给力，请检查网络'}</Text>
    </View>
  )
}

export { NoNetworkView }
