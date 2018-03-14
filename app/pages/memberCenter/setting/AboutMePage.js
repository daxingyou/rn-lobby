import React, { Component } from 'react'
import {View, Image, StyleSheet, Dimensions, Text, ScrollView, Platform} from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import Config from '../../../config/global'
import updateList from '../../../../updateLog'

const windowWidth = Dimensions.get('window').width
const isIos = Platform.OS === 'ios'

export default class AboutMePage extends Component {

  render() {
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'关于我们'}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>
        <Image source={require('../../../src/img/bg_about_me.png')} style={styles.bg} >
          <View style={styles.platformName}>
            <Text style={styles.platformNameText}>{Config.platformName}</Text>
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.updateInfoText}>{updateList[updateList.length - 1].version}</Text>
            <Text style={styles.updateInfoText}>{updateList[updateList.length - 1].updateTime.split(' ')[0]}</Text>
          </View>
          <View style={styles.label}>
            <Text style={styles.labelText}>{Config.platformName}</Text>
          </View>
          <ScrollView>
            <View style={styles.content}>
              <Text style={styles.contentText}>
                是一家专注于网络彩票投注和服务的互联网,作
                为国内领先的互联网彩票公司,公司始终坚持走
                “
                <Text style={styles.highLine}>易用、安全、便捷</Text>
                ”的道路，让每个彩民享
                受到安全、快捷的购彩服务。依托网络、通信
                和数字电视技术，通过网络、电话、手机短信
                数字电视、电子杂志、电子邮件和平面媒体等
                多样化服务手段，为广大彩民提供全国各大联
                销型彩票及各地地方彩票的代购合买、彩票资
                讯、彩票分析彩票软件、彩票社区等全方位、
                一体化的综合彩票服务，深受广大彩民的欢迎。
              </Text>
            </View>
          </ScrollView>
        </Image>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  bg: {
    flex: 1,
    width: null,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  platformName: {
    marginTop: isIos ? windowWidth / 5 : windowWidth / 5 - 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformNameText: {
    fontSize: windowWidth / 8,
  },
  updateInfo: {
    marginTop: windowWidth / 8,
    marginLeft: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateInfoText: {
    fontSize: windowWidth / 25,
    color: '#fff',
    letterSpacing: 1,
  },
  label: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  labelText: {
    fontSize: 15,
    color: '#333333',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  contentText: {
    lineHeight: 25,
    fontSize: 15,
    color: '#666666',
    letterSpacing: 1,
  },
  highLine: {
    fontSize: 15,
    color: '#E81818',
    letterSpacing: 1,
  },
})
