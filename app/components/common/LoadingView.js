import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const LoadingView = () => (
  <View style={styles.loading}>
    <ActivityIndicator
      animating={true}
      style={[styles.centering]}
      size='large'/>
  </View>
)

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
})

export { LoadingView }
