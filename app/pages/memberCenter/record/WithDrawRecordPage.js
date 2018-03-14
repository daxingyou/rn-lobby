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

let canLoadMore
let currentPage = 1
let loadMoreTime = 0

const STATUS = ['', '等待审核', '处理中', '成功', '审核未通过', '提现拒绝', '代付成功', '取消代付']
const COLORS = ['#000', '#F40A0A', '#F40A0A', '#000', '#3986CF']
const WITHDRAW_RECORD_DATAS = [
  {
    id: '1',
    name: '等待审核',
  },
  {
    id: '2',
    name: '处理中',
  },
  {
    id: '3',
    name: '成功',
  },
  {
    id: '4',
    name: '审核未通过',
  },
  {
    id: '5',
    name: '提现拒绝',
  },
  {
    id: '6',
    name: '代付成功',
  },
  {
    id: '7',
    name: '取消代付',
  },
]

class WithDrawRecordPage extends Component {

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
      this.fetchWithDrawRecord()
    })
    this.setState({ filterTypes: WITHDRAW_RECORD_DATAS })
  }

  componentWillUpdate(nextProps, nextState) {
    const {filterSelectedId} = nextState
    if (filterSelectedId !== this.state.filterSelectedId) {
      this.setState({ filterSelectedId, isRefreshing: true })
      this._fetchFilterData(filterSelectedId)
    }
  }
  getFilterCondition = (filterDatas) => { // 帅选的选中内容
    this.setState({filterSelectedId: filterDatas.selectedId })
  }
  _fetchFilterData = (selectedIds) => {
    canLoadMore = false // 不能加载更多
    this.setState({
      isRefreshing: true,
    })
    currentPage = 1
    InteractionManager.runAfterInteractions(() => {
      this._fetchData({
        act: 10043,
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
        act: 10043,
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

  fetchWithDrawRecord = () => { // 请求账户记录类型和相应记录数据
    canLoadMore = false // 不能加载更多
    const headers = { 'token': this.props.token }
    return fetchWithOutStatus({
      act: 10043,
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
      const { filterSelectedId} = this.state
      InteractionManager.runAfterInteractions(() => {
        this._fetchData({
          act: 10043,
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

  getWithdrawDetail = (id) => {
    Sound.stop()
    Sound.play()
    const headers = { token: this.props.token }
    fetchWithOutStatus({
      act: 10044,
      id: id,
    }, headers).then(result => {
      let recordDetail = {
        remark: result.user_remark,
        amountIcon: '-',
        amount: result.apply_amount,
        status: STATUS[result.status],
        DetailList: [
          {
            label: '实际出款金额',
            content: `${result.real_amount} 元`,
          },
          {
            label: '手续费',
            content: `${result.handling_charge} 元`,
          },
          {
            label: '账户余额',
            content: `${result.account_balance} 元`,
          },
          {
            label: '提款日期',
            content: result.apply_date,
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
        onPress={() => {this.getWithdrawDetail(id)}}>
        <View style={styles.leftWrap}>
          <Text style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>{itemData.apply_date}</Text>
          <Text style={{ fontSize: 13 }}>{`提现额${itemData.apply_amount}元`}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginRight: 5, color: textColor }}>{STATUS[itemData.status] || '充值失败'}</Text>
          <Image source={require('../../../src/img/ic_arrow_right.png')} style={{ width: 6, height: 12 }} />
        </View>
      </TouchableOpacity>
    )
  }

  _renderContent = () => {
    const {
      dataList, isFirstLoading, isLoading, hasMore, isRefreshing, isLoadMore,
      pullToRefresh, dataSource,
    } = this.state
    if (isFirstLoading) {
      return <LoadingView />
    } else if (!isLoading && !isFirstLoading && dataList.length === 0) {
      return (
        <NoDataView
          text={'没有符合该条件的提现记录'}/>
      )
    }
    let dataTmp = this.getDataMap(dataList)
    return (
      <GiftedListView
        initialListSize={1}
        pageSize={20}
        hasMoreData={hasMore}
        refreshing={isRefreshing}
        isLoadMore={isLoadMore}
        fetchLatestData={this._fetchLatestData}
        fetchMoreData={this._fetchMoreData}
        OnEndReachedThreshold={20}
        dataSource={dataSource.cloneWithRowsAndSections(dataTmp)}
        onScroll={this._onScroll}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        pullToRefresh={pullToRefresh}/>
    )
  }

  getDataMap = (dataList) => {
    let dataMap = {}
    for (let data of dataList) {
      let newData = Immutable.fromJS(data).toJS()
      let date = newData.apply_date
      let section = date.substr(0, 7)
      if (!dataMap[section]) {
        dataMap[section] = []
      }
      newData.apply_date = date.substr(5)
      dataMap[section].push(newData)
    }
    return dataMap
  }

  _renderSectionHeader = (sectionData, category) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{category}</Text>
      </View>
    )
  }

  render() {
    const  { showDetailWin, recordDetail, filterTypes } = this.state
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
          <Text style={styles.title}>{'提现记录'}</Text>
          <ModalFliter
            style={{ width: 100 }}
            data={filterTypes}
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
})

const mapStateToProps = (state) => {
  return {
    token: state.userInfo.token,
    clientServiceUrl: state.sysInfo.clientServiceUrl,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: (token, isCheckLogin) => dispatch(getUserInfo(token, isCheckLogin)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithDrawRecordPage)
