import React, { Component } from 'react'
import {
  View, Image, StyleSheet, Text, DeviceEventEmitter,
  InteractionManager, TouchableOpacity, ListView, Animated,
} from 'react-native'
import { connect } from 'react-redux'
import GiftedListView from '../../components/github/GiftedListView'
import { LoadingView, NoDataView } from '../../components/common'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import Sound from '../../components/clickSound'

const DATA_STATE = ['待开奖', '中奖', '未中奖', '已撤单', '结算', '派奖', '系统撤票', '人工撤票', '撤票失败']
const defLotteryLogo = require('../../src/img/ic_def_lottery.png')

let canLoadMore
let currentPage = 1
let loadMoreTime = 0
class RecordList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      dataList: [],
      isRefreshing: false,
      hasMore: false,
      hasData: false,
      isFirstLoading: true,
      isLoadMore: false,
      pullToRefresh: false,
    }
    this.scroll = false
    canLoadMore = false
  }

  componentDidMount() {
    this._fetchLatestData()
    this.subscriptRefresh = DeviceEventEmitter.addListener('lISTENER_REFRESH_ORDER_LIST', () => {
      if (!this.state.isFirstLoading && !this.state.isRefreshing && !this.state.isLoadMore) {
        this._fetchLatestData()
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nav.routes[0].index == 3 && nextProps.nav.routes[0].routes[3].index == 0) {
      this._fetchLatestData()
    }
    this.scroll = true
    if(nextProps.lottery_id !== this.props.lottery_id) {
      this.setState({
        dataList: [],
        isFirstLoading: true,
      }, () => this._fetchLatestData())
    }
  }

  componentWillUnmount() {
    this.subscriptRefresh.remove()
  }

  _onScroll = () => {
    if (!canLoadMore) {
      canLoadMore = true
    }
  }

  toggleScroll = () => {
    this.scroll = false
  }

  // 该接口传0代表加载最新的
  _fetchLatestData = (pullToRefresh) => {
    if (pullToRefresh){
      this.setState({ pullToRefresh: true })
    }
    canLoadMore = false // 不能加载更多
    this.setState({ isRefreshing: true })
    InteractionManager.runAfterInteractions(() => {
      currentPage = 1
      this._fetchData(currentPage).then(result => {
        if (pullToRefresh) {
          const oldDataList = this.state.dataList.reduce((pre, current) => {
            pre.push(current.order_id + current.status)
            return pre
          }, [])
          const newDataList = result.map(item => {
            if (oldDataList.includes(item.order_id + item.status)) {
              return item
            } else {
              return {
                ...item,
                changed: true,
                animatedValue: new Animated.Value(0),
              }
            }
          })
          this.setState({
            dataList: newDataList,
            hasMore: result.length === 20,
            hasData: result.length !== 0,
          })
          this.animatedValue = new Animated.Value(0)
        } else {
          this.setState({
            dataList: result,
            hasMore: result.length === 20,
            hasData: result.length !== 0,
          })
        }

        this.setState({
          isRefreshing: false,
          isFirstLoading: false,
          pullToRefresh: false,
        })
        currentPage++
      }).catch(() => {
        this.setState({
          isRefreshing: false,
          isLoadMore: false,
          isFirstLoading: false,
          pullToRefresh: false,
        })
      })
    })
  }

  handleVisibleRows = (rows) => {
    rows &&
    this.setState(preState => {
      const newDataList = preState.dataList.map((data, index) => {
        if (rows[index]) {
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

  // 加载更多
  _fetchMoreData = () => {
    this.setState({ isLoadMore: true })
    const time = Date.parse(new Date()) / 1000
    if (!this.state.isRefreshing && this.state.hasMore && time - loadMoreTime > 1 && canLoadMore) {
      canLoadMore = false
      InteractionManager.runAfterInteractions(() => {
        this._fetchData(currentPage).then(result => {
          const dataList = this.state.dataList.concat(result) // concat拼接数组
          let dataId = []
          for (let i = 0; i < dataList.length; i++) {
            if (dataId.includes(dataList[i].order_id)) {
              dataList.splice(i, 1)
              i--
            } else {
              dataId.push(dataList[i].order_id)
            }
          }
          loadMoreTime = Date.parse(new Date()) / 1000
          this.setState({
            dataList,
            hasMore: result.length === 20,
            hasData: result.length !== 0,
            isLoadMore: false,
          })
          if (result.length === 20) {
            currentPage++
          }
        }).catch(() => {
          this.setState({ isRefreshing: false, isLoadMore: false, isFirstLoading: false })
        })
      })
    }
  }

  _fetchData = (pageId) => {
    const { token, type, lottery_id } = this.props
    const headers = { token }
    if (lottery_id.selectedId === 'all') {
      return new Promise(function(resolve) {
        fetchWithOutStatus({
          act: 10013,
          page: pageId,
          type: type,
        }, headers).then(result => {
          resolve(result)
        })
      })
    } else {
      return fetchWithOutStatus({
        act: 10013,
        page: pageId,
        lottery_id: lottery_id.selectedId.split(',').length > 2 ? 0 : lottery_id.selectedId,
        type: type,
      }, headers).then(result => {
        return result
      })
    }
  }

  _onPressItem = (id) => {
    this.props.navigation.navigate('RecordDetailPage',
      {
        _fetchLatestData: ()=>this._fetchLatestData(),
        itemId: id,
        token: this.props.token,
        fromLotteryNavBar: this.props.fromLotteryNavBar,
      })
  }

  _renderRow = (itemData) => { // 显示的每一行row
    let status =  0
    try {
      status = itemData.status ? Number(itemData.status) : 0
    } catch (e) {
      console.warn('注单状态出错: ', e)
    }

    let statusTextColor = '#000'
    if (status === 3 || status === 4) {
      statusTextColor = '#bbb'
    }
    const unAward =(status === 3)     //是否未中奖
    const isCancel = (status === 4) // 是否撤销
    const isWait = (status === 1)     //是否待开奖
    let textStatus = '未知'
    if (status !== 0) {
      textStatus = DATA_STATE[status - 1]
    }
    const bonus = itemData.bonus ? Number(itemData.bonus) : 0
    let isWin = false // 是否中奖
    if (status === 2) { // 中奖要满足已开奖和奖金大于0
      isWin = true
      statusTextColor = 'red'
      textStatus = `中奖${bonus}元`
    }

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

    return (
      <TouchableOpacity
        activeOpacity={0.55}
        onPress={() => {
          Sound.stop()
          Sound.play()
          this._onPressItem(itemData.order_id)
        }}>
        <Animated.View style={[styles.itemContainer, itemData.changed && itemData.visible && animatedStyle]}>
          <Image style={styles.image_url} source={itemData.image_url !== '' ? {uri: itemData.image_url} : defLotteryLogo}/>
          <View style={styles.leftWrap}>
            <Text style={[styles.text1, isCancel ? { color: '#bbb' } : {}]}>{itemData.lottery_name}</Text>
            <Text style={isCancel ? { fontSize: 12, color: '#bbb' } : { fontSize: 12, color: '#999' }}>{`${itemData.issue_no}期`}</Text>
          </View>
          <View style={styles.rightWrap}>
            <View style={[styles.textWrap]}>
              {
                (isWin) ? <Image source={require('../../src/img/ic_cup.png')} style={styles.imgCup} /> :
                unAward ? <Image source={require('../../src/img/unaward.png')} style={styles.imgCup} /> :
                isCancel ? <Image source={require('../../src/img/cancled.png')} style={styles.imgCup} /> :
                isWait ? <Image source={require('../../src/img/waitaward.png')} style={styles.imgCup} /> :
                null
              }
              <Text style={[styles.text1, { color: statusTextColor, marginLeft: 5, fontWeight: 'bold',fontFamily:'PingFangSC-Semibold' }]}>{textStatus}</Text>
            </View>
            <View style={styles.textWrap} >
              <Text style={isCancel ? { fontSize: 12, color: '#bbb' } : { fontSize: 12, color: '#999' }}>{'投注'}{Number(itemData.bet_amount)}{'元'}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
  _nodataview = () => {
    Sound.stop()
    Sound.play()
    this.props.navigation.navigate('LobbyStack')
  }
  render() {
    if (this.state.isFirstLoading) {
      return <LoadingView />
    }

    const isEmpty = this.state.dataList.length === 0
    if (isEmpty && !this.state.hasData) {
      return (
        <NoDataView
          text={'暂无记录，不要让大奖溜走～'}
          btnText={'立即投注'}
          onPress={this._nodataview}/>
      )
    }
    const dataSource = this.state.dataSource.cloneWithRows(this.state.dataList)
    return (
      <View style={styles.container}>
        <GiftedListView
          initialListSize={1}
          pageSize={20}
          hasMoreData={this.state.hasMore}
          refreshing={this.state.isRefreshing}
          isLoadMore={this.state.isLoadMore}
          fetchLatestData={this._fetchLatestData}
          fetchMoreData={this._fetchMoreData}
          OnEndReachedThreshold={20}
          dataSource={dataSource}
          onScroll={this._onScroll}
          renderRow={this._renderRow}
          pullToRefresh={this.state.pullToRefresh}
          scroll={this.scroll}
          toggleScroll={this.toggleScroll}
          handleVisibleRows={this.handleVisibleRows}/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  image_url: {
    width:25,
    height:25,
    marginTop: -3,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal:15,
    backgroundColor: '#fff',
    height: 75,
    marginTop: 10,
  },
  leftWrap: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text1: {
    fontSize: 15,
  },
  rightWrap: {
    flex: 1.5,
    justifyContent: 'space-between',
  },
  imgCup: {
    width:15,
    height: 15,
    resizeMode: 'contain',
  },
})

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
  }
}

export default connect(mapStateToProps)(RecordList)
