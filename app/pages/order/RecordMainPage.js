import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import ScrollableTabBar from '../../components/github/RecordScrollableTabBar'
import RecordList from './RecordList'
import NotLoginComponent from '../pageComponents/NotLoginComponent'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import BillModalView from './../../components/modal/billModalView'

class RecordMainPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      menuList: [],
      showCategoryId: {selectedId:'all'},
      isModalVisible: false,
      showPlayWin: false,
      currentSubPlay: {},
      fadeAnim: new Animated.Value(0),
    }
  }

  componentDidMount() {
    fetchWithOutStatus({act:10008})
    .then((res)=>{
      if (res && Array.isArray(res)) {
        let filterList = []
        for (let item of res) {
          if (item && item.lottery_id && item.lottery_name) {
            let filter = {
              id: item.lottery_id,
              name : item.lottery_name,
            }
            filterList.push(filter)
          }
        }
        res.push({lottery_id:'all',lottery_name:"全部彩种",lottery_image:null})
        this.setState({
          menuList: res,
          showCategoryId: {selectedId:'all'},
          filterList,
        })
      }
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
    const { navigation, token } = this.props
    const { showCategoryId } = this.state
    let needGoBack = false
    if (navigation.state.params) {
      needGoBack = navigation.state.params
    }

    if (!token) {
      return <NotLoginComponent navigation={navigation} />
    }
    return (
      <View style={styles.tabContent}>
        <ScrollableTabView
          style={styles.tabView}
          contentProps={{ removeClippedSubviews:false }}
          tabBarBackgroundColor='#FFFFFF'
          tabBarUnderlineStyle={styles.tabBarUnderline}
          tabBarInactiveTextColor='#666666'
          tabBarActiveTextColor={Config.baseColor}
          renderTabBar={() =>
            <ScrollableTabBar
              tabStyle={styles.tabBar}
              textStyle={styles.tabText}/>}>
          <RecordList tabLabel='全部订单' navigation={navigation} type={0}
lottery_id={showCategoryId} token={token} fromLotteryNavBar={needGoBack} />
          <RecordList tabLabel='已中奖' navigation={navigation} type={1}
lottery_id={showCategoryId} token={token} fromLotteryNavBar={needGoBack} />
          <RecordList tabLabel='待开奖' navigation={navigation} type={2}
lottery_id={showCategoryId} token={token} fromLotteryNavBar={needGoBack} />
          <RecordList tabLabel='已撤单' navigation={navigation} type={3}
lottery_id={showCategoryId} token={token} fromLotteryNavBar={needGoBack} />
        </ScrollableTabView>
      </View>
    )
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
      showCategoryId: {selectedId: data.lottery_id},
    })
    this.triangletodown()
  }
  overlayclose = () => {
    this.setState({
      showPlayWin: false,
    })
  }

  render() {
    const { showPlayWin, currentSubPlay, fadeAnim, menuList, showCategoryId } = this.state
    const { navigation } = this.props
    let needGoBack = false
    if (navigation.state.params) {
      needGoBack = navigation.state.params
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {
            needGoBack ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.navRight}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  navigation.goBack()
                }}>
                <Image style={styles.iconLeft} source={require('../../src/img/ic_back.png')} />
              </TouchableOpacity>
            ) : (
              null
            )
          }
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
                  <Text style={styles.funText}>{currentSubPlay.lottery_name ? currentSubPlay.lottery_name : '全部彩种'}</Text>
                  <Animated.Image
                    source={require('../../src/img/menu_arrow.png')}
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
              triangletodown={()=>this.triangletodown()}
              data={menuList}
              isSelect={showCategoryId}
              overlayclose={()=>this.overlayclose()}
              optionsSubPlay={(data) => this.optionsSubPlay(data)}/>
          )
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  iconLeft: {
    marginLeft: 14,
    height: 18,
    width: 10,
  },
  funTitle: {
    borderWidth: 0.5,
    borderColor: '#FFF',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 115,
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
  container: {
    flex: 2,
    backgroundColor: '#F5F5F9',
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
  tabContent: {
    flex: 1,
    flexDirection: 'row',
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    paddingBottom: 0,
  },
  tabText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
  },
  tabBarUnderline: {
    backgroundColor: Config.baseColor,
    height: 3,
  },
})

const mapStateToProps = ({ userInfo }) => {
  return {
    token: userInfo.token,
  }
}

export default connect(mapStateToProps)(RecordMainPage)
