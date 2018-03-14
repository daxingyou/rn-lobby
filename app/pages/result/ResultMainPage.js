import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  InteractionManager,
  DeviceEventEmitter,
  TouchableOpacity,
  ListView,
  Animated,
} from 'react-native'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import GiftedListView from '../../components/github/GiftedListView'
import HeaderToolBar from '../../components/HeadToolBar'
import { LoadingView, NoDataView } from '../../components/common'
import { lucky28BallWrapMatch, ballWrapMatch } from '../../utils/imgMatchUtil'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import BallStyle from '../../utils/ballStyle'
import { connect } from 'react-redux'
import { yesterday } from '../../utils'

const defLotteryLogo = require('../../src/img/ic_def_lottery.png')
const windowWidth = Dimensions.get('window').width
const today = (new Date()).toISOString().slice(0,10)
const lastDay = yesterday()

class ResultMainPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      dataList: [],
      refreshing: false,
      isFirstLoading: true,
      pullToRefresh: false,
    }
    this.matchLHC = {}
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._fetchLatestData()
    })
    this.subscriptRefresh = DeviceEventEmitter.addListener('lISTENER_REFRESH_BONUS_LIST', () => {
      if (!this.state.isFirstLoading && !this.state.refreshing) {
        InteractionManager.runAfterInteractions(() => {
          this._fetchLatestData()
        })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nav.routes[0].index === 2 && nextProps.nav.routes[0].routes[2].index === 0) {
      this._fetchLatestData()
    }
  }

  componentWillUnmount() {
    this.subscriptRefresh.remove()
  }

  _fetchLatestData = (pullToRefresh) => {
    if (pullToRefresh){
      this.setState({ pullToRefresh: true })
    }
    this.setState({ refreshing: true })
    const lhcPromise = fetchWithOutStatus({ act: 10019 }).then(result => {
      this.matchLHC = result
    })
    const bonusPromise = fetchWithOutStatus({ act: 10007 }).then(result => {
      if (pullToRefresh) {
        const newDataList = result.map((item, index) => {
          if (item.prize_time !== this.state.dataList[index].prize_time) {
            return {
              ...item,
              changed: true,
              animatedValue: new Animated.Value(0),
            }
          } else {
            return item
          }
        })
        this.setState({ dataList: newDataList })
      } else {
        this.setState({ dataList: result })
      }
    })

    Promise.all([lhcPromise, bonusPromise]).then(() => {
      this.setState({ refreshing: false, isFirstLoading: false, pullToRefresh: false })
    }).catch(() => {
      this.setState({ refreshing: false, isFirstLoading: false, pullToRefresh: false})
    })
  }

  handleVisibleRows = (rows) => {
    this.setState(preState => {
      const newDataList = preState.dataList.map((data, index) => {
        const rowIndex = !!rows ? rows[index] : null
        if (rowIndex) {
          return {
            ...data,
            visible: true,
          }
        } else {
          return {
            ...data,
            visible: false,
          }
        }
      })
      return { dataList: newDataList }
    })
  }

  handlePressItem = (lotteryId, lotteryName, lotteryImage, categoryId) => {
    this.props.navigation.navigate('LotteryListPage', { lotteryId, lotteryName, lotteryImage, categoryId })
  }
  _renderRow = (itemData) => { // 显示的每一行row
    const nums = itemData && itemData.prize_num ? itemData.prize_num.split(',') : []

    let animatedStyle
    if (itemData.changed && itemData.visible) {
      const interpolateColor = itemData.animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['#DAEFFF', 'white'],
      })
      animatedStyle = {
        backgroundColor: interpolateColor,
      }
      Animated.timing(itemData.animatedValue, {
        toValue: 100,
        duration: 1000,
      }).start()
    }
    let n = 0 //和值
    return (
      <Animated.View style={[styles.itemWrap, itemData.changed && itemData.visible && animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.itemContainer}
          onPress={() => {
            Sound.stop()
            Sound.play()
            this.handlePressItem(itemData.lottery_id, itemData.lottery_name, itemData.lottery_image, itemData.category_id)
          }}>
          <View>
            <Image source={itemData.lottery_image && itemData.lottery_image !== '' ? {uri: itemData.lottery_image} : defLotteryLogo} style={{ width: 40, height: 40, marginRight: 10 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16 }}>{itemData.lottery_name}</Text>
              <Text style={{ fontSize: 12, color: '#999' }}>
                {
                  itemData.prize_time ? (itemData.prize_time.slice(0,10) === today ? '今天 '+itemData.prize_time.slice(11,19) : (itemData.prize_time.slice(0,10) === lastDay ? '昨天 '+itemData.prize_time.slice(11,19) : itemData.prize_time.split(/\d{4}-/)[1])) : '00-00 00:00:00'
                }
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5}}>
              <Text style={{ fontSize: 12, color: '#999' }}>{'第'}{itemData.issue_no}{'期'}</Text>
              <Image source={require('../../src/img/ic_arrow_right.png')} style={styles.arrow} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={[{flexDirection: 'row'}, itemData.category_id === '2' && styles.k3Wrap]}>
                {
                  nums.map((item, index) => {
                    if (['7', '8'].includes(itemData.category_id)) {
                      if (index === 6) {
                        return (
                          <View style={{ flexDirection: 'row' }} key={index}>
                            <Text style={{ fontSize: 20, marginHorizontal: 3, marginTop: -1 }}>+</Text>
                            <View style={{ alignItems: 'center' }}>
                              <View style={[styles.ballWrap, { backgroundColor: ballWrapMatch[item] }]}>
                                <Text style={styles.ballText}>{item}</Text>
                              </View>
                              <Text style={{ fontSize: 13, marginTop: 6 }}>{this.matchLHC[item]}</Text>
                            </View>
                          </View>
                        )
                      }
                      return (
                        <View key={index} style={{ alignItems: 'center'}}>
                          <View style={[styles.ballWrap, { backgroundColor: ballWrapMatch[item] }]}>
                            <Text style={styles.ballText}>{item}</Text>
                          </View>
                          <Text style={{ fontSize: 13, marginTop: 7 }}>{this.matchLHC[item]}</Text>
                        </View>
                      )
                    }
                    if (itemData.category_id === '6'){
                      if (index === 3) {
                        return (
                          <View style={{ flexDirection: 'row' }} key={index}>
                            <Text style={{ fontSize: 20, marginHorizontal: 3, marginTop: -1 }}> = </Text>
                            <View style={{ alignItems: 'center' }}>
                              <View style={[
                                styles.ballWrap,
                                { backgroundColor: lucky28BallWrapMatch[item] },
                              ]}>
                                <Text style={styles.ballText}>{item}</Text>
                              </View>
                            </View>
                          </View>
                        )
                      }else if(index === 2){
                        return (
                          <View style={{ flexDirection: 'row' }} key={index}>
                            <View style={{ alignItems: 'center' }}>
                              <View style={[styles.ballWrap]}>
                                <Text style={styles.ballText}>{item}</Text>
                              </View>
                            </View>
                          </View>
                        )
                      }
                      return (
                        <View style={{ flexDirection: 'row' }} key={index}>
                          <View style={{ alignItems: 'center' }}>
                            <View style={[styles.ballWrap]}>
                              <Text style={styles.ballText}>{item}</Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 20, marginHorizontal: 3, marginTop: -1 }}>+</Text>
                        </View>
                      )
                    } else if(itemData.category_id === '2'){
                      return (
                        <View key={index}>
                          {
                            (()=>{
                              n += Number(item)
                              return BallStyle(item,index,'2')
                            })()
                          }
                        </View>
                      )
                    }
                    return (
                      <View style={[styles.ballWrap]} key={index}>
                        <Text style={styles.ballText}>{item}</Text>
                      </View>
                    )
                  })
                }
              </View>
              {
                itemData.category_id === '2' && (
                  <Text style={{marginLeft: 13.5, fontSize: 12, letterSpacing: 1.2, color: '#999999'}}>
                    和值:
                    <Text style={{fontSize: 14, letterSpacing: 1.2, color: '#000000'}}>{n}</Text>
                  </Text>
                )
              }
            </View>

          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  renderContent = () => {
    if (this.state.isFirstLoading) {
      return <LoadingView />
    } else if (this.state.dataList.length === 0) {
      return <NoDataView />
    }
    const dataSource = this.state.dataSource.cloneWithRows(this.state.dataList)
    return (
      <GiftedListView
        refreshing={this.state.refreshing}
        pullToRefresh={this.state.pullToRefresh}
        fetchLatestData={this._fetchLatestData}
        dataSource={dataSource}
        notRenderFooter={true}
        renderRow={this._renderRow}
        handleVisibleRows={this.handleVisibleRows}/>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'开奖结果'}/>
        {
          this.renderContent()
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemWrap: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  ballWrap: {
    width: windowWidth < 350 ? 22 : 25,
    height: windowWidth < 350 ? 22 : 25,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1.5,
    backgroundColor: Config.baseColor,
  },
  ballText: {
    fontSize: windowWidth < 350 ? 14 : 16,
    color: 'white',
    backgroundColor: 'transparent',
  },
  k3Wrap: {
    width : 126,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#38BE4F',
    paddingHorizontal: 20,
    borderRadius: 10,

  },
  arrow: {
    width: 10,
    height: 17.5,
    resizeMode:'contain',
  },
})

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
  }
}

export default connect(mapStateToProps, null)(ResultMainPage)
