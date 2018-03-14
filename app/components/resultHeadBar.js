import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import Sound from './clickSound'
import Config from '../config/global'
import c0 from '../src/img/number/0.png'
import c1 from '../src/img/number/1.png'
import c2 from '../src/img/number/2.png'
import c3 from '../src/img/number/3.png'
import c4 from '../src/img/number/4.png'
import c5 from '../src/img/number/5.png'
import c6 from '../src/img/number/6.png'
import c7 from '../src/img/number/7.png'
import c8 from '../src/img/number/8.png'
import c9 from '../src/img/number/9.png'
const defLotteryLogo = require('../src/img/ic_def_lottery.png')
let nums = [c0,c1,c2,c3,c4,c5,c6,c7,c8,c9]
// 头部导航栏
export default class ResultHeadlBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      titlePress: false,
    }
  }

  render() {
    const headToolBar = []
    const { containerStyles, titleStyle, cd } = this.props
    // 左边菜单
    headToolBar.push(
      <TouchableOpacity
        key={'leftContent'}
        activeOpacity={0.85}
        style={styles.leftContent}
        onPress={() => {
          Sound.stop()
          Sound.play()
          this.props.leftIconAction && this.props.leftIconAction()
        }}>
        {
          (this.props.leftIcon == 'back') ?
            <Image style={[styles.iconLeft]} source={require('../src/img/ic_back.png')} /> : null
        }
        {
          (this.props.leftIcon == 'set') ?
            <Image style={[styles.iconLeft2]} source={require('../src/img/ic_set.png')} /> : null
        }
        {
          (this.props.leftIcon == 'backX') ?
            <Image style={{width: 17, height: 17, marginLeft: 14}} source={require('../src/img/ic_x.png')} /> : null
        }
        {
          (this.props.leftIcon == 'backB') ?
            <Image style={[styles.iconLeft]} source={require('../src/img/ic_backB.png')} /> : null
        }
      </TouchableOpacity>
    )

    // 中间标题
    if (this.props.title) {
      headToolBar.push(
        <View
          key={'centerContent'}
          style={styles.centerContent}>
          <Image source={this.props.lotteryImage ? {uri: this.props.lotteryImage} : defLotteryLogo} style={{ width: 53, height: 53, marginLeft:5,marginRight:10}} />
          <View style={{
            flex: 1, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center', height: 50 }}>
            <View>
              <Text key={'title'} style={[styles.title, titleStyle ]}>{this.props.title}</Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                第{this.props.issue_no}期
              </Text>
            </View>
            <View>
              <View style={styles.numWarp}>
                <Image style={styles.numImg} source={nums[cd[0]]} resizeMode='contain' />
                <Image style={styles.numImg} source={nums[cd[1]]} resizeMode='contain' />
                <Text style={{color : "red"}}>{cd[2]}</Text>
                <Image style={styles.numImg} source={nums[cd[3]]} resizeMode='contain' />
                <Image style={styles.numImg} source={nums[cd[4]]} resizeMode='contain' />
                <Text style={{color : "red"}}>{cd[5]}</Text>
                <Image style={styles.numImg} source={nums[cd[6]]} resizeMode='contain' />
                <Image style={styles.numImg} source={nums[cd[7]]} resizeMode='contain' />
              </View>
              <Text style={styles.text}>{'即将开奖......'}</Text>
            </View>

          </View>

        </View>
      )
    }
    return (
      <View style={[styles.toolBar, containerStyles]}>
        { headToolBar }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  numWarp : {
    flexDirection: 'row',
    height : 28,
    width : 90,
    marginRight:10,
  },
  numImg : {
    flex : 1,
    height: 20,
  },
  toolBar: {
    backgroundColor: Config.baseColor,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 110,
    paddingTop: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
    width : 90,
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContent: {
    flex:7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    borderBottomLeftRadius: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    height: 65,
    marginTop: 20,
  },
  title: {
    color: '#D73C3C',
    fontSize: 20,
  },
  iconLeft: {
    marginLeft: 14,
    height: 18,
    width: 10,
  },
  iconLeft2: {
    height: 20,
    marginLeft: 14,
    width: 20,
    marginTop: 20,
  },
})
