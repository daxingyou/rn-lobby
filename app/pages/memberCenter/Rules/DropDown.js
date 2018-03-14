import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'

export default class DropDown extends Component {
  constructor(props){
    super(props)
    this.state = {
      open: false,
    }
  }

  render() {
    const { index, RULE_DETAIL, selectedType, first, second } = this.props
    const { open } = this.state

    return (
      <View style={{backgroundColor: 'white', paddingHorizontal: 10}}>

        {index !== 0 && <View style={{borderBottomWidth: 1, borderColor: '#F5F5F9'}}/>}

        <TouchableOpacity style={[styles.container, {paddingVertical: 10, justifyContent: 'space-between', height: 44}]}
          onPress={() => this.setState({ open: !open })}>
            <Text style={{marginTop: 5}}>{second}</Text>
            <View style={{alignItems: 'flex-end'}}>
              <Image style={{width: 15, height: 8, marginTop: 9 }} source={open ? require('../../../src/img/arrow_up.png') : require('../../../src/img/arrow_down.png')}/>
            </View>
        </TouchableOpacity>

        {open && <View style={{borderBottomWidth: 1, borderColor: '#F5F5F9'}}/>}

        {open && (
          <View>
            {
              RULE_DETAIL && RULE_DETAIL.map((third, index) => {
              return (
                <View key={index} style={[styles.container, {paddingTop: 10, paddingBottom: 15}]}>
                  <Text style={{lineHeight: 18}}>
                    {third !== '' && <Text style={{color: '#59A3EC', fontWeight: 'bold'}}>{third.title}: </Text>}
                    <Text style={{color: '#727272'}}>{third.content}</Text>
                  </Text>
                </View>
                )
              })
            }
          </View>
        )}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
})
