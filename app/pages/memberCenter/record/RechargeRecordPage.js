import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, Platform,
    InteractionManager, TouchableOpacity, ListView } from 'react-native'
import { connect } from 'react-redux'
import ModalFliter from '../../../components/modal/ModalFliter'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import GiftedListView from '../../../components/github/GiftedListView'
import { LoadingView, NoDataView } from '../../../components/common'
import { getUserInfo } from '../../../actions'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'
import Immutable from 'immutable'
import TransactionDetails from '../../../components/transactionDetails'

const isIos = (Platform.OS === 'ios')

const RECHARGE_DATAS = [
  {
    id: '1',
    name: '在线充值',
  },
  {
    id: '2',
    name: '转账汇款',
  },
  {
    id: '3',
    name: '系统充值',
  },
]

let canLoadMore
let currentPage = 1
let loadMoreTime = 0

const STATUS = ['等待审核', '充值成功', '审核未通过']
const COLORS = ['#F40A0A', '#000', '#3986CF']

class RechargeRecordPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isPickerVisible: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
      dataList: [],
      isRefreshing: false,
      hasMore: false,
      hasData: false,
      isFirstLoading: true,
      isLoadMore: false,
      filterSelectedId: '',
      filterTypes: [],
      showDetailWin: false,
      recordDetail: {},
      pullToRefresh: false,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchRechargeRecord()
    })
    this.setState({ filterTypes: RECHARGE_DATAS })
  }

  componentWillUpdate(nextProps, nextState) {
    const { filterSelectedId } = nextState
    if (filterSelectedId !== this.state.filterSelectedId) {
      this.setState({ filterSelectedId, isRefreshing: true })
      this._fetchFilterData(filterSelectedId)
    }
  }
  getFilterCondition = (filterDatas) => { // 帅选的选中内容
    this.setState({ filterSelectedId: filterDatas.selectedId })
  }
  _fetchFilterData = (selectedIds) => {
    canLoadMore = false // 不能加载更多
    this.setState({
      isRefreshing: true,
    })
    currentPage = 1
    InteractionManager.runAfterInteractions(() => {
      this._fetchData({
        act: 10045,
        page: currentPage,
        type: selectedIds,
      }).then(result => {
        this.setState({
          dataList: result,
          hasMore: result.length === 20,
          hasData: result.length !== 0,
          isRefreshing: false,
          isFirstLoading: false,
        })
      })
    })
  }

  _onScroll = () => {
    if (!canLoadMore) {
      canLoadMore = true
    }
  }

  // 该接口传0代表加载最新的
  _fetchLatestData = (pullToRefresh) => {
    if (pullToRefresh){
      this.setState({ pullToRefresh: true })
    }
    canLoadMore = false // 不能加载更多
    this.setState({
      isRefreshing: true,
      hasMore: false,
    })
    currentPage = 1
    const { filterSelectedId } = this.state
    InteractionManager.runAfterInteractions(() => {
      this._fetchData({
        act: 10045,
        page: currentPage,
        type: filterSelectedId,
      }).then(result => {
        this.setState({
          dataList: result,
          hasMore: result.length === 20,
          hasData: result.length !== 0,
          isRefreshing: false,
          isFirstLoading: false,
          pullToRefresh: false,
        })
      })
    })
  }

  fetchRechargeRecord = () => { // 请求账户记录类型和相应记录数据
    canLoadMore = false // 不能加载更多
    const headers = { 'token': this.props.token }
    return fetchWithOutStatus({
      act: 10045,
      page: 1,
      type: '0',
    }, headers).then(result => {
      this.setState({
        dataList: result,
        hasMore: result.length === 20,
        hasData: result.length !== 0,
        isRefreshing: false,
        isFirstLoading: false,
      })
      canLoadMore = true
    })
  }

  // 加载更多
  _fetchMoreData = () => {
    const time = Date.parse(new Date()) / 1000
    if (!this.state.isRefreshing && this.state.hasMore && time - loadMoreTime > 1 && canLoadMore) {
      this.setState({ isLoadMore: true })
      canLoadMore = false
      currentPage++
      const { filterSelectedId } = this.state
      InteractionManager.runAfterInteractions(() => {
        this._fetchData({
          act: 10045,
          page: currentPage,
          type: filterSelectedId,
        }).then(result => {
          const dataList = this.state.dataList.concat(result) // concat拼接数组
          loadMoreTime = Date.parse(new Date()) / 1000
          this.setState({
            dataList,
            hasMore: result.length === 20,
            hasData: result.length !== 0,
            isLoadMore: false,
          })
        })
      })
    }
  }

  _fetchData = (body) => {
    const headers = { 'token': this.props.token }
    return fetchWithOutStatus(body, headers).then(result => {
      return result
    })
  }

  getRechargeDetail = (id) => {
    Sound.stop()
    Sound.play()
    const headers = { token: this.props.token }
    fetchWithOutStatus({
      act: 10046,
      id: id,
    }, headers).then(result => {
      let recordDetail = {
        remark: result.remark,
        amountIcon: '+',
        amount: result.recharge_amount,
        status: STATUS[result.status],
        DetailList: [
          {
            label: '交易单号',
            content: result.order_no,
          },
          {
            label: '交易时间',
            content: result.date,
          },
          {
            label: '交易方式',
            content: result.type_name,
          },
          {
            label: '充值金额',
            content: `${result.recharge_amount} 元`,
          },
          {
            label: '充值优惠',
            content: `${result.recharge_discount} 元`,
          },
        ],
      }
      this.setState({
        showDetailWin: true,
        recordDetail,
        isFirstLoading: false,
      })
    })
  }

  _renderRow = (itemData) => {
    const textColor = COLORS[itemData.status] || '#3986CF'
    const id = itemData.id
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.85}
        onPress={() => { this.getRechargeDetail(id) }}>
        <View style={styles.leftWrap}>
          <Text style={{ fontSize: 13 }}>{`${itemData.type_name} ${parseFloat(itemData.recharge_amount)}元`}</Text>
          <Text style={{ fontSize: 13, color: '#999', marginTop: 8 }}>{itemData.recharge_date}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginRight: 5, color: textColor }}>{STATUS[itemData.status] || '充值失败'}</Text>
          <Image source={require('../../../src/img/ic_arrow_right.png')} style={{ width: 6, height: 12 }} />
        </View>
      </TouchableOpacity>
    )
  }

  getDataMap = (dataList) => {
    let dataMap = {}
    for (let data of dataList) {
      let newData = Immutable.fromJS(data).toJS()
      let date = newData.recharge_date
      let section = date.substr(0, 7)
      if (!dataMap[section]) {
        dataMap[section] = []
      }
      newData.recharge_date = date.substr(5)
      dataMap[section].push(newData)
    }
    return dataMap
  }

  _renderContent = () => {
    const { dataList } = this.state
    if (this.state.isFirstLoading) {
      return <LoadingView />
    } else if (!this.state.isLoading && !this.state.isFirstLoading && this.state.dataList.length === 0) {
      return (
        <NoDataView
          text={'没有符合该条件的充值记录'}/>
      )
    }

    let dataTmp = this.getDataMap(dataList)
    const dataSource = this.state.dataSource.cloneWithRowsAndSections(dataTmp)
    return (
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
        renderSectionHeader={this._renderSectionHeader}
        pullToRefresh={this.state.pullToRefresh}/>
    )
  }

  _renderSectionHeader = (sectionData, category) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{category}</Text>
      </View>

    )
  }

  render() {
    const  { showDetailWin, recordDetail } = this.state
    return (
      <View style={styles.container}>
        <View style={[styles.toolBar, isIos ? { paddingTop: 20 } : { paddingTop: 20 }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{ width: 80 }}
            onPress={() => {
              Sound.stop()
              Sound.play()
              this.props.navigation.goBack()
            }}>
            <Image style={[styles.iconLeft]} source={require('../../../src/img/ic_back.png')} />
          </TouchableOpacity>
          <Text style={styles.title}>{'充值记录'}</Text>
          <ModalFliter
            style={{ width: 100 }}
            data={this.state.filterTypes}
            onSubmit={this.getFilterCondition}>
            <Text style={[styles.title, { fontSize: 14, width: 80, textAlign: 'right' }]}>{'筛选'}</Text>
          </ModalFliter>
        </View>
        {
          this._renderContent()
        }
        <TransactionDetails
          showDetailWin={showDetailWin}
          data={recordDetail}
          closeDetailWin={() => {this.setState({ showDetailWin: false })}}/>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  toolBar: {
    backgroundColor: Config.baseColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 58,
    paddingHorizontal: 10,
  },
  iconLeft: {
    height: 18,
    width: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  section: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    backgroundColor: '#F5F5F9',
  },
  sectionText: {
    fontSize: 14,
    color: '#333333',
  },
  leftWrap: {
    justifyContent: 'center',
  },
})

const mapStateToProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: (token, isCheckLogin) => dispatch(getUserInfo(token, isCheckLogin)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeRecordPage)
