import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  ListView,
  DeviceEventEmitter,
  InteractionManager,
} from 'react-native'
import { getLotteryList, setKeep } from '../../actions'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ScrollableTabBar from '../../components/github/ScrollableTabBar'
import { LoadingView } from '../../components/common'
import LobbyItem from './lobbyItem'
import LotteryNavBar from '../../components/lotteryNavBar'
import Config from '../../config/global'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class LobbyCenter extends Component {
  constructor(props) {
    super(props)
    this.tabView = -1
    this.page = -1
    this.state = {
      isFocus: true,
    }
  }

  componentDidMount() {
    this.props.getLotteryList()
    this.subscriptRefresh = DeviceEventEmitter.addListener('lISTENER_REFRESH_LOTTERY_LIST', () => {
      this.props.getLotteryList()
    })
  }

  componentWillReceiveProps(nextProps) {
    let isFocus = false
    if (nextProps.nav.routes[0].index == 1 && nextProps.nav.routes[0].routes[1].index == 0) {
      isFocus = true
    }
    this.setState({ isFocus })
  }

  componentWillUpdate(nextProps) {
    if (nextProps.lotteryList && nextProps.lotteryList.length > 0 && nextProps.navigation.state.params && nextProps.navigation.state.params.categoryId) {
      InteractionManager.runAfterInteractions(() => {
        for (let i = 0; i < nextProps.lotteryList.length; i++) {
          let item = nextProps.lotteryList[i]
          if (item.category_id == nextProps.navigation.state.params.categoryId) {
            this.tabView.goToPage(i)
            nextProps.navigation.setParams({categoryId: null})
            break
          }
        }
      })
    }
  }

  componentWillUnmount() {
    this.subscriptRefresh.remove()
  }

  render() {
    const { navigation, lotteryList, setKeep, sysInfo, isLogin } = this.props
    const { isFocus } = this.state
    return (
      <View style={styles.container}>
        <LotteryNavBar
          title={'购彩大厅'}
          rightText={'全部彩种'}
          rightOnPress={() => {
            navigation.navigate('LotteryList', { lotteryList })
          }}/>
        <View style={{flex: 1}}>
        {
          lotteryList && lotteryList.length > 0 ? (
            <ScrollableTabView
              ref={tabView => this.tabView = tabView}
              style={{backgroundColor: '#FFFFFF'}}
              tabBarUnderlineStyle={{backgroundColor: Config.baseColor}}
              tabBarActiveTextColor={Config.baseColor}
              renderTabBar={() => <ScrollableTabBar textStyle={{fontSize: 14, paddingTop: 8}} />}>
              {
                lotteryList.map((item, index) =>
                  <ListView
                    key={index}
                    tabLabel={item.category_name}
                    style={{backgroundColor: '#F7F7FA', flex: 1}}
                    dataSource={ds.cloneWithRows(item.lottery_info)}
                    removeClippedSubviews={false}
                    renderRow={(rowData) =>
                      <LobbyItem
                        isFocus={isFocus}
                        data={rowData}
                        categoryId={item.category_id}
                        navigation={navigation}
                        setKeep={setKeep}
                        isLogin={isLogin}
                        delay={sysInfo.delay}
                        timeDifference={sysInfo.timeDifference}/>}/>
                )
              }
            </ScrollableTabView>
          ) : <LoadingView />
        }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

const mapStateToProps = (state) => {
  const { lotteryList, sysInfo, nav } = state
  return {
    lotteryList,
    sysInfo,
    nav,
    isLogin: state.userInfo.token ? true : false,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getLotteryList: () => {
      dispatch(getLotteryList())
    },
    setKeep: (lotteryId, type, callBack) => {
      dispatch(setKeep(lotteryId, type, callBack))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyCenter)
