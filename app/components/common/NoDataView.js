import React from 'react'
import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native'
import Sound from '../clickSound'
import Config from '../../config/global'

const windowWidth = Dimensions.get('window').width

const NoDataView = ({ text, tip, btnText, onPress }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#fff', paddingTop: windowWidth / 6}}>
      <Image source={require('../../src/img/img_cry_new.png')} style={{ height: windowWidth * 2 / 6, resizeMode: 'contain', marginRight: 10 }} />
      <Text style={{ fontSize: 14, marginTop: 30, color: '#666', fontWeight: '600' }}>{text || '暂无数据!' }</Text>
      <Text style={{ fontSize: 14, marginTop: 30, color: '#999' }}>{tip || '' }</Text>
      {
        onPress && (
          <TouchableOpacity
            onPress={() => {
              Sound.stop()
              Sound.play()
              onPress()
            }}
            style={{ width: windowWidth / 2 - 40, backgroundColor: Config.baseColor, alignItems: 'center', paddingVertical: 8, borderRadius: 5, marginTop: 40 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>{btnText}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  )
}

const NoDataViewText = ({ text, tip, btnText, onPress }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#fff', paddingTop: windowWidth / 6 }}>
      <Image source={require('../../src/img/NoDataViewtext.png')} style={{ height: windowWidth * 2 / 6, resizeMode: 'contain', marginRight: 10 }} />
      <Text style={{ fontSize: 14, marginTop: 30, color: '#666', fontWeight: '600' }}>{text || '暂无数据!' }</Text>
      <Text style={{ fontSize: 14, marginTop: 30, color: '#999' }}>{tip || '' }</Text>
      {
        onPress && (
          <TouchableOpacity
            onPress={() => {
              Sound.stop()
              Sound.play()
              onPress()
            }}
            style={{ width: windowWidth / 2 - 40, backgroundColor: Config.baseColor, alignItems: 'center', paddingVertical: 8, borderRadius: 5, marginTop: 40 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>{btnText}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  )
}

export { NoDataView, NoDataViewText }
