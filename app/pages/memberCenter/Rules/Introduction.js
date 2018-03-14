import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, Image, Dimensions } from 'react-native'
import { TIMIING, INTRODUCTION_ONE, INTRODUCTION_TWO } from '../../../utils/rules'

const windowWidth = Dimensions.get('window').width

export default class Introduction extends Component {
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
      <ScrollView ref='scrollView' style={{backgroundColor: 'white', padding: 15}}>

        <View style={[styles.container, {marginBottom: 10}]}>

          <Image style={{width: 12, height: 12, marginRight: 8, marginTop: 2}} source={require('../../../src/img/clock.png')}/>

          <View>

            <Text style={styles.title}>开奖时间</Text>

            {
              rules ? rules.introduce.timing.map((item, index) =>
                <View key={item.title} style={{paddingVertical: 10}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {item.title}:
                  </Text>
                  <Text style={{width: windowWidth - 50}}>
                    {item.content}
                  </Text>
                </View>
              ) : null
            }

          </View>

        </View>

        <View style={[styles.container, {marginBottom: 25}]}>

          <Image style={{width: 12, height: 15, marginRight: 8}} source={require('../../../src/img/shuo_ming.png')}/>

          <View>

            <Text style={[styles.title, {paddingBottom: 5}]}>玩法简介</Text>

            {
              rules ? rules.introduce.simpleIntro.map((intro, index) => {
                return (
                  <View key={index} style={[styles.container, {paddingVertical: 5}]}>
                    <Text style={{width: 20}}>{index + 1}.</Text>
                    <Text style={{width: windowWidth - 80}}>{intro.content}</Text>
                  </View>
                )
              }) : null
            }

            {
              rules ? (rules.introduce.simpleIntro.filter(n=>Object.keys(n).includes('children')).length>0 ? rules.introduce.simpleIntro.filter(n=>Object.keys(n).includes('children'))[0].children.map((first, index) => {
              if (first.title) {
                return (
                  <View key={index}>
                    <View style={[styles.container, {paddingVertical: 5}]}>
                      <Image style={{width: 12, height: 12, marginRight: 8, marginTop: 1}} source={require('../../../src/img/arrow_big.png')}/>
                      <Text style={{marginBottom: 5, width: windowWidth - 80}}>{`${first.title}:${first.content}`}</Text>
                    </View>
                  </View>
                  )
              } else {
                return (
                  <View key={index}>
                    <View style={[styles.container, {paddingVertical: 5}]}>
                      <Image style={{width: 12, height: 12, marginRight: 8, marginTop: 1}} source={require('../../../src/img/arrow_big.png')}/>
                      <Text style={{marginBottom: 5, width: windowWidth - 80}}>{first.content}</Text>
                    </View>
                    {
                      first.children && first.children.map((item, subIndex) => {
                        const content = item.title ? `${item.title}:${item.content}` : item.content
                        return (
                          <View key={subIndex} style={styles.container}>
                            <Image style={{width: 7, height: 7, marginLeft: 21, marginRight: 11, marginTop: 4}} source={require('../../../src/img/bullet.png')}/>
                            <Text style={{marginBottom: 5, width: windowWidth - 100}}>{content}</Text>
                          </View>
                        )}
                      )
                    }
                    {
                      first.ps && <Text>{first.ps}</Text>
                    }
                  </View>
                  )
              }

              }) : null) : null
            }
          </View>

        </View>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
  },
})
