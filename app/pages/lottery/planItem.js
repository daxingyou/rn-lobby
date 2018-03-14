import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import Immutable from 'immutable'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

export default class PlanItem extends Component {
  constructor(props) {
    super(props)
    this.multiple = 0
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(nextProps.data, this.props.data)
  }

  render() {
    const { data, index, orderTotalPrice, setMultiple } = this.props
    const date = data.end_time.split(' ')[0]
    const time = data.end_time.split(' ')[1]
    this.multiple = data.multiple
    return (
      <View style={index % 2 === 0 ? styles.odd : styles.even}>
        <View style={styles.issue}>
          <Text style={{fontSize: 12, color: '#000000'}}>
            {data.issue_no}
          </Text>
        </View>
        <View style={styles.multiple}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              underlayColor='transparent'
              onPress={() => {
                Sound.stop()
                Sound.play()
                if (this.multiple === 1) {
                  return false
                }
                this.multiple = parseInt(this.multiple) - 1
                setMultiple(index, this.multiple)
              }}>
              <Text style={styles.multipleFun}>
                -
              </Text>
            </TouchableOpacity>
          </View>
          <View>
          <TextInput underlineColorAndroid='transparent'
            style={styles.multipleInput}
            keyboardType={'numeric'}
            maxLength={5}
            onChangeText={(text) => {
              this.multiple = text
              setMultiple(index, text)
            }}
            value={Number(data.multiple).toString()}/>
          </View>
          <View  style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              underlayColor='transparent'
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.multiple = parseInt(this.multiple) + 1
                setMultiple(index, this.multiple)
              }}>
              <Text style={styles.multipleFun}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.amount}>
          <Text style={{fontSize: 14, color: Config.baseColor}}>
            {(data.multiple * orderTotalPrice).toFixed(2)}
          </Text>
        </View>
        <View style={styles.endTime}>
          <Text style={{fontSize: 12, color: '#000000'}}>
            {date}
          </Text>
          <Text style={{fontSize: 12, color: '#000000'}}>
            {time}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  odd: {
    height: 40,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  even: {
    height: 40,
    backgroundColor: '#F3F5F8',
    flexDirection: 'row',
  },
  issue: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiple: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  multipleFun: {
    fontSize: 20,
    marginBottom: 4,
    color: '#000000',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  multipleInput: {
    fontSize: 13,
    padding: 0,
    height: 20,
    width: 40,
    lineHeight: 18,
    textAlign: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
  amount: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endTime: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

})
