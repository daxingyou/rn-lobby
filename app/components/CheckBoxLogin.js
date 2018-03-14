import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import Sound from './clickSound'
import Config from '../config/global'

const CHECK_ICON = [require('../src/img/ic_unchecked.png'), require('../src/img/ic_checked.png')]
const windowWidth = Dimensions.get('window').width

export default class CheckBox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      checked: this.props.checked,
    }
  }

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(!this.state.checked)
    }
    this.setState({ checked: !this.state.checked })
  }
  onChangeRight = () => {
    if (this.props.onPressRight) {
      this.props.onPressRight()
    }
  }

  render() {
    const checked = this.state.checked
    const label = checked ? this.props.label : this.props.uncheckedLabel || this.props.label
    const labelStyle = checked ? this.props.labelStyle : this.props.uncheckedLabelStyle || this.props.labelStyle

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => {
            Sound.stop()
            Sound.play()
            this.onChange()
          }}
          activeOpacity={this.props.activeOpacity}>
          {
            checked ? <Image source={CHECK_ICON[1]} style={styles.icon} /> : <Image source={CHECK_ICON[0]} style={styles.icon} />
          }
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </TouchableOpacity>

        <View style={{width: windowWidth - 90}}>
          <TouchableOpacity
            onPress={() => {
              Sound.stop()
              Sound.play()
              this.onChangeRight()
            }}
            activeOpacity={this.props.activeOpacity}
            underlayColor={this.props.underlayColor}>
            <Text style={{ color: Config.baseColor, fontSize: 12, textDecorationLine: 'underline' }}>{this.props.textRight}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: windowWidth > 320 ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  label: {
    fontSize: 10,
    color: '#999999',
  },
})

CheckBox.defaultProps = {
  label: '',
  uncheckedLabel: '',
  checked: false,
  underlayColor: 'white',
  activeOpacity: 0.8,
}
