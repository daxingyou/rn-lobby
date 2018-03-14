import React from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

export function HaoMa() {
  return (
    <View style={styles.labelBg}>
      <Text allowFontScaling={false} style={styles.labelText}>号码</Text>
    </View>
  )
}

export function HaoMaPeiLv () {
  return (
    <View style={styles.label}>
      <HaoMa />
      <View style={[styles.labelBg, {marginTop: 8}]}>
        <Text allowFontScaling={false} style={styles.labelText}>赔率</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    width: 60,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  labelBg: {
    backgroundColor: '#F7EAEA',
    borderRadius: 18,
    width: 45,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  labelText: {
    backgroundColor: 'transparent',
    color: '#EC0909',
    fontSize: 12,
  },
})
