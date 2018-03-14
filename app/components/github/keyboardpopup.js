import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native'
import PropTypes from 'prop-types'
import Modal from 'react-native-modalbox'

const {width} = Dimensions.get('window')
const keyboardHeight = 200
const stringType = {
  number: '',
  float: '.',
  identity: 'X',
}
export default class CustomKeyboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputVal: props.defaultValue,
    }
    this.stringType = stringType[props.keyboardType]
    this.onPressKeyboard = this.onPressKeyboard.bind(this)
    this.onConfirmHandle = this.onConfirmHandle.bind(this)
    this.onBackHandle = this.onBackHandle.bind(this)
    this.onKeyboardClosed = this.onKeyboardClosed.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.state.inputVal) {
      this.setState({inputVal: nextProps.defaultValue})
    }
  }
  onKeyboardClosed() {
    this.props.onClosedHandle && this.props.onClosedHandle()
  }
  onPressKeyboard(int) {
    this.setState({
      inputVal: this.state.inputVal + String(int),
    }, () => {
      this.props.onTextChange && this.props.onTextChange(this.state.inputVal)
    })
  }
  onBackHandle() {
    const {inputVal} = this.state
    const len = inputVal.length
    if (len && len - 1 > 0) {
      this.setState({
        inputVal: inputVal.substring(0, inputVal.length - 1),
      }, () => {
        this.props.onTextChange && this.props.onTextChange(this.state.inputVal)
      })
    } else {
      this.setState({
        inputVal: '',
      }, () => {
        this.props.onTextChange && this.props.onTextChange(this.state.inputVal)
      })
    }

  }
  onConfirmHandle() {
    this.props.onButtonPress && this.props.onButtonPress(this.state.inputVal)
  }
  close() {
    return this.modal.close()
  }
  open() {
    return this.modal.open()
  }
  render() {
    const {
      buttonLabel,
      animationDuration,
      isOpen,
      backdrop,
      buttonColor,
      buttonBgColor,
    } = this.props
    const {inputVal} = this.state
    const backIcon = inputVal
      ? require('../../src/img/back.png')
      : require('../../src/img/back_disable.png')
    return (
      <Modal ref={(modal) => this.modal = modal} style={styles.wrap} isOpen={isOpen} onClosed={this.onKeyboardClosed} backdropOpacity={0} animationDuration={animationDuration} backdrop={backdrop} position='bottom'>
        <View style={styles.number}>
          {
            [[1,2,3],[4,5,6],[7,8,9]].map((row, index) => (
              <View key={index} style={styles.itemrow}>
                {
                  row.map(num => (
                    <TouchableHighlight key={num} style={styles.itemline} underlayColor={'#EFEFEF'} onPress={() => this.onPressKeyboard(num)}>
                      <Text style={styles.text}>{num}</Text>
                    </TouchableHighlight>
                  ))
                }
              </View>
            ))
          }
          <View style={styles.itemrow}>
            <TouchableHighlight style={styles.itemline} underlayColor={'#EFEFEF'} onPress={() => this.onPressKeyboard(this.stringType)}>
              <Text style={[styles.text]}>{this.stringType}</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.itemline} underlayColor={'#EFEFEF'} onPress={() => this.onPressKeyboard(0)}>
              <Text style={styles.text}>0</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.itemline} underlayColor={'#EFEFEF'} onPress={() => this.modal.close()}>
              <Image style={styles.icon} source={require('../../src/img/keyboard.png')}/>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.btnBar}>
          <TouchableHighlight style={styles.item} underlayColor={inputVal
            ? '#EFEFEF'
            : null} onPress={this.onBackHandle}>
            <Image style={styles.icon} source={backIcon}/>
          </TouchableHighlight>
          <TouchableOpacity style={[
            styles.item,
            { backgroundColor: buttonBgColor },
          ]} onPress={this.onConfirmHandle}>
            <Text style={[
              styles.confirmBtnText, {
                color: buttonColor,
              },
            ]}>{buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

CustomKeyboard.propTypes = {
  keyboardType: PropTypes.string,
  buttonLabel: PropTypes.string,
  onButtonPress: PropTypes.func,
  onTextChange: PropTypes.func,
  onClosedHandle: PropTypes.func,
  isOpen: PropTypes.bool,
  backdrop: PropTypes.bool,
  buttonBgColor: PropTypes.string,
  buttonColor: PropTypes.string,
  underlayColor: PropTypes.string,
  animationDuration: PropTypes.number,
}

CustomKeyboard.defaultProps = {
  keyboardType: 'float',
  buttonLabel: '确认',
  defaultValue: '',
  isOpen: false,
  backdrop: true,
  buttonBgColor: '#0284d8',
  buttonColor: '#FFF',
  underlayColor: '#EFEFEF',
  animationDuration: 400,
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: keyboardHeight,
    width,
  },
  number: {
    width: width/4*3,
  },
  item: {
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    width: width / 4,
    height: keyboardHeight / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemrow: {
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  itemline: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    color: '#000',
  },
  icon: {
    width: 26,
    height: 20,
  },
  btnBar: {
    width: width / 4,
    flexDirection: 'column',
  },
  confirmBtnText: {
    fontSize: 16,
  },
})
