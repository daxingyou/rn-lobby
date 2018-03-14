import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, ScrollView,
  TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { LoadingView,  NoNetworkView } from '../../../components/common'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'
import Immutable from 'immutable'
import { goToLottery } from '../../../utils/navigation'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height
const CHECK_ICON = [require('../../../src/img/ic_unselected.png'), require('../../../src/img/ic_selected3.png')]

export default class CollectionMainPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delState: false,
      dataList: [],
      checkedkeeping: [],
      isFirstLoading: true,
      delAllOrNot: false,
      isNetWorkOk: true,
      collectionAble: false,
    }
  }
  componentDidMount() {
    this._fetchCollectDatas()
  }
  _fetchCollectDatas() {
    const headers = { token: this.props.navigation.state.params.token }
    return fetchWithOutStatus({ act: 10012 }, headers).then(result => {
      const typeIds = result.map((item) => {
        return item.lottery_id
      })
      const maxId = parseInt(typeIds.slice(-1))
      const keeping = []
      for (let i = 0; i <= maxId; i++) {
        keeping[i] = false
      }
      this.setState({ dataList: result, isFirstLoading: false, checkedkeeping: keeping })
    }).catch(err => {
      console.warn('err=', err)
      this.setState({ dataList: [], isFirstLoading: false, isNetWorkOk: false })
    })
  }
  _onPressToggleDelState() {
    this.setState({ delState: !this.state.delState })
  }
  _onPressCheckItem(item) {
    const typeIds = []
    this.state.dataList.map((item) => {
      typeIds.push(item.lottery_id)
    })
    let checkBoolean = []
    const states = this.state.checkedkeeping
    const clickId = parseInt(item.lottery_id)
    const keeping = [...states.slice(0, clickId), !states[clickId], ...states.slice(clickId + 1)]
    this.setState({ checkedkeeping: keeping })
    for (var i = 0; i < typeIds.length; i++) {
      if(keeping[typeIds[i]]){
        checkBoolean.push(typeIds[i])
      }
    }
    if (checkBoolean.length == this.state.dataList.length) {
      this.setState({ delAllOrNot: true })
      this.setState({collectionAble:true})
    } else {
      this.setState({ delAllOrNot: false })
      this.setState({collectionAble:true})
    }
    if (checkBoolean.length == 0) {
      this.setState({collectionAble:false})
    }
  }
  _onPressToggleDelAll() {
    const keeping = []
    const typeIds = []
    this.state.dataList.map((item) => {
      typeIds.push(item.lottery_id)
    })
    if (this.state.delAllOrNot) {
      for (let i = 0; i < typeIds.length; i++) {
        keeping[typeIds[i]] = false
      }
    } else {
      for (let i = 0; i < typeIds.length; i++) {
        keeping[typeIds[i]] = true
      }
    }
    this.setState({collectionAble: !this.state.collectionAble})
    this.setState({ delAllOrNot: !this.state.delAllOrNot })
    this.setState({ checkedkeeping: keeping })
  }

  _handleDel() {
    const Ids = this.state.checkedkeeping.map((item, index) => {
      if (item) {
        return index
      }
      return 33
    })
    const selectedIds = Ids.filter((item) => item < 33)
    if (selectedIds.length === 0) {
      this.setState({
        delState: false,
      })
      return true
    }

    const headers = { token: this.props.navigation.state.params.token }
    return fetchWithOutStatus({
      act: 10011,
      lottery_id: selectedIds.toString(),
      action_type: 0,
    }, headers).then(() => {
      DeviceEventEmitter.emit('lISTENER_REFRESH_LOTTERY_LIST')
      return '删除成功'
    }).then(() => {
      return fetchWithOutStatus({ act: 10012 }, headers).then(result => {
        this.setState({
          dataList: result,
          delState: false,
        })
      })
    })
  }

  _renderContent() {
    const { dataList, delState, checkedkeeping, isFirstLoading, isNetWorkOk } = this.state
    const { navigation } = this.props
    if (isFirstLoading) {
      return <LoadingView />
    } else if (!isNetWorkOk) {
      return <NoNetworkView />
    } else if (dataList.length === 0) {
      return (
        <View>
          <Image style={styles.nodatacollection} source={require('../../../src/img/nodatacollection.png')} />
          <Text style={styles.nodatatitle}>暂时没有收藏彩种哦</Text>
          <Text style={styles.nodatatext}>可在购彩大厅选择喜爱的彩种进行收藏</Text>
          <View style={{ alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.nodatabutton}
              onPress={()=>{
                navigation.dispatch({ type: 'LOBBY_CENTER' })
              }}>
              <Text style={styles.nodatasize}>立即前往</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    let dataTmp = Immutable.fromJS(dataList).toJS()
    if (dataList.length % 3 !== 0) {
      dataTmp = dataTmp.concat(Array.from({length: 3 - dataList.length % 3}, () => {}))
    }
    return (
      <View style={{ height: delState ? windowHeight - 118 : windowHeight - 58 }}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}>
          <View style={styles.collection}>
            {
              dataTmp && dataTmp.length > 0 && dataTmp.map((item, index) => {
                if (item) {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.item, delState ? styles.selectBG : null]}
                      activeOpacity={0.85}
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        delState ? this._onPressCheckItem(item) : goToLottery(navigation, item.category_id, item.lottery_id)
                      }}>
                      {item.lottery_image_url !== '' && <Image style={styles.lotteryImg} source={{uri: item.lottery_image_url}} />}
                      <Text style={styles.lotteryName}>{item.lottery_name}</Text>
                      {
                        delState && (
                          <Image style={styles.lotterySelectImg} source={CHECK_ICON[checkedkeeping[item.lottery_id] ? 1 : 0]} />
                        )
                      }
                    </TouchableOpacity>
                  )
                } else {
                  return (
                    <View key={index} style={styles.itemMark} />
                  )
                }
              })
            }
          </View>
        </ScrollView>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <HeaderToolBar
          title={'我的收藏'}
          leftIcon={'back'}
          leftIconAction={() => {
            Sound.stop()
            Sound.play()
            this.props.navigation.goBack()
          }}
          rightIcon1={this.state.dataList.length > 0 ? 'text' : undefined}
          rightText={this.state.delState ? '取消' : '管理'}
          rightIconAction1={this._onPressToggleDelState.bind(this)}/>
        {
          this._renderContent()
        }
        <View style={[styles.bottomContainer, { opacity: this.state.delState ? 1 : 0 }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.leftWrap}
            onPress={() => {Sound.stop();Sound.play();this._onPressToggleDelAll.bind(this)()}}>
            {
              (this.state.delAllOrNot) ? <Image source={CHECK_ICON[1]} style={styles.icon} />
                : <Image source={CHECK_ICON[0]} style={styles.icon} />
            }
            <Text style={{ fontSize: 20, marginLeft: 10 }}>{'全选'}</Text>
          </TouchableOpacity>
          {
            this.state.collectionAble ?
            (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.rightWrap}
                onPress={() => {Sound.stop();Sound.play();this._handleDel.bind(this)()}}>
                <Text style={{ fontSize: 20, color: 'white' }}>取消收藏</Text>
              </TouchableOpacity>
            ) :(
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.rightWrap2}>
                <Text style={{ fontSize: 20, color: 'white' }}>取消收藏</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  nodatacollection: {
    resizeMode: 'contain',
    width: windowWidth-80,
    alignItems: 'center',
    marginHorizontal: 40,
    height: 280,
  },
  nodatatitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  nodatatext: {
    fontSize: 14,
    marginTop: 20,
    color: '#999',
    textAlign: 'center',
  },
  nodatabutton: {
    backgroundColor: Config.baseColor,
    paddingVertical: 12,
    width: 160,
    borderRadius: 5,
    marginTop: 50,
  },
  nodatasize: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: 10,
    paddingBottom: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  leftWrap: {
    width: windowWidth / 2 - 15,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D3D3D3',
    borderRadius: 4,
    borderWidth: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  rightWrap: {
    marginLeft: 10,
    width: windowWidth / 2 - 15,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    borderRadius: 4,
    borderColor: Config.baseColor,
    borderWidth: 1,
  },
  rightWrap2: {
    marginLeft: 10,
    width: windowWidth / 2 - 15,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#999',
    borderRadius: 4,
    borderColor: '#999',
    borderWidth: 1,
  },
  collection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  item: {
    width: windowWidth * 0.3,
    height: 110,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemMark: {
    width: windowWidth * 0.3,
    height: 110,
  },
  selectBG: {
    backgroundColor: '#F4F4F4',
  },
  lotteryImg: {
    width: 60,
    height: 60,
  },
  lotteryName: {
    color: '#000000',
    fontSize: 14,
    marginTop: 10,
  },
  lotterySelectImg: {
    position: 'absolute',
    right: 3,
    top: 3,
    width: 21,
    height: 21,
  },
})
