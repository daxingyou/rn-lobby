import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

export default class LabelGrid extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data, labelStyle, itemSelect, selectedItems } = this.props
    let gridData = data
    if (data.length % 3 !== 0) {
      gridData = gridData.concat(Array.from({length: 3 - data.length % 3}))
    }
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ScrollView>
          <View style={styles.grid}>
          {
            gridData && gridData.length > 0 && gridData.map((item, index) => {
              if (item) {
                let findIndex = selectedItems.findIndex(n => {
                  return n.play_id === item.play_id
                })
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.cell, findIndex !== -1 && {backgroundColor: Config.baseColor, borderWidth: 0}]}
                    underlayColor='transparent'
                    onPress={() => {Sound.stop();Sound.play();itemSelect(data[index])}}>
                    <View style={{alignItems: 'center'}}>
                      <Text style={[styles.label, labelStyle, findIndex !== -1 && {color: '#fff'}]}>{item.label}</Text>
                      <Text style={[styles.odds, findIndex !== -1 && {color: '#fff'}]}>赔率：{item.odds}</Text>
                    </View>
                </TouchableOpacity>
                )
              } else {
                return (
                  <View key={index} style={styles.placeholder} />
                )
              }

            })
          }
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 5,
  },
  cell: {
    width: 97,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CDCDCD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowOffset: {
      height: 1.5,
    },
    shadowColor: '#959595',
    shadowOpacity: 0.34,
    shadowRadius: 2,
  },
  placeholder: {
    width: 97,
    height: 60,
  },
  label: {
    fontSize: 20,
    color: '#000000',
  },
  odds: {
    fontSize: 13,
    color: '#FF0000',
    marginTop: 7,
  },
})
