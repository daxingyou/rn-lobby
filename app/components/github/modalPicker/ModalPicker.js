import React from 'react'

import { View, Dimensions, Modal, Text, ScrollView,
    TouchableOpacity, Image } from 'react-native'
import styles from './style'
import BaseComponent from '../BaseComponent'
import Sound from '../../clickSound'

const { height } = Dimensions.get('window')

let componentIndex = 0

const defaultProps = {
    data: [],
    onChange: () => {},
    initValue: 'Select me!',
    style: {},
    selectStyle: {},
    optionStyle: {},
    optionTextStyle: {},
    sectionStyle: {},
    sectionTextStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: 'cancel',
}

export default class ModalPicker extends BaseComponent {

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
      this.setState({
        modalVisible: false,
      })
    }

    open() {
      this.setState({
        modalVisible: true,
      })
    }

    renderSection(section) {
        return (
          <View key={section.key} style={[styles.sectionStyle, this.props.sectionStyle]}>
            <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section.label}</Text>
          </View>
        )
    }

    renderOption(option) {
        return (
          <TouchableOpacity key={option.bank_id || option.id || option.key} onPress={() => {Sound.stop();Sound.play();this.onChange(option)}}>
            <View style={[styles.optionStyle, this.props.optionStyle]}>
              <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>
                {option.label || option.bank_name || option.name}
                </Text>
            </View>
          </TouchableOpacity>)
    }

    renderOptionList() {
      const options = this.props.data.map((item) => {
        if (item.section) {
            return this.renderSection(item)
        }
        return this.renderOption(item)
      })

        return (
          <TouchableOpacity
            onPress={() => {
              this.close()
            }}
            activeOpacity={1}>
            <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker' + (componentIndex++)}>



                <View style={[styles.optionContainer, this.props.listHeight ? { height: this.props.listHeight, top: height - this.props.listHeight } : {}]}>
                  <ScrollView keyboardShouldPersistTaps={true}>
                    <View style={{ paddingHorizontal: 50, paddingBottom: 30 }}>
                      {options}
                    </View>
                  </ScrollView>
                </View>
                {
                  this.props.isHead &&
                    <View style={[styles.cancelContainer, this.props.listHeight ? { bottom: this.props.listHeight } : {}]}>
                      <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                        <Text style={{ flex: 1 }} />
                        <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle, { flex: 3 }]}>
                          {this.props.cancelText}
                        </Text>
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}
                              onPress={() => {Sound.stop();Sound.play();this.close()}}>

                          <Image source={require('../../../src/img/ic_close.png')}
                                 style={[styles.closeIconStyle, this.props.closeIconStyle]} />

                        </TouchableOpacity>
                      </View>
                  </View>
                }
            </View>
          </TouchableOpacity>
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
          ref='modal'
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}>
          {this.renderOptionList()}
        </Modal>
      )

      return (
        <View style={this.props.style}>
          {dp}
          <TouchableOpacity onPress={() => {Sound.stop();Sound.play();this.open()}}>
            {this.renderChildren()}
          </TouchableOpacity>
        </View>
      )
    }
}

ModalPicker.defaultProps = defaultProps
