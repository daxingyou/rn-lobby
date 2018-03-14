import React from 'react'
import { ActivityIndicator, Text, StyleSheet, View } from 'react-native'
import Config from '../config/global'

const LoadingView = () => (
  <View style={styles.loading}>
    <ActivityIndicator
      size='large'
      color={Config.baseColor}/>
    <Text style={styles.loadingText}>数据加载中...</Text>
  </View>
)

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
})

export default LoadingView
