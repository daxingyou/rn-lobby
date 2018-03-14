import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import { HaoMaPeiLv } from '../../components/HaoMaPeiLv'

export default class NumberGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItems: [],
    }
    this.handleItemSelect = this.handleItemSelect.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.typeId !== nextProps.typeId || nextProps.cleanBaoSan) {
      this.setState({
        selectedItems: [],
      })
    }
    if (nextProps.randomBaoSanSelect && nextProps.randomBaoSanSelect.length > 0) {
      this.setState({
        selectedItems: nextProps.randomBaoSanSelect,
      })
    }
  }

  handleItemSelect(item) {
    const { typeId, itemSelect } = this.props
    if (typeId == 40) {
      let selectedItems = this.state.selectedItems
      let index = selectedItems.findIndex((n) => {
        return n.label === item.label
      })

      if (index !== -1) {
        selectedItems.splice(index, 1)
        this.setState({
          selectedItems,
        }, () => {
          if (selectedItems.length === 2) { //remove baosan
            itemSelect({
              play_id: item.play_id,
            })
          }
        })
      } else {
        if (selectedItems.length < 3) {
          selectedItems.unshift({
            label: item.label,
            odds: item.odds,
            play_id: item.play_id,
          })
          this.setState({
            selectedItems,
          }, () => {
            if (selectedItems.length === 3) {
              let label = []
              for (let selecteditem of selectedItems) {
                label.push(selecteditem.label)
              }
              itemSelect({ //add baosan
                label: label.join(', '),
                odds: item.odds,
                play_id: item.play_id,
              })
            }
          })
        } else {
          Alert.alert('', '只能选中三个号码', [
            {text: '确定', onPress: () => {return false}},
          ])
        }
      }
    } else {
      itemSelect(item)
    }

  }

  render() {
    const { data, labelStyle, selectedItems } = this.props
    let curSelectedItems = selectedItems
    if (this.state.selectedItems.length > 0) {
      curSelectedItems = this.state.selectedItems
    }
    let gridData = data
    if (data.length % 5 !== 0) {
      gridData = gridData.concat(Array.from({length: 5 - data.length % 5}))
    }
    return (
      <View style={styles.grid}>
        <HaoMaPeiLv />
        <ScrollView>
          <View style={styles.container}>
            {
              gridData && gridData.length > 0 && gridData.map((item, index) => {
                if (item) {
                  let findIndex = curSelectedItems.findIndex(n => {
                    return n.label === item.label
                  })
                  return (
                    <View
                      key={index}
                      style={styles.cell}>
                      <TouchableOpacity
                        style={[styles.numberWrap, findIndex !== -1 && {backgroundColor: Config.baseColor, borderWidth: 0}]}
                        underlayColor='transparent'
                        onPress={() => {Sound.stop();Sound.play()
                          this.handleItemSelect(data[index])
                        }}>
                        <Text style={[styles.number, labelStyle, findIndex !== -1 && {color: '#fff'}]}>{item.label}</Text>
                      </TouchableOpacity>
                      <Text style={styles.odds}>{item.odds}</Text>
                    </View>
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

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingTop: 5,
    backgroundColor: '#FFF',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cell: {
    width: (width - 65) / 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  numberWrap: {
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CDCDCD',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      height: 2,
    },
    shadowColor: '#000000',
    shadowOpacity: 0.26,
    shadowRadius: 2,
  },
  placeholder: {
    width: (width - 65) / 5,
    height: 40,
  },
  number: {
    fontSize: 21,
    color: '#000000',
  },
  odds: {
    fontSize: 11,
    color: '#FF0000',
    marginTop: 3,
    backgroundColor: 'transparent',
  },
})
