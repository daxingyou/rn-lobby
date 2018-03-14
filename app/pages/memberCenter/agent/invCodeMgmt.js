import React, { Component } from 'react'
import {
  View, Image, StyleSheet, Dimensions, Text, TouchableOpacity,PermissionsAndroid,
  TextInput, Alert, Modal, TouchableWithoutFeedback,Platform,
  InteractionManager, ListView, LayoutAnimation, Keyboard,UIManager,CameraRoll,Animated,
} from 'react-native'
import Immutable from 'immutable'
import Sound from '../../../components/clickSound'
import GiftedListView from '../../../components/github/GiftedListView'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { toastShort } from '../../../utils/toastUtil'
import { clearNoNum } from '../../../utils/formatUtil'
import dismissKeyboard from '../../../utils/dismissKeyboard'
const { width } = Dimensions.get('window')

const radioSelected = require('../../../src/img/ic_selected.png')
const radioUnselected = require('../../../src/img/ic_unselected.png')

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const iconArrow = require('../../../src/img/agent_arrow.png')
const isAndroid = Platform.OS !== 'ios'

export default class InvCodeMgmt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      invCodeList: [],
      showQCode: false,
      showSetting: false,
      selectedData: {},
      selectedDataNew: {},
      isUpdating: false,
      isBeingDel: false,
      isRefreshing: false,
      isLoadMore: false,
      hasMore: false,
      checkedRebateId: -1,
      isKeyboardShow: false,
      pullToRefresh: false,
      fadeAnim: new Animated.Value(0),
    }
    this.page = 1
    this.num = 20
    this.subscriptions = []
    this.selectedOriginalData = {}
    this.saveImage = this.saveImage.bind(this)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getQCodeList(1)
      this.subscriptions = [
          Keyboard.addListener('keyboardWillShow', this.keyboardWillShow),
          Keyboard.addListener('keyboardDidHide', this.keyboardDidHide),
      ]
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.refreshCode !== nextProps.refreshCode) {
      this.getQCodeList(1)
    }
  }
  componentWillUnmount () {
    this.subscriptions.forEach((sub) => sub.remove())
  }
  keyboardWillShow = () => {
    this.setState({isKeyboardShow: true})
  }
  keyboardDidHide = () => {
    this.setState({isKeyboardShow: false})
  }
  getQCodeList = (page = this.page, pullToRefresh) => {
    if (pullToRefresh){
      this.setState({ pullToRefresh: true })
    }
    if (page === 1) {
      this.setState({ isRefreshing: true })
    } else {
      this.setState({ isLoadMore: true })
    }
    InteractionManager.runAfterInteractions(() => {
      fetchWithOutStatus({
        act: 10304,
        page: page,
        num: this.num,
      }, { token: this.props.token }).then(res => {
        if (Array.isArray(res.data)) {
          let dataList = []
          if (page === 1) {
            dataList = res.data
          } else {
            dataList = this.state.invCodeList.concat(res.data)
          }
            this.setState({
            invCodeList: dataList,
            isRefreshing: false,
            isLoadMore: false,
            hasMore: res.data.length === this.num,
              pullToRefresh: false,
          }, () => {
            this.page = page + 1
          })
        }
      }).catch(err => {
        this.setState({
          isRefreshing: false,
          isLoadMore: false,
          pullToRefresh: false,
        })
        console.warn(err)
      })
    })
  }

  delQCode = (codeId) => {
    fetchWithOutStatus({
      act: 10306,
      codeId,
    }, { token: this.props.token }).then(res => {
      if (res.status === 0) {
        this.getQCodeList(1)
      }
      toastShort(res.message)
      this.setState({isBeingDel: false})
    }).catch(err => {
      this.setState({isBeingDel: false})
      console.warn(err)
    })
  }
  toggleRebateDetail = (id) => {
    Sound.stop()
    Sound.play()
    const { checkedRebateId } = this.state
    let istriangle
    if (checkedRebateId != -1 && checkedRebateId != id) {
      this.triangletoup()
      istriangle = false
    } else {
      istriangle = true
    }
    this.setState({
      checkedRebateId: checkedRebateId === id ? -1 : id,
    }, () => {
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.scaleXY,
        },
        update: {
          type: LayoutAnimation.Types.linear,
        },
      })
      if (istriangle) {
        this.triangle360(id)
      }
    })
  }

  triangletoup () {
    Animated.timing(
     this.state.fadeAnim,
     {
       toValue: 1,
       duration: 400,
     }
   ).start()
  }
  triangletodown () {
    Animated.timing(
     this.state.fadeAnim,
     {
       toValue: 2,
       duration: 400,
     }
   ).start()
  }
  triangle360 () {
    if (this.state.fadeAnim._value == 0) {
      this.triangletoup()
    } else if (this.state.fadeAnim._value == 1) {
      this.triangletodown()
    } else if (this.state.fadeAnim._value == 2) {
      this.setState({fadeAnim:new Animated.Value(0)}, this.triangletoup)
    }
  }

  renderRow = (rowData) => {
    const { isBeingDel } = this.state
    return (
      <View style={{backgroundColor: '#FFF'}}>
        <View style={[styles.row, rowData.status === 2 && styles.codeInvalid]}>
          <Text style={[styles.inviCode, styles.tableText, rowData.status == 2 && styles.codeInvalidText]}>{rowData.code}</Text>
          <Text style={[styles.type, styles.tableText]}>{rowData.type === 1 ? '代理' : '玩家'}</Text>
          <TouchableOpacity style={[styles.rebate, styles.flexCenter]}
                            onPress={() => {
                              this.toggleRebateDetail(rowData.id)
                            }}>
            <Text style={styles.colorBlue}>查看</Text>
            {
              rowData.id === this.state.checkedRebateId ?
              <Animated.Image
                style={{width: 13.7, height: 7.5, marginLeft: 5, transform: [
                  //使用interpolate插值函数,实现了从数值单位的映
                  //射转换,上面角度从0到1，这里把它变成0-360的变化
                  {rotateZ: this.state.fadeAnim.interpolate({
                    inputRange: [0,1,2],
                    outputRange: ['0deg', '180deg', '360deg'],
                  })},
                ]}}
                source={iconArrow} />
              :
              <Image
                style={{width: 13.7, height: 7.5, marginLeft: 5}}
                source={iconArrow} />
            }

          </TouchableOpacity>
          <View style={styles.operate}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.setState({
                  showQCode: true,
                  qCodeUrl: rowData.qrcode,
                })
              }}>
              <Image style={styles.operateIcon} source={require('../../../src/img/agent_qcode.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.setState({
                  showSetting: true,
                  selectedData: Immutable.fromJS(rowData).toJS(),
                  selectedDataNew: Immutable.fromJS(rowData).toJS(),
                })
                this.selectedOriginalData = Immutable.fromJS(rowData).toJS()  // 用于与修改后的rebates做比对
              }}>
              <Image style={styles.operateIcon} source={require('../../../src/img/agent_modify.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isBeingDel}
              activeOpacity={0.85}
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.setState({isBeingDel: true}, () => {
                  Alert.alert('', '确认删除？', [
                    { text: '取消', onPress: () => {this.setState({isBeingDel: false})} },
                    { text: '确认', onPress: () => {this.delQCode(rowData.id)} },
                  ], { cancelable: false })
                })
              }}>
              <Image style={styles.operateIcon} source={require('../../../src/img/agent_del.png')} />
            </TouchableOpacity>
          </View>
        </View>
        {
          rowData.id === this.state.checkedRebateId && (
            <View style={styles.rebateDropdown}>
              {
                !!rowData.rebate && rowData.rebate.map((item, index) => {
                  return (
                    <Text key={index} style={styles.rebateItem}>
                      {`${item.categoryName}返点：${item.userRebate}`}
                    </Text>
                  )
                })
              }
            </View>
          )
        }
      </View>
    )
  }

  async saveImage() {
    if (isAndroid) {
      const RNFetchBlob = require('react-native-fetch-blob').default
      const {qCodeUrl} = this.state
      let result = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: ' 权限请求 ',
          message: ' 该应用需要如下权限 ' + ' 保存图片 ' + ' 请授权! ',
        },
      )
      if (result) {
        RNFetchBlob.config({
          appendExt : 'jpeg',
          fileCache : true,
        })
          .fetch('GET', qCodeUrl)
          .then((res) => {
            CameraRoll.saveToCameraRoll(res.path()).then(() => {
              Alert.alert('图片已保存到本地')
            })
          })
      }
    } else {
      Alert.alert('图片已保存到本地')
      UIManager.takeSnapshot(this.refs.location, { format: 'png', quality: 1 })
        .then(uri => {

          CameraRoll.saveToCameraRoll(uri)
        })
    }
  }

  modelQCode = () => {
    const { showQCode, qCodeUrl } = this.state
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={showQCode}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({showQCode: false})}>
          <View style={styles.modelBg}>
            <View style={styles.qCodeWrap}>
              {qCodeUrl !== '' && <Image ref='location' style={styles.qCode} source={{uri: qCodeUrl}} />}
              <Text style={{marginTop:5,color:'#999'}}>长按可保存二维码</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onLongPress={()=>this.saveImage()}>
          <View style={{position:'absolute',left:100,top:280,width:width-200,height:260}} />
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  modelSetting = () => {
    const { userInfo } = this.props
    const { showSetting, selectedData, isUpdating, isKeyboardShow, selectedDataNew } = this.state
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={showSetting}>
        <TouchableWithoutFeedback
          style={{width:width}}
          onPress={()=> dismissKeyboard()}>
          <View style={[styles.modelBg, isKeyboardShow && {justifyContent: 'flex-start'}]}>

            <View style={[styles.settingWrap, isKeyboardShow && {marginTop: 50}]}>
            <View style={styles.settingTitle}>
              <Image style={styles.settingTitleIcon} source={require('../../../src/img/agent_modify.png')} />
              <Text style={styles.settingTitleText}>修改</Text>
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingRowLeft}>
                <Text style={[styles.settingFormText, styles.settingFormField]}>邀请码</Text>
              </View>
              <View style={styles.settingRowRight}>
                <Text style={[styles.settingFormText, { color: 'red' }]}>{selectedData.code}</Text>
              </View>
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingRowLeft}>
                <Text style={[styles.settingFormText, styles.settingFormField]}>状态</Text>
              </View>
              <View style={styles.settingRowRight}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.statusOption}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    let newData = Immutable.fromJS(selectedDataNew).toJS()
                    newData.status = 1
                    this.setState({ selectedDataNew: newData })
                  }}>
                  <Image style={styles.radioIcon} source={selectedDataNew.status == 1 ? radioSelected : radioUnselected} />
                  <Text style={styles.settingFormText}>启用</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.statusOption, {marginLeft: 25}]}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    let newData = Immutable.fromJS(selectedDataNew).toJS()
                    newData.status = 2
                    this.setState({ selectedDataNew: newData })
                  }}>
                  <Image style={styles.radioIcon} source={selectedDataNew.status == 2 ? radioSelected : radioUnselected} />
                  <Text style={styles.settingFormText}>禁用</Text>
                </TouchableOpacity>
              </View>
            </View>
            {
              !!selectedDataNew.rebate && selectedDataNew.rebate.map((item, index) => {
                let curRebate = ''
                for (let rebate of userInfo.rebate) {
                  if (rebate.categoryName == item.categoryName) {
                    curRebate = rebate.userRebate
                  }
                }
                return (
                  <View style={styles.settingRow} key={index}>
                    <View style={styles.settingRowLeft}>
                      <Text style={[styles.settingFormText, styles.settingFormField]}>{item.categoryName}返点</Text>
                    </View>
                    <View style={styles.settingRowRight}>
                      <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.input}
                        keyboardType={'numeric'}
                        maxLength={16}
                        autoCapitalize='none'
                        onBlur={() => {
                          const newData = Immutable.fromJS(selectedDataNew).toJS()
                          if (!selectedDataNew.rebate[index].userRebate) {
                            newData.rebate[index].userRebate = Number(this.selectedOriginalData.rebate[index].userRebate).toFixed(2)
                            this.setState({
                              selectedDataNew: newData,
                            })
                          }
                        }}
                        placeholder={curRebate ? `当前返点${curRebate}` : ''}
                        onChangeText={(text) => {
                          const newData = Immutable.fromJS(selectedDataNew).toJS()
                          const defaultRebate = curRebate ?  curRebate : '0'
                          const value = clearNoNum(text) > Number(defaultRebate) ? defaultRebate : clearNoNum(text)
                          newData.rebate.some((newDateItem) => {
                            if (newDateItem.categoryId === item.categoryId) {
                              newDateItem.userRebate = value
                            }
                          })
                          this.setState({ selectedDataNew: newData})
                        }}
                        value={item.userRebate} />
                    </View>
                  </View>
                )
              })
            }
            <View style={styles.funWrap}>
              <TouchableOpacity
                style={styles.settingBtn}
                activeOpacity={0.85}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.setState({showSetting: false})
                }}>
                <Text style={styles.cancleText}>取消</Text>
              </TouchableOpacity>
              <View style={styles.isolation}/>
              <TouchableOpacity
                style={styles.settingBtn}
                disabled={isUpdating}
                activeOpacity={0.85}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  const formatData = Immutable.fromJS(selectedDataNew).toJS()
                  const needConfirm = formatData.rebate.some((item, index) => {
                    return Number(item.userRebate) < Number(this.selectedOriginalData.rebate[index].userRebate)
                  })
                  const NotUpdate = Immutable.is(Immutable.fromJS(selectedData), Immutable.fromJS(selectedDataNew))
                  const statusNotUpdate = Immutable.is(Immutable.fromJS(selectedData.status), Immutable.fromJS(selectedDataNew.status))
                  if (NotUpdate) {
                    this.setState({
                      showSetting: false,
                    })
                  } else if (needConfirm) {
                    Alert.alert('', '调低返点可能会影响到下级代理的下级，请谨慎操作！', [
                      { text: '返回', onPress: () => {} },
                      { text: '确认', onPress: () => {
                        this.setState({
                          showSetting: false,
                          selectedData: formatData,
                        }, () => {
                          this.settingQCode(formatData, statusNotUpdate)
                        })
                      }},
                    ], { cancelable: true })
                  } else {
                    this.setState({
                      showSetting: false,
                      selectedData: formatData,
                    }, () => {
                      this.settingQCode(formatData, statusNotUpdate)
                    })
                  }
                }}>
                <Text style={styles.confirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
  settingQCode = (selectedData, statusNotUpdate) => {
    let body
    const newRebate = Immutable.fromJS(selectedData.rebate).toJS()
    newRebate.filter((item) => { return delete item.categoryName })
    if (statusNotUpdate) {
      body = {
        act: 10305,
        codeId: selectedData.id,
        rebate: newRebate,
      }
    } else {
      body = {
        act: 10305,
        codeId: selectedData.id,
        status: selectedData.status,
        rebate: newRebate,
      }
    }
    fetchWithOutStatus(body, { token: this.props.token }).then(res => {
      if (res.status === 0) {
        toastShort(res.message)
        let dataList = Immutable.fromJS(this.state.invCodeList).toJS()
        for (let item of dataList) {
          if (item.id === selectedData.id) {
            item.status = selectedData.status
            item.rebate = selectedData.rebate
          }
        }
        this.setState({
          isUpdating: false,
          showSetting: false,
          invCodeList: dataList,
        })
      } else {
        Alert.alert('', res.message, [
          {text: '确认', onPress: () => {
            this.setState({isUpdating: false})
          }},
        ], { cancelable: false })
      }
    }).catch(err => {
      console.warn(err)
    })
  }
  render() {
    const { invCodeList, hasMore, isRefreshing, isLoadMore } = this.state
    return (
      <View style={{flex: 1}}>
        <View style={styles.table}>
          <View style={[styles.row, styles.title]}>
            <Text style={[styles.inviCode, styles.tableText]}>邀请码</Text>
            <Text style={[styles.type, styles.tableText]}>类型</Text>
            <Text style={[styles.rebate, styles.tableText]}>返点</Text>
            <Text style={[styles.operate, styles.tableText]}>操作</Text>
          </View>
          {
            invCodeList.length > 0 && (
              <GiftedListView
                initialListSize={1}
                pageSize={this.num}
                hasMoreData={hasMore}
                refreshing={isRefreshing}
                isLoadMore={isLoadMore}
                fetchLatestData={this.getQCodeList.bind(this, 1)}
                fetchMoreData={this.getQCodeList}
                OnEndReachedThreshold={this.num}
                dataSource={ds.cloneWithRows(invCodeList)}
                renderRow={this.renderRow}
                pullToRefresh={this.state.pullToRefresh}/>
            )
          }
        </View>
        { this.modelQCode() }
        { this.modelSetting() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  table: {
    marginTop: 5,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  row: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  codeInvalid: {
    backgroundColor: '#EEEEEE',
  },
  codeInvalidText: {
    textDecorationLine: 'line-through',
  },
  inviCode: {
    flex: 1.5,
  },
  type: {
    flex: 1,
  },
  rebate: {
    flex: 1,
  },
  operate: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tableText: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#333333',
    fontSize: 14,
  },
  operateIcon: {
    width: 20,
    height: 20,
  },
  qCodeWrap: {
    width: 300,
    height: 250,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qCode: {
    width: 184,
    height: 184,
  },
  modelBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingWrap: {
    width: 300,
    height: 350,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  settingTitle: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingTitleIcon: {
    width: 17,
    height: 17,
  },
  settingTitleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#E86500',
  },
  settingRow: {
    flexDirection: 'row',
    flex: 1,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingRowLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  settingRowRight: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingFormText: {
    fontSize: 14,
    color: '#333333',
  },
  settingFormField: {
    marginLeft: 30,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioIcon: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  funWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingBtn: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancleText: {
    fontSize: 17,
    color: '#449EFC',
  },
  confirmText: {
    fontSize: 17,
    color: '#EC0909',
  },
  isolation: {
    height: 30,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#CCCCCC',
  },
  flexCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBlue: {
    color: '#449EFC',
  },
  rebateDropdown: {
    backgroundColor: '#F4F9FF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  rebateItem: {
    lineHeight: 30,
    width: (width - 20) / 2,
    color: '#64778D',
    paddingLeft: 30,
    height: 30,
  },
})
