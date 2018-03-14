import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native'

export default class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputVal: null,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.orderInfo.inputRawData === this.props.orderInfo.inputRawData) {
      return false
    }

    return true
  }

  handleChange(event) {
    let val = event.nativeEvent.text
    const { orderInfo, onInput } = this.props
    let categoryIdList = ['3', '5']
    if (categoryIdList.includes(orderInfo.categoryId)) {
      val = val.replace(/[;]/g, ',')
    } else {
      val = val.replace(/[,;]/g, ' ')
    }
    onInput(val)
  }

  render() {
    const { orderInfo, inputOnLayout } = this.props
    return (
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View style={styles.wrap}>
          <TextInput underlineColorAndroid='transparent'
            onLayout={(event) => { inputOnLayout(event.nativeEvent.target) }}
            style={styles.input}
            multiline={true}
            placeholder={'请手动输入号码'}
            placeholderTextColor={'#CCCCCC'}
            autoCorrect={true}
            keyboardType={'default'}
            onFocus={() => this.refs.textInput1.focus()}
            onChange={this.handleChange}
            value={orderInfo.inputRawData}
            ref='textInput1'/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    height: 315,
    backgroundColor: '#F6F9FC',
    borderColor: '#DADEE4',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FDFDFD",
    borderColor: '#DBDEE4',
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
    textAlignVertical: 'top',
  },
})
