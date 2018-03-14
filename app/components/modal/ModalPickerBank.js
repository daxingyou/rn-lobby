import React from 'react'

import { View, Modal, Text, ScrollView,
    TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native'
import styles from './pickerBankStyle'
import BaseComponent from '../github/BaseComponent'
import Sound from '../clickSound'

let componentIndex = 0

const defaultProps = {
  data: [],
  onChange: () => {},
  initValue: 'Select me!',
  style: {},
  selectStyle: {},
  optionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  optionTextStyle: {},
  cancelStyle: {},
  cancelTextStyle: {},
  overlayStyle: {},
  cancelText: 'cancel',
}

export default class ModalPickerBank extends BaseComponent {

  constructor() {
    super()
    this._bind(
      'onChange',
      'open',
      'close',
      'renderChildren'
    )

    this.state = {
      animationType: 'slide',
      modalVisible: false,
      transparent: false,
      selected: 'please select',
    }
  }

  componentDidMount() {
    this.setState({ selected: this.props.initValue })
    this.setState({ cancelText: this.props.cancelText })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue !== this.props.initValue) {
      this.setState({ selected: nextProps.initValue })
    }
  }

  onChange(item) {
    this.props.onChange(item)
    this.setState({ selected: item.label })
    this.close()
  }

  close() {
    this.setState({modalVisible: false})
  }

  open() {
    this.setState({modalVisible: true})
  }

  renderOption(option) {
    return (
      <TouchableOpacity
        key={option.bank_id || option.id || option.key}
        onPress={() => {Sound.stop();Sound.play();this.onChange(option)}}
        style={[styles.optionStyle, this.props.optionStyle]}>
        <View>
          <Image
            source={option.bank_image ? {uri:option.bank_image} : require('../../src/img/ic_default_bank.png')}
            style={{ width: 28, height: 28, resizeMode: 'contain' }} />
        </View>

        <View>
          <Text style={[styles.optionTextStyle]}>
            {option.bank_name}
          </Text>
          {
            option.bank_account &&
              <Text style={[styles.optionTipStyle, this.props.optionTipStyle]}>{option.bank_account}</Text>
          }
        </View>
        <View style={{width: 28, height: 28}} />
      </TouchableOpacity>
    )
  }

  renderOptionList() {
    const options = this.props.data.map((item) => {
      return this.renderOption(item)
    })

    return (
      <View style={[{flex: 1, backgroundColor: 'rgba(0, 0, 0, .65)'}]} key={(componentIndex++)}>
        <TouchableWithoutFeedback
          onPress={()=>{ this.close() }}>
          <View style={{flex:1}} />
        </TouchableWithoutFeedback>
        <View style={[{flex: 1.5, backgroundColor: '#fff', paddingHorizontal: 15}]}>
          <View style={[styles.cancelStyle, this.props.cancelStyle]}>
            <View style={{ flex: 1 }} />

            <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle, { flex: 3 }]}>
              {this.props.cancelText}
            </Text>

            <TouchableOpacity
              style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}
              onPress={() => {Sound.stop();Sound.play();this.close()}}>
              <Image
                source={require('../../src/img/ic_close.png')}
                style={[styles.closeIconStyle, this.props.closeIconStyle]}/>
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false} style={{flex: 1}}>
              {options}
          </ScrollView>
        </View>
      </View>
    )
  }

  renderChildren() {
    if (this.props.children) {
      return this.props.children
    }
    return (
      <View style={[styles.selectStyle, this.props.selectStyle]}>
        <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selected}</Text>
      </View>
    )
  }

  render() {
    const dp = (
      <Modal
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.state.animationType}>
        {this.renderOptionList()}
      </Modal>
    )

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={() => {
          Sound.stop();Sound.play();this.open()
        }}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    )
  }
}

ModalPickerBank.defaultProps = defaultProps
