import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, ListView } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { LoadingView, NoDataView } from '../../../components/common'

export default class CheckDetailPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      dataList: [],
      isLoading: false,
    }
    this._renderListItem = this._renderListItem.bind(this)
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    const headers = { token: this.props.token }
    fetchWithOutStatus({ act: 10033 }, headers).then((res) => {
      this.setState({ dataList: res, isLoading: false })
    })
  }

  _renderListItem(item) {
    const isCanDraw = (item.check_status === 1)
    const stateText = isCanDraw ? '可提款' : '不可提款'
    return (
      <View style={styles.itemContainer}>
        <View style={styles.upWrap}>
          {
            isCanDraw ?
              <Image source={require('../../../src/img/ic_selected3.png')} style={styles.imgStyle} />
              : null
          }
          <Text style={[styles.title, isCanDraw ? { color: '#39DA68' } : { color: '#FF0000' }]}>{stateText}</Text>
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.text, { flex: 3 }]}>{'存款: '}{item.recharge_amount}{'元'}</Text>
          <Text style={[styles.text, { flex: 2 }]}>{'优惠: '}{item.discount_amount}{'元'}</Text>
        </View>
        <View style={[styles.textWrap]}>
          <Text style={[styles.text, { flex: 3 }]}>{'提款需达投注量: '}{item.need_bet_amount}{'元'}</Text>
          <Text style={[styles.text, { flex: 2 }]}>{'已达投注量: '}{item.real_bet_amount}{'元'}</Text>
        </View>
        <View style={styles.bottomWrap}>
          <Text style={{ fontSize: 12, color: '#999' }}>{'起始: '}{item.start_date}</Text>
          <Text style={{ fontSize: 12, color: '#999' }}>{'结束: '}{item.end_date}</Text>
        </View>
      </View>
    )
  }

  _renderContent() {
    if (this.state.isLoading) {
      return <LoadingView />
    }
    if (this.state.dataList.length === 0) {
      return <NoDataView />
    }
    const dataSource = this.state.dataSource.cloneWithRows(this.state.dataList)
    return (
      <ListView
        style={{flex: 1}}
        dataSource={dataSource}
        renderRow={this._renderListItem}/>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <HeaderToolBar
          title={'稽核详情'}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>
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
    flexDirection: 'column',
    backgroundColor: '#F5F5F9',
  },
  itemContainer: {
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  upWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  imgStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 15,
    marginLeft: 2,
    height: 35,
    lineHeight: 35,
    color: '#39DA68',
    paddingHorizontal: 10,
  },
  textWrap: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  text: {
    color: '#333333',
    fontSize: 14,
  },
  bottomWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
})
