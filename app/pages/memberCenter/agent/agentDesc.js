import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, ScrollView } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import Sound from '../../../components/clickSound'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'

export default class AgentDesc extends Component {
  constructor(props){
    super(props)
    this.state = {
      image: '',
      content: '',
    }
  }

  componentWillMount() {
    this.fetchdec()
  }

  fetchdec = () => {
    fetchWithOutStatus({act:10301}, {token: this.props.navigation.state.params.token}).then(res => {
      this.setState({
        image: res.image,
        content: res.content,
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'代理说明'}
          leftIcon={'back'}
          leftIconAction={() => {
            Sound.stop()
            Sound.play()
            this.props.navigation.goBack()
          }}/>
        <ScrollView style={styles.main}>
          <View style={styles.logoWrap}>
            {this.state.image !== '' && <Image style={styles.logo} source={{uri:this.state.image}} />}
          </View>
          <View style={styles.example}>
            <Text style={styles.questionText}>{this.state.content}</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  main: {
    flex: 1,
    backgroundColor: '#D3EFFF',
  },
  logoWrap: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 329,
    height: 148,
  },
  example: {
    paddingHorizontal: 19,
    flexDirection: 'column',
    marginBottom: 25,
  },
  questionText: {
    fontWeight: '800',
    color: '#333333',
    fontSize: 14,
    letterSpacing: 1,
    lineHeight: 25,
  },
})
