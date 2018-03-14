import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Config from "../../config/global"

const Note = ({ text, rate }) => (
  <View style={styles.categoryWrap}>
    <View style={[styles.category]}>
      <Text style={styles.categoryText}>
        {
          rate && (
            <Text>
              赔率:
            </Text>
          )
        }
        <Text style={rate && {color: Config.baseColor}}>
          {text}
        </Text>
      </Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  categoryWrap: {
    height: 30,
    marginTop: -10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF1F6',
    height: 25,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  categoryText: {
    paddingLeft: 10,
    marginRight: 10,
    color: '#6B839C',
    fontSize: 12,
  },
})

export default Note
