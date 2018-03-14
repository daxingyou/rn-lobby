import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

import Immutable from 'immutable'
import CheckBox from 'react-native-checkbox'



export default class Checkbox extends Component {
  constructor(props) {
    super(props)
    this.handleCheck = this.handleCheck.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    if (this.compareProps(nextProps.orderInfo.checkbox ,this.props.orderInfo.checkbox)) {
      return false
    }

    return true
  }

  handleCheck(label, checked) {
    const { orderInfo, onCheck } = this.props
    let check = Immutable.fromJS(orderInfo.checkbox)
    if (checked) {
      check = check.push(label)
    } else {
      check = check.delete(check.indexOf(label))
    }

    let checkArr = check.toJS()
    let newCheckedArr = []
    if (checkArr.length > 0) {
      let tmpArr = ['万位', '千位', '百位', '十位', '个位']
      let indexArr = []
      for (let i = 0; i < checkArr.length; i++) {
        let item = checkArr[i]
        indexArr.push(tmpArr.indexOf(item))
      }
      indexArr.sort((a, b) => a > b)
      for (let index of indexArr) {
        newCheckedArr.push(tmpArr[index])
      }
    }

    onCheck(newCheckedArr)
  }

  compareProps(data, nextData) {
    if (data.length !== nextData.length) {
      return false
    }

    for (let i = 0; i < data.length; i++) {
      if (data[i] !== nextData[i]) {
        return false
      }
    }

    return true
  }

  render() {
    const { orderInfo, data } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {data.title + ':'}
          </Text>
        </View>
        {
          data.label.map((item, index) =>
            <View style={styles.label} key={index}>
              <CheckBox
                label={item}
                checked={orderInfo.checkbox.includes(item)}
                onChange={(checked) => {this.handleCheck(item, !checked)}}
                checkboxStyle={styles.checkbox}
                labelStyle={styles.labelStyle}
                containerStyle={styles.containerStyle}/>
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    height: 40,
    backgroundColor: '#F6F9FC',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 0.7,
    paddingLeft: 6,
  },
  titleText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: 'bold',
  },
  label: {
    flex: 1,
    top: 3,
    left: 3,
  },
  checkbox: {
    width: 14,
    height: 14,
    marginLeft: 5,
  },
  labelStyle: {
    marginLeft: -5,
    fontSize: 13,
    color: '#666666',
    fontWeight: 'bold',
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
})
