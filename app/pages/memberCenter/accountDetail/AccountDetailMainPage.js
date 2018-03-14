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

const isIos = (Platform.OS === 'ios')

let canLoadMore
let currentPage = 1
let loadMoreTime = 0

class AccountDetailMainPage extends Component {

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
      filterTypes: [],
      filterSelectedId: '',
      pullToRefresh: false,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._fetchAccountTypes()
      this.props.getUserInfo(this.props.token) // 更新redux中的用户信息
    })
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
        act: 10032,
        page: currentPage,
        transaction_type_id: selectedIds,
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
    const { filterSelectedId} = this.state
    InteractionManager.runAfterInteractions(() => {
      this._fetchData({
        act: 10032,
        page: currentPage,
        transaction_type_id: filterSelectedId,
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

  _fetchAccountTypes = () => { // 请求账户记录类型和相应记录数据
    canLoadMore = false // 不能加载更多
    const headers = { token: this.props.token }
    return fetchWithOutStatus({ act: 10031 }, headers).then((accountTypes) => {
      this.setState({ filterTypes: accountTypes })
      const typeArr = accountTypes.map((item) => item.id)
      return typeArr.toString()
    }).then((types) => {
      this.setState({ filterSelectedId: types })
      return fetchWithOutStatus({
        act: 10032,
        page: 1,
        transaction_type_id: types,
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
          act: 10032,
          page: currentPage,
          transaction_type_id: filterSelectedId,
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
    const headers = { token: this.props.token }
    return fetchWithOutStatus(body, headers).then(result => {
      return result
    })
  }

  _renderRow = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.85}>
        <View style={styles.leftWrap}>
          <Text style={{ fontSize: 16, marginBottom: 7 }}>{itemData.type_name}</Text>
          <Text style={{ fontSize: 13, color: '#999'}}>{itemData.date}</Text>
        </View>
        <Text style={{ fontSize: 16 }}>{itemData.state}</Text>
        <View>
        <Text style={{ fontSize: 16, marginRight: 2, color: 'red' }}>{ `${parseFloat(itemData.amount)}`}
          <Text style={{ color: '#333' }}>元</Text>
        </Text>
        </View>

      </TouchableOpacity>
    )
  }

  _renderSectionHeader = (sectionData, category) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionText}>{category}</Text>
      </View>
    )
  }

  getDataMap = (dataList) => {
    let dataMap = {}
    for (let data of dataList) {
      let newData = Immutable.fromJS(data).toJS()
      let date = newData.date
      let section = date.substr(0, 7)
      if (!dataMap[section]) {
        dataMap[section] = []
      }
      newData.date = date.substr(5)
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
          text={'没有符合该条件的账户明细'}/>
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
        renderSeparator={this._renderSeparator}
        renderSectionHeader={this._renderSectionHeader}
        pullToRefresh={this.state.pullToRefresh}/>
    )
  }

  render() {
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
          <Text style={styles.title}>{'账户明细'}</Text>
          <ModalFliter
            data={this.state.filterTypes}
            onSubmit={this.getFilterCondition}>
            <Text style={[styles.title, { fontSize: 14, width: 80, textAlign: 'right' }]}>{'筛选'}</Text>
          </ModalFliter>
        </View>
        {
          this._renderContent()
        }
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
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    borderBottomWidth: 1,
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: (token, isCheckLogin) => dispatch(getUserInfo(token, isCheckLogin)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetailMainPage)
