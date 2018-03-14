import React, {
  Component,
} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  InteractionManager,
} from 'react-native'
import Sound from '../clickSound'
// 原库链接: https://github.com/chenchunyong/react-native-passwordInput
export default class Password extends Component {

  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      InteractionManager.runAfterInteractions(() => {
        this._onPress()
      })
    }
  }

  _onPress() {
    this.textInput.focus()
  }

  _getInputItem() {
    const inputItem = []
    const { text } = this.state
    for (let i = 0; i < parseInt(this.props.maxLength); i++) {
      if (i === 0) {
        inputItem.push(
          <View key={i} style={[styles.inputItem, this.props.inputItemStyle]}>
            {i < text.length ? <View style={[styles.iconStyle, this.props.iconStyle]} /> : null}
          </View>)
      } else {
        inputItem.push(
          <View key={i} style={[styles.inputItem, styles.inputItemBorderLeftWidth, this.props.inputItemStyle]}>
            {i < text.length ?
              <View style={[styles.iconStyle, this.props.iconStyle]} /> : null}
          </View>)
      }
    }
    return inputItem
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => {Sound.stop();Sound.play();this._onPress.bind(this)()}}
        activeOpacity={1}
        underlayColor='transparent'>
        <View style={[styles.container, this.props.style]} >
          <TextInput underlineColorAndroid='transparent'
            style={{ height: 40, zIndex: 99, padding: 0, position: 'absolute', width: 40 * 6, opacity: 0 }}
            ref={(c) => { this.textInput = c }}
            maxLength={this.props.maxLength}
            autoFocus={false}
            keyboardType='numeric'
            onChangeText={(text) => {
                this.setState({ text })
                this.props.onChange(text)
                if (text.length === this.props.maxLength) {
                  setTimeout( () => {
                    this.props.onEnd(text)
                  }, 300)
                }
              }}/>
          {
            this._getInputItem()
          }
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  inputItem: {
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItemBorderLeftWidth: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  iconStyle: {
    width: 14,
    height: 14,
    backgroundColor: '#222',
    borderRadius: 7,
  },
})

Password.defaultProps = {
  autoFocus: true,
  onChange: () => {},
  onEnd: () => {},
}
