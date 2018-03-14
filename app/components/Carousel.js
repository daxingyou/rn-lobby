import React, { Component } from 'react'
import {
    ScrollView,
    View,
    Dimensions,
} from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// 欢迎页面组件
export default class Carousel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      offset: 0,
    }
  }

  render() {
    const pages = []
    const { children } = this.props
    for (let i = 0; i < children.length; i++) {
      pages.push(
        <View style={{ width: screenWidth }} key={i}>
          { children[i] }
        </View>
      )
    }

    return (
      <View style={{ width: screenWidth, backgroundColor: '#FFF' }}>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={e => {
            this.setState({ offset: e.nativeEvent.contentOffset.x })
          }}
          style={{ width: screenWidth, height: screenHeight }}>
          { pages }
        </ScrollView>
      </View>
    )
  }
}
