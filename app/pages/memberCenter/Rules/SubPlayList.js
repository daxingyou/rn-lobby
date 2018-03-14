import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'

import { RULE_DETAIL } from '../../../utils/rules'

import DropDown from './DropDown'

export default class SubPlayList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentType: '',
    }
  }

  componentDidMount() {
    this.setState({ currentType: this.props.selectedType })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedType !== this.state.currentType) {
      this.refs.scrollView.scrollTo({ x: 0, y: 0, animated: false })
    }
  }

  render() {
    const { selectedType, rules } = this.props

    return (
      <View style={styles.container}>
        <ScrollView ref='scrollView'>
          {
            rules.rule.map((first, index) => {
            return (
              <View key={index}>

                <Text style={{color: 'gray', paddingHorizontal: 10, paddingVertical: 8}}>{first.title}</Text>

              {
                Object.keys(first).includes('children') &&
                first.children.map((second, secondIndex) => {
                  return (
                    <DropDown
                      key={secondIndex}
                      index={secondIndex}
                      RULE_DETAIL={Object.keys(second).includes('children') ? second.children : []}
                      selectedType={selectedType}
                      first={first}
                      second={second.title}/>
                    )
                  })
                }
              </View>
              )
            })
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
