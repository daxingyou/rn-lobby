import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  Animated,
} from 'react-native'
import Config from '../config/global'
import Sound from './clickSound'
import { goToTrend } from '../utils/navigation'
import trendImg from '../src/img/ic_menu_trend.png'
import drawHistoryImg from '../src/img/ic_menu_drawHistory.png'
import buyHistoryImg from '../src/img/ic_menu_buyHistory.png'
import playRulesImg from '../src/img/ic_menu_playRules.png'

const isIos = Platform.OS === 'ios'

export default class LotteryNavBar extends Component {
  constructor(props) {
    super(props)
    this.state= {
      menuState: false,
      fadeAnim: new Animated.Value(0),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.extendIsOpen !== nextProps.extendIsOpen) {
      this.triangle360()
    }
  }

  triangle360 = () => {
    if (this.state.fadeAnim._value === 0) {
      this.triangletoup()
    } else if(this.state.fadeAnim._value === 1) {
      this.triangletodown()
    } else if(this.state.fadeAnim._value === 2) {
      this.setState({fadeAnim:new Animated.Value(0)}, this.triangletoup)
    }
  }

  triangletoup = () => {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 400,
      }).start()
  }

  triangletodown = () => {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 2,
        duration: 400,
      }
    ).start()
  }

  _onPressGoToResultPage = () => {
    const { navigation, lotteryId, categoryId } = this.props
    navigation.navigate('LotteryListPage', {
      fromBetPage: true,
      categoryId,
      lotteryId,
      selectedTab: 'draw',
    })
  }

  _onPressGoToFormPage = () => {
   this.props.navigation.navigate('RecordMainPage', { needGoBack: true })
  }

  _onPressGoToRulesPage = () => {
   this.props.navigation.navigate('Rules', { lotteryId: this.props.lotteryId || 1 })
  }

  render() {
    const {
      lotteryId, categoryId, navigation, title, titleOnPress, backFun,
      rightText, rightIcon, rightOnPress, menu, loginStatus, rightIconStyles,
    } = this.props
    return (
      <View style={styles.nav}>
        <TouchableOpacity
          activeOpacity={0.65}
          style={styles.leftWrap}
          underlayColor='transparent'
          onPress={() => {
            Sound.stop()
            Sound.play()
            backFun ? backFun() : (navigation && navigation.goBack())
          }}>
          {
            navigation || backFun ? (
              <Image style={[styles.iconLeft]} source={require('../src/img/ic_back.png')} />
            ) : null
          }
        </TouchableOpacity>
        <View style={styles.titleWrap}>
        {
          title && (
            titleOnPress ? (
              <TouchableOpacity
                activeOpacity={0.65}
                underlayColor='transparent'
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  titleOnPress()
                  this.triangle360()
                }}
                style={styles.titleFunWrap}>
                {
                  typeof(navigation)!== "undefined" || loginStatus === true ? (
                      <Text style={styles.tipText}>玩法</Text>
                  ) : null
                }
                {
                  typeof(navigation)!== "undefined" || loginStatus === true  ? (
                    <View style={styles.funTitle}>
                      <Text style={styles.funText}>
                        {title}
                      </Text>
                      <Animated.Image
                        source={require('../src/img/menu_arrow.png')}
                        resizeMode='contain'
                        style={{width: 10, height: 6, transform: [
                          //使用interpolate插值函数,实现了从数值单位的映
                          //射转换,上面角度从0到1，这里把它变成0-360的变化
                          {rotateZ: this.state.fadeAnim.interpolate({
                            inputRange: [0,1,2],
                            outputRange: ['0deg', '180deg', '360deg'],
                          })},
                        ]}} />
                    </View>
                  ) : (
                    <Text style= {styles.titles}>趣彩彩票</Text>
                  )
                }
              </TouchableOpacity>
            ) : (
              <Text style={styles.title}>
                {title}
              </Text>
            )
          )
        }
        </View>
        <View style={styles.rightContainer}>
          {
            (rightText || rightIcon)?
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.rightWrap}
              onPress={() => {
                Sound.stop()
                Sound.play()
                rightOnPress && rightOnPress()
              }}>
              {rightText && <Text style={styles.rightText}>{rightText}</Text>}
              {rightIcon && <Image source={rightIcon} style={[{width: 24, height: 24}, rightIconStyles]}/>}
            </TouchableOpacity>
            :
            null
          }
          {
            menu?
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.rightWrap,{marginLeft: 10}]}
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.setState({
                  menuState: !this.state.menuState,
                })
              }}>
            {<Image source={require('../src/img/ic_lhc_menu.png')} style={{width: 18, height: 5, marginRight: 3}}/>}
          </TouchableOpacity>
          :
          null
          }
          {
            <Modal
              animationType={"none"}
              transparent={true}
              visible={this.state.menuState}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={()=>{ this.setState({menuState:false}) }}
                style={{flex: 1 , backgroundColor: 'rgba(0, 0, 0, 0.25)'}}>
              <View style={styles.menuWrap}>
                <Image style={styles.menuTriangle} source={require('../src/img/ic_menu_Triangle.png')}/>
                <View style={styles.menu}>
                  {
                    [
                      {
                        func: () => goToTrend(navigation, categoryId, lotteryId, true),
                        img: trendImg,
                        text: '走势图',
                      },
                      {
                        func: () => this._onPressGoToResultPage(),
                        img: drawHistoryImg,
                        text: '近期开奖',
                      },
                      {
                        func: () => this._onPressGoToFormPage(),
                        img: buyHistoryImg,
                        text: '购彩记录',
                      },
                      {
                        func: () => this._onPressGoToRulesPage(),
                        img: playRulesImg,
                        text: '玩法说明',
                      },
                    ].map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.4}
                        style={styles.menuItem}
                        onPress={() => {
                          Sound.stop()
                          Sound.play()
                          this.setState({menuState:false}, () => option.func())
                        }}>
                        <Image style={styles.menuItemImg} source={option.img}/>
                        <Text style={styles.menuItemTxt}>{option.text}</Text>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>
              </TouchableOpacity>
            </Modal>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titles: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FFF',
    left: -170,
    position: 'absolute',
    top: -15,
  },
  nav: {
    paddingTop: 20,
    height: 64,
    backgroundColor: Config.baseColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftWrap: {
    marginLeft: 10,
    height: 44,
    width: 60,
    justifyContent: 'center',
  },
  iconLeft: {
    height: 18,
    width: 12,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 13,
  },
  rightWrap: {

    alignItems: 'center',
    justifyContent: 'center',
  },
  titleFunWrap: {
    paddingLeft: 12,
  },
  funTitle: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 10,
    color: '#fff',
    width: 10,
    position: 'absolute',
    left: -0,
    top: 2,
  },
  funText: {
    color: '#fff',
    fontSize: 16,
    paddingRight: 6,
  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  rightText: {
    color: '#fff',
    fontSize: 14,
  },
  menuWrap: {
    position: 'absolute',
    right: StyleSheet.hairlineWidth,
    top: isIos?65:40,
  },
  menu: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#fff',
    right: 0,
    top: 0,
    width: 125,
    height: 170,
    borderColor: isIos? null:'#999',
    borderWidth: isIos? 0:StyleSheet.hairlineWidth,
    borderRadius: 3,
    shadowOffset: {width:-2,height:4},
    shadowColor: '#6F7279',
    shadowOpacity: 0.6,
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  menuItemImg: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
  menuItemTxt: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 14,
    fontSize: 14,
    color: '#333',
  },
  menuTriangle: {
    width: 34,
    height: 18,
    resizeMode: 'contain',
    position: 'absolute',
    top: -12,
    right: 8,
  },
})
