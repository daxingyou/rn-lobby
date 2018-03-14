import React from 'react'
import {
  ListView,
  Text,
  RefreshControl,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native'
import Sound from '../clickSound'
import Config from '../../config/global'


class GiftedListView extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.scroll) {
      this.refs.listView.scrollTo({x: 0, y: 0, animated: false})
      this.props.toggleScroll()
    }
  }

  _onRefresh = () => {
    if (this.props.fetchLatestData) {
      this.props.fetchLatestData(true)
    }
  }
  _loadMore = () => {
    if (this.props.fetchMoreData) {
      this.props.fetchMoreData()
    }
  }

  renderFooter = () => {
    if (this.props.notRenderFooter) {
      return null
    }
    if (this.props.refreshing) {
      return null
    }
    if (this.props.isLoadMore) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Config.baseColor} />
          <Text style={{ marginLeft: 5, marginVertical: 10, color: Config.baseColor }}>正在加载中...</Text>
        </View>
      )
    } else if (this.props.renderHasNoMoreView) {
      return this.props.renderHasNoMoreView() // 使用自定义的
    } else if (this.props.hasMoreData) {
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            Sound.stop()
            Sound.play()
            this._loadMore.bind(this)()}}>
          <Text style={{ textAlign: 'center', marginVertical: 10, color: Config.baseColor }}>点击加载更多...</Text>
        </TouchableOpacity>
      )
    }
    return null
  }

  render() {
    const { handleVisibleRows } = this.props
    return (
      <ListView
        removeClippedSubviews={false}
        {...this.props}
        enableEmptySections={true}
        renderFooter={this.renderFooter}
        OnEndReachedThreshold={20}
        ref='listView'
        onChangeVisibleRows={visibleRows => { handleVisibleRows && handleVisibleRows(visibleRows.s1) }}
        refreshControl={<RefreshControl
            refreshing={this.props.pullToRefresh}
            onRefresh={this._onRefresh}
            tintColor={Config.baseColor}
            title='刷新加载中...'
            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}/>}/>
    )
  }

}

export default GiftedListView
