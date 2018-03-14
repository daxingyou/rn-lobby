import React, { Component } from 'react'
import { View, Image, StyleSheet, Dimensions, Text, ListView } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { LoadingView, NoDataView, NoNetworkView } from '../../../components/common'

const windowWidth = Dimensions.get('window').width
const TITLE = {
  1: '会员公告',
  3: '最新公告',
  4: '游戏公告',
}

export default class InfoListPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      dataList: [],
      isNetWorkOk: true,
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
    }
  }

  componentDidMount() {
    const headers = { token: this.props.navigation.state.params.token }
    fetchWithOutStatus({
      act: 10104,
      type: this.props.navigation.state.params.type,
    }, headers).then((res) => {
      this.setState({ dataList: res, isLoading: false })
    }).catch(() => {
      this.setState({ isLoading: false, isNetWorkOk: false })
    })
  }

  _renderListItem = (itemData) => {
    let noticeCtt = itemData && itemData.notice_content ? itemData.notice_content.replace(/<[^>]+>/g, '') : ''
    return (
      <View style={styles.itemContainer}>
        <Image source={require('../../../src/img/message.png')} style={{width: 30, height: 30, marginTop: 10}}/>
        <Image source={require('../../../src/img/triangle_horizontal.png')} style={{width: 13, height: 13, left: 3, marginTop: 19}}/>
        <View style={styles.infoContainer}>
          <View style={styles.textWrap}>
            <Text style={{ fontSize: 16, color: 'red', fontWeight: 'bold'}}>
              {itemData.notice_title}
            </Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentText}>{noticeCtt}</Text>
          </View>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>{itemData.createtime}</Text>
          </View>
        </View>
      </View>
    )
  }

  _renderContent = () => {
    if (this.state.isLoading) {
      return <LoadingView />
    } else if (!this.state.isNetWorkOk) {
      return <NoNetworkView />
    } else if (this.state.dataList.length === 0) {
      return <NoDataView />
    }
    const dataSource = this.state.dataSource.cloneWithRows(this.state.dataList)
    return (
      <ListView
        dataSource={dataSource}
        renderRow={this._renderListItem}/>
    )
  }

  render() {
    const { navigation } = this.props
    const { type } = navigation.state.params
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={TITLE[type]}
          leftIcon={'back'}
          leftIconAction={() => navigation.goBack()}/>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Image source={require('../../../src/img/line.png')} style={{left: 29, width: 1, height: 1000}}/>
          {
            this._renderContent()
          }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  itemContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleWrap: {
    paddingVertical: 8,
    borderRadius: 2,
    paddingHorizontal: 12,
  },
  title: {
    color: 'gray',
    fontSize: 13,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    width: windowWidth - 70,
  },
  textWrap: {
    width: windowWidth - 80,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  content: {
    borderBottomWidth: 0.5,
    borderColor: '#CFCFCF',
    paddingHorizontal: 12,
  },
  contentText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 23,
    letterSpacing: 1.5,
  },
})
