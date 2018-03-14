import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import Sound from '../../../components/clickSound'

const DATAS = [
  {
    title: '最新消息',
    tip: '欢迎新老客户打开官网(手机购彩)栏目',
    iconSrc: require('../../../src/img/ic_info.png'),
    isRed: false,
  },
  {
    title: '游戏公告',
    tip: '凡是在2016年8月16号至2016年8月27号下单的客户订单',
    iconSrc: require('../../../src/img/ic_ring.png'),
    isRed: false,
  },
  {
    title: '个人信息',
    tip: '欢迎新老客户打开官网(手机购彩)栏目',
    iconSrc: require('../../../src/img/ic_person_info.png'),
    isRed: false,
  },
]

const TYPE_ID = [3, 4, 1]

export default class InfoMainPage extends Component {
  navigatorlog = () => {
    DATAS[0].isRed = false
  }

  _onPressItem = (index) => {
    const { token } = this.props
    this.props.navigation.navigate('InfoListPage', {
      token,
      type: TYPE_ID[index],
      navigatorlog: ()=>{this.navigatorlog()},
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'信息公告'}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>
        {
          DATAS.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                style={styles.itemContainer}
                onPress={() => {Sound.stop();Sound.play();this._onPressItem.bind(this, index)()}}>
                {
                  item.isRed ? <Image
                    source={require('../../../src/img/ic_red.png')}
                    style={styles.redIcon}/> : null
                }

                <Image
                  source={item.iconSrc}
                  style={[styles.imgBg, styles.imgIcon]}/>
                <View style={{ flex: 1, justifyContent: 'space-between', marginLeft: 15, marginRight: 20 }}>
                  <Text style={{ fontSize: 17 }}>{item.title}</Text>
                </View>
                <Image
                  source={require('../../../src/img/ic_arrow_right.png')}
                  style={styles.arrow}/>
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  imgBg: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgIcon: {
    height: 30,
    resizeMode: 'contain',
  },
  redIcon: {
    position: 'absolute',
    left: 46,
    top: 15,
    width: 7,
    height: 7,
    resizeMode: 'contain',
    zIndex: 100,
  },
  arrow: {
    width: 12,
    height: 14,
    resizeMode: 'contain',
  },
})
