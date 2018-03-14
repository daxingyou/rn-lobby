import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated } from 'react-native'
import Sound from './clickSound'
import Config from '../config/global'

// 头部导航栏
export default class HeadToolBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      titlePress: false,
      fadeAnim: new Animated.Value(0),
    }
  }

  componentWillUpdate(nextProps) {
    if (this.props.hideWin !== nextProps.hideWin) {
      this.triangle360()
    }
  }

  triangletoup() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 400,
      }
    ).start()
  }
  triangletodown() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 2,
        duration: 400,
      }
    ).start()
  }
  triangle360() {
    if (this.state.fadeAnim._value == 0) {
      this.triangletoup()
    } else if(this.state.fadeAnim._value == 1) {
      this.triangletodown()
    } else if(this.state.fadeAnim._value == 2) {
      this.setState({fadeAnim:new Animated.Value(0)}, this.triangletoup)
    }
  }

  // 右边图标按钮
  renderRightIcon(icon, action, index) {
    return (
      <TouchableOpacity
        key={icon}
        activeOpacity={0.85}
        style={[
          styles.rightIconWrap,
          this.props.rightIcon1 && this.props.rightIcon2 && index === 1 ? {paddingRight: 5} : null,
          this.props.rightIcon1 && this.props.rightIcon2 && index === 2 ? {paddingLeft: 5} : null,
        ]}
        onPress={() => {
          Sound.stop()
          Sound.play()
          action !== null && action()
        }}>
        {
          (icon === 'ring') ? <Image style={[styles.iconRight]} source={require('../src/img/ic_ring.png')} /> : null
        }
        {
          (icon === 'menu') ? <Image style={[styles.iconRight]} source={require('../src/img/ic_menu.png')} /> : null
        }
        {
          (icon === 'search') ? <Image style={[styles.iconRight]} source={require('../src/img/ic_search.png')} /> : null
        }
        {
          (icon === 'plus') ? <Image style={[styles.iconRight]} source={require('../src/img/ic_plus.png')} /> : null
        }
        {
          (icon === 'set') ? <Image style={[styles.iconRight]} source={require('../src/img/ic_set.png')} /> : null
        }
        {
          (icon === 'text') ? <Text style={[{ fontSize: 14, color: '#FFFFFF' }, this.props.rightTextStyle]}>{this.props.rightText}</Text> : null
        }
        {
          (icon === 'filter') ? <Image style={[styles.iconRight]} source={require('../src/img/ic_filter.png')} /> : null
        }
      </TouchableOpacity>
    )
  }

  render() {
    const headToolBar = []
    const { containerStyles, titleStyle } = this.props
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
      if (this.props.titleAction) {
        headToolBar.push(
          <View
            key={'centerContent'}
            style={[styles.centerContent, {marginBottom: 9}]}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.titleWrap}
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.triangle360()
                this.props.titleAction()
              }}>
              <View>
                <Text key={'title'} style={[styles.title, titleStyle ]}>{this.props.title}</Text>
              </View>
              <Animated.Image
                source={require('../src/img/menu_arrow.png')}
                style={[styles.titleTipsIcon,{ transform: [
                  //使用interpolate插值函数,实现了从数值单位的映
                  //射转换,上面角度从0到1，这里把它变成0-360的变化
                  {rotateZ: this.state.fadeAnim.interpolate({
                    inputRange: [0,1,2],
                    outputRange: ['0deg', '180deg', '360deg'],
                  })},
                ]}]}
                resizeMode='contain'/>
            </TouchableOpacity>
          </View>
        )
      } else {
        headToolBar.push(
          <View
            key={'centerContent'}
            style={styles.centerContent}>
            <Text key={'title'} style={[styles.title, titleStyle ]}>{this.props.title}</Text>
          </View>
        )
      }
    }
    // 右边菜单
    headToolBar.push(
      <View
        key={'rightContent'}
        style={styles.rightContent}>
        {
          (this.props.rightIcon1 !== undefined) ?
            this.renderRightIcon(this.props.rightIcon1, this.props.rightIconAction1, 1) : null
        }
        {
          (this.props.rightIcon2 !== undefined) ?
            this.renderRightIcon(this.props.rightIcon2, this.props.rightIconAction2, 2) : null
        }

      </View>
    )
    // 右边图片按钮
    return (
      <View style={[styles.toolBar, containerStyles]}>
        { headToolBar }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleTipsIcon: {
    width: 10,
    height: 6,
    position: 'absolute',
    right: 4,
    top: 9.5,
  },
  titleWrap: {
    height: 27,
    width: 121,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFF',
    borderRadius: 2.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rightIconWrap: {
    paddingRight:15,
    paddingBottom:10,
    paddingTop:10,
    paddingLeft: 10,
  },
  toolBar: {
    backgroundColor: Config.baseColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: 64,
    paddingTop: 20,
  },
  leftContent: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContent: {
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  rightContent: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  iconRight: {
    height: 18,
    width: 18,
  },
})
