import React from 'react'
import { StyleSheet, Image, View, Text, Dimensions, TouchableOpacity } from 'react-native'
import Sound from "../../components/clickSound"

const windowWidth = Dimensions.get('window').width

const BetItem = ({ labels, odds, name, title, itemMoney, delItem, index, v, zuhe, totalMoney }) => {
  return (
    <View style={styles.itemWrap}>
      <View style={styles.betItem}>
        <Text style={styles.betItemText1}>{labels}</Text>
        <Text style={styles.betItemText2Left}>赔率：{odds}</Text>
        <Text style={styles.betItemText2Right}>
          <Text>{name} - {title}     单注{itemMoney}元</Text>
          {
            typeof totalMoney !== 'undefined' && (
              <Text>   共{zuhe}注{totalMoney}元</Text>
            )
          }
        </Text>
      </View>
      <TouchableOpacity
        style={styles.del}
        underlayColor='transparent'
        onPress={() => {
          Sound.stop()
          Sound.play()
          delItem(index, v)
        }}>
        <Image style={styles.delImg} source={require('../../src/img/ic_del_small.png')} />
      </TouchableOpacity>
      <Image style={styles.itemBottomImg} source={require('../../src/img/ic_betItems_bottomLine.png')} />
    </View>
  )
}

const styles = StyleSheet.create({
  itemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  betItem: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',

  },
  itemBottomImg: {
    width: windowWidth,
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 1,
    resizeMode: 'contain',
  },
  betItemText1: {
    fontSize: 13,
    fontWeight: '400',
    color: '#ff0000',
  },
  betItemText2Left: {
    paddingVertical: 5,
    fontSize: 13,
    fontWeight: '400',
    color: '#333',
  },
  betItemText2Right: {
    fontSize: 13,
    fontWeight: '200',
    color: '#666',
  },
  del: {
    width: 15,
    paddingRight: 25,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  delImg: {
    width: 15,
    height: 15,
  },
})

export default BetItem
