import React, { Component } from 'react'
import {
  View, StyleSheet, TouchableOpacity,
  Animated, Text, Image,
} from 'react-native'
import BonusList from './BonusList'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { LoadingView, NoNetworkView } from '../../../components/common'
import Config from '../../../config/global'
import Sound from '../../../components/clickSound'
import BillModalView from '../../../components/modal/billModalView'

export default class BonusMainPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isNetWorkOk: true,
      lotteryList: [],
      isModalVisible: false,
      showPlayWin: false,
      currentSubPlay: {},
      fadeAnim: new Animated.Value(0),
      showLotteryId: { selectedId: 1 },
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.getLotteryList()
    }, 300)
  }

  getLotteryList = () => {
    this.setState({
      isLoading: true,
    }, () => {
      fetchWithOutStatus({ act: 10008 }).then((res) => {
        this.setState({ lotteryList: res, isLoading: false })
      }).catch(() => {
        this.setState({ isLoading: false, isNetWorkOk: false })
      })
    })
  }
  
  togglePlayWin = () => {
    this.setState({
      showPlayWin: !this.state.showPlayWin,
    })
  }

  optionsSubPlay= (data) => {
    this.setState({
      currentSubPlay: data,
      showPlayWin: false,
      showLotteryId: { selectedId: data.lottery_id },
    })
    this.triangletodown()
  }

  overlayclose = () => {
    this.setState({
      showPlayWin: false,
    })
  }

  triangletoup = () => {
    Animated.timing(
     this.state.fadeAnim,
     {
       toValue: 1,
       duration: 400,
     }
   ).start()
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

  triangle360 = () => {
    const { fadeAnim } = this.state

    if (fadeAnim._value === 0) {
     this.triangletoup()
   } else if(fadeAnim._value === 1) {
       this.triangletodown()
     } else if(fadeAnim._value === 2) {
       this.setState({fadeAnim:new Animated.Value(0)}, this.triangletoup)
     }
  }

  titleOnPress = () => {
    Sound.stop()
    Sound.play()
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    })
  }

  _renderContent = () => {
    const { token, navigation } = this.props
    const { isLoading, isNetWorkOk, showLotteryId } = this.state
    if (isLoading) {
      return <LoadingView />
    } else if (!isNetWorkOk) {
      return <NoNetworkView />
    }

    return (
      <BonusList navigation={navigation} id={showLotteryId.selectedId || 1} token={token} />
    )
  }

  render() {
    const { lotteryList, showPlayWin, currentSubPlay, fadeAnim, showLotteryId } = this.state
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.navRight}
            onPress={() => {
              Sound.stop()
              Sound.play()
              navigation.goBack()
            }}>
            <Image style={styles.iconLeft} source={require('../../../src/img/ic_back.png')} />
          </TouchableOpacity>
          <View style={styles.navCenter}>
            <Text style={styles.tipText}>彩种</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              underlayColor='transparent'
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.togglePlayWin()
                this.triangle360()
                }}>
              <View>
                <View style={styles.funTitle}>
                  <Text style={styles.funText}>{currentSubPlay.lottery_name ? currentSubPlay.lottery_name : '重庆时时彩'}</Text>
                  <Animated.Image
                    source={require('../../../src/img/menu_arrow.png')}
                    resizeMode='contain'
                    style={{width: 10, height: 6, transform: [
                      //使用interpolate插值函数,实现了从数值单位的映
                      //射转换,上面角度从0到1，这里把它变成0-360的变化
                      {rotateZ: fadeAnim.interpolate({
                        inputRange: [0,1,2],
                        outputRange: ['0deg', '180deg', '360deg'],
                      })},
                    ]}} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {
          this._renderContent()
        }
        {
          showPlayWin && (
            <BillModalView
              triangletodown={() => this.triangletodown()}
              data={lotteryList}
              isSelect={showLotteryId}
              overlayclose={() => this.overlayclose()}
              optionsSubPlay={(data) => this.optionsSubPlay(data)}/>
          )
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
  iconLeft: {
    marginLeft: 14,
    height: 18,
    width: 10,
  },
  funTitle: {
    borderWidth: 0.5,
    borderColor: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  funText: {
    color: '#fff',
    fontSize: 16,
    paddingRight: 4,
  },
  tipText: {
    fontSize: 10,
    color: '#fff',
    width: 10,
  },
  header: {
    backgroundColor: Config.baseColor,
    height: 64,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navRight: {
    height: 44,
    justifyContent: 'center',
  },
  navCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row',
  },
})
