import React, { Component } from 'react'
import {
  View, Image, StyleSheet, Dimensions, Text, TouchableOpacity,
  TextInput, Alert, Platform, TouchableWithoutFeedback,
  UIManager, Modal, InteractionManager, ListView, Keyboard,
} from 'react-native'
import Immutable from 'immutable'
import HeaderToolBar from '../../../components/HeadToolBar'
import Sound from '../../../components/clickSound'
import { LoadingView } from '../../../components/common'
import GiftedListView from '../../../components/github/GiftedListView'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { toastShort } from '../../../utils/toastUtil'
import Config from '../../../config/global'
import { formatDay, clearNoNum } from '../../../utils/formatUtil'
import { yesterday, replaceWithDot } from '../../../utils'
import dismissKeyboard from '../../../utils/dismissKeyboard'
const { width } = Dimensions.get('window')
const radioSelected = require('../../../src/img/ic_selected.png')
const radioUnselected = require('../../../src/img/ic_unselected.png')

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

const iconArrow = require('../../../src/img/agent_arrow.png')
const iconEye = require('../../../src/img/agent_eye.png')
const iconsubAcc = require('../../../src/img/agent_detail_sub_account.png')


const yesteday = new Date().setTime( new Date().getTime() - 24*60*60*1000)
export default class TeamMgmt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      startDate: '2016-01-01',
      endDate: formatDay(new Date(yesteday)),
      userLevel: [],
      dataList: -1,
      detailIndex: -1,
      userBalance: {},
      showSetting: false,
      selectedData: {},
      isUpdating: false,
      isRefreshing: false,
      isLoadMore: false,
      hasMore: false,
      isKeyboardShow: false,
      pullToRefresh: false,
    }
    this.selectedOriginalData = {}
    this.page = 1
    this.num = 20

    if (Platform.OS !== 'ios') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getDataList(this.props.navigation.state.params.userInfo.user_name)
      this.subscriptions = [
          Keyboard.addListener('keyboardWillShow', this.keyboardWillShow),
          Keyboard.addListener('keyboardDidHide', this.keyboardDidHide),
      ]
    })

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
  getUserBalance = (userId) => {
    fetchWithOutStatus({
      act: 10308,
      subUserId: userId,
    }, { token: this.props.navigation.state.params.userInfo.token }).then(res => {
      if (res.status === 0) {
        let userBalance = this.state.userBalance
        userBalance[userId] = res.data.balance
        this.setState({userBalance})
      } else {
        toastShort(res.message)
      }
    }).catch(err => {
      console.warn(err)
    })
  }
  formatData = (data) => {
    const arr = data.split('-')
    arr.forEach((item, index) => {
      if (item.length < 2) {
        arr[index]= '0' + item
      }
    })
    return arr.join('')
  }
  getDataList = (userName, page = this.page, pullToRefresh) => {
    if (pullToRefresh){
      this.setState({ pullToRefresh: true })
    }
    if (page === 1) {
      this.setState({ isRefreshing: true, detailIndex: -1 })
    } else {
      this.setState({ isLoadMore: true, detailIndex: -1 })
    }
    const { startDate, endDate } = Immutable.fromJS(this.state).toJS()
    fetchWithOutStatus({
      act: 10307,
      userName,
      startDate: this.formatData(startDate),
      endDate: this.formatData(endDate),
      page: page,
      num: this.num,
    }, { token: this.props.navigation.state.params.userInfo.token }).then(res => {
      if (res.status === 0 && Array.isArray(res.data)) {
        let dataList = []
        if (page === 1) {
          dataList = res.data
        } else {
          dataList = this.state.dataList.concat(res.data)
        }
        this.setState({
          dataList,
          userLevel: res.userLevel,
          isRefreshing: false,
          isLoadMore: false,
          hasMore: res.data.length === this.num,
          pullToRefresh: false,
        }, () => {
          this.page = page + 1
        })
      } else {
        toastShort(res.message)
      }
    }).catch(err => {
      this.setState({
        isRefreshing: false,
        isLoadMore: false,
        pullToRefresh: false,
      })
      console.warn(err)
    })
  }

  handleDateChange = (date) => {
    this.setState({
      startDate: date[0],
      endDate: date[1],
    })
  }

  renderRow = (rowData, sectionID, rowID) => {
    const { detailIndex, userBalance, userLevel } = this.state
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tableRow}
          onPress={() => {
            Sound.stop()
            Sound.play()
            let touchIndex = rowID
            if (rowID === detailIndex) {
              touchIndex = -1
            }
            this.setState({detailIndex: touchIndex})
          }}>
          <Text style={[styles.userName, styles.tableText]}>{rowData.userName}</Text>
          <Text style={[styles.betting, styles.tableText]}>{Number(rowData.recharge).toFixed(2)}</Text>
          <Text style={[styles.betting, styles.tableText]}>{Number(rowData.withdraw).toFixed(2)}</Text>
          <Text style={[styles.betting, styles.tableText]}>{Number(rowData.bet).toFixed(2)}</Text>
          <View style={styles.detailArrow}>
            <Image
              style={[styles.arrowIcon, rowID === detailIndex && {transform: [{rotate: '180deg'}]}]}
              source={iconArrow} />
          </View>
        </TouchableOpacity>
        <View style={[styles.detailWrap, detailIndex === rowID && {height: 300}]}>
          <View style={[styles.detailRow, {marginTop: 13}]}>
            <View style={styles.detailRowLeft}>
              <Text style={styles.detailText}>{`类型：${rowData.type === 1 ? '代理' : '玩家'}`}</Text>
            </View>
            <View style={styles.detailRowLeft}>
              <Text style={styles.detailText}>{`下级人数：${rowData.people}`}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailRowLeft}>
              <Text style={styles.detailText}>{`充值：${rowData.recharge}`}</Text>
            </View>
            <View style={styles.detailRowRight}>
              <Text style={styles.detailText}>{`提现：${rowData.withdraw}`}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailRowLeft}>
              <Text style={styles.detailText}>{`投注：${rowData.bet}`}</Text>
            </View>
            <View style={styles.detailRowRight}>
              <Text style={styles.detailText}>{`派彩：${rowData.bonus}`}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailRowLeft}>
              <Text style={styles.detailText}>{`余额：`}</Text>
              {
                userBalance[rowData.userId] ? (
                  <Text style={styles.detailText}>{userBalance[rowData.userId]}</Text>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      this.getUserBalance(rowData.userId)
                    }}>
                    <Image style={styles.eyeIcon} source={iconEye} />
                  </TouchableOpacity>
                )
              }
            </View>
            <View style={styles.detailRowRight}>
              <Text style={styles.detailText}>{`佣金：${rowData.income}`}</Text>
            </View>
          </View>
          {
            Array.isArray(rowData.rebate) && Array.from({length: Math.ceil(rowData.rebate.length / 2)}).map((row, rowIndex) => {
              let itemLeft = rowData.rebate[rowIndex * 2]
              let itemRight = rowData.rebate[rowIndex * 2 + 1]
              return (
                <View style={styles.detailRow} key={rowIndex}>
                  {
                    !!itemLeft && (
                      <View style={styles.detailRowLeft}>
                        <Text style={styles.detailText}>{`${itemLeft.categoryName}返点：${itemLeft.userRebate}`}</Text>
                      </View>
                    )
                  }
                  {
                    !!itemRight && (
                      <View style={styles.detailRowRight}>
                        <Text style={styles.detailText}>{`${itemRight.categoryName}返点：${itemRight.userRebate}`}</Text>
                      </View>
                    )
                  }
                </View>
              )
            })
          }
          <View style={styles.btnWrap}>
            {
              rowData.type === 1 && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.detailBtn, {marginRight: 50}]}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.getDataList(rowData.userName, 1)
                  }}>
                  <Image style={styles.btnIcon} source={iconsubAcc} />
                  <Text style={styles.detailBtnText}>下级</Text>
                </TouchableOpacity>
              )
            }
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.detailBtn, userLevel.length > 1 && {backgroundColor: '#CCC'}]}
              disabled={userLevel.length > 1}
              onPress={() => {
                Sound.stop()
                Sound.play()
                let selectedData = Immutable.fromJS(rowData).toJS()
                if (selectedData.type === 1) {
                  selectedData.isAgent = true
                }
                this.selectedOriginalData = selectedData
                this.setState({
                  showSetting: true,
                  selectedData,
                })
              }}>
              <Image style={styles.btnIcon} source={require('../../../src/img/agent_detail_modify.png')} />
              <Text style={styles.detailBtnText}>修改</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  modelSetting = () => {
    const { userInfo } = this.props.navigation.state.params
    const { showSetting, selectedData, isUpdating , isKeyboardShow} = this.state
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={showSetting}>
        <TouchableWithoutFeedback
          style={{width:width}}
          onPress={()=> dismissKeyboard()}>
          <View style={[styles.modelBg, isKeyboardShow && { justifyContent: 'flex-start' }]}>
            <View style={[styles.settingWrap, isKeyboardShow && { marginTop: 50 }]}>
              <View style={[styles.settingTitle]}>
                <Image style={styles.settingTitleIcon} source={require('../../../src/img/agent_modify.png')} />
                <Text style={styles.settingTitleText}>修改</Text>
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingRowLeft}>
                  <Text style={[styles.settingFormText, styles.settingFormField]}>用户名</Text>
                </View>
                <View style={styles.settingRowRight}>
                  <Text style={styles.settingFormText}>{selectedData.userName}</Text>
                </View>
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingRowLeft}>
                  <Text style={[styles.settingFormText, styles.settingFormField]}>类型</Text>
                </View>
                <View style={styles.settingRowRight}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.statusOption}
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      let newData = Immutable.fromJS(selectedData).toJS()
                      newData.type = 1
                      this.setState({ selectedData: newData })
                    }}>
                    <Image style={styles.radioIcon} source={selectedData.type === 1 ? radioSelected : radioUnselected} />
                    <Text style={styles.settingFormText}>代理</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.statusOption, {marginLeft: 25}]}
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      if (!selectedData.isAgent) {
                        let newData = Immutable.fromJS(selectedData).toJS()
                        newData.type = 2
                        this.setState({ selectedData: newData })
                      }
                    }}>
                    <Image style={styles.radioIcon} source={selectedData.type !== 1 ? radioSelected : radioUnselected} />
                    <Text style={[styles.settingFormText, selectedData.isAgent && {textDecorationLine: 'line-through'}]}>玩家</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {!!selectedData.rebate && selectedData.rebate.map((item, index) => {
                return (
                  <View key={index} style={styles.settingRow}>
                    <View style={styles.settingRowLeft}>
                      <Text style={[styles.settingFormText, styles.settingFormField]}>{item.categoryName}返点</Text>
                    </View>
                    <View style={styles.settingRowRight}>
                      <TextInput
                        underlineColorAndroid='transparent'
                        style={styles.input}
                        keyboardType={'numeric'}
                        maxLength={16}
                        placeholder={`当前返点${userInfo.rebate[index].userRebate}）`}
                        onBlur={() => {
                          const newData = Immutable.fromJS(selectedData).toJS()
                          const value = selectedData.rebate[index].userRebate
                          if (!value) {
                            newData.rebate[index].userRebate = Number(this.selectedOriginalData.rebate[index].userRebate).toFixed(2)
                            this.setState({
                              selectedData: newData,
                            })
                          }
                        }}
                        onChangeText={(text) => {
                          const newData = Immutable.fromJS(selectedData).toJS()
                          const defaultRebate = userInfo.rebate[index].userRebate
                          const value = clearNoNum(text) > Number(defaultRebate) ? defaultRebate : clearNoNum(text)
                          newData.rebate.some((newDateItem) => {
                            if (newDateItem.categoryId === item.categoryId) {
                              newDateItem.userRebate = value
                            }
                          })
                          this.setState({ selectedData: newData})
                        }}
                        value={item.userRebate}/>
                    </View>
                  </View>
                )
              })}
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
                    const formatData = Immutable.fromJS(selectedData).toJS()
                    const needConfirm = formatData.rebate.some((item, index) => {
                      return Number(item.userRebate) < Number(this.selectedOriginalData.rebate[index].userRebate)
                    })
                    if (needConfirm) {
                      Alert.alert('', '调低返点可能会影响到下级代理的下级，请谨慎操作！', [
                        { text: '返回', onPress: () => {} },
                        { text: '确认', onPress: () => {
                          this.setState({
                            isUpdating: true,
                            showSetting: false,
                            selectedData: formatData,
                          }, () => {
                            this.settingUser(formatData)
                          })
                        }},
                      ], { cancelable: true })
                    } else {
                      this.setState({
                        isUpdating: true,
                        showSetting: false,
                        selectedData: formatData,
                      }, () => {
                        this.settingUser(formatData)
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

  settingUser = (selectedData) => {
    const newRebate = Immutable.fromJS(selectedData.rebate).toJS()
    newRebate.filter((item) => { return delete item.categoryName })
    fetchWithOutStatus({
      act: 10309,
      subUserId: selectedData.userId,
      type: selectedData.type,
      rebate: newRebate,
    }, { token: this.props.navigation.state.params.userInfo.token }).then(res => {
      if (res.status === 0) {
        toastShort(res.message)
        let dataList = this.state.dataList
        for (let item of dataList) {
          if (item.userId === selectedData.userId) {
            item.type = selectedData.type
            item.rebate = selectedData.rebate
          }
        }
        this.setState({
          isUpdating: false,
          showSetting: false,
          dataList,
        })
      } else {
        toastShort(res.message)
        this.setState({isUpdating: false})
      }
    }).catch(err => {
      console.warn(err)
    })
  }

  render() {
    const {
      userName, startDate, endDate, userLevel, dataList,
      hasMore, isRefreshing, isLoadMore,
    } = this.state
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'团队管理'}
          leftIcon={'back'}
          leftIconAction={() => {
            Sound.stop()
            Sound.play()
            this.props.navigation.goBack()
          }}/>
        <View style={styles.queryArea}>
          <TextInput
            underlineColorAndroid='transparent'
            style={styles.nameInput}
            keyboardType={'ascii-capable'}
            maxLength={16}
            clearButtonMode='while-editing'
            placeholder='请输入用户名'
            onChangeText={(text) => { this.setState({userName: text}) }}
            value={userName}/>
          <View style={styles.calendarWrap}>
            <View style={styles.calTips}>
              <Image style={styles.calIcon} source={require('../../../src/img/agent_calendar.png')} />
              <Text style={styles.calTipsText}>日期</Text>
            </View>
            <View style={styles.calArea}>
              <TouchableOpacity style={styles.cal}
                                onPress={() =>
                                  this.props.navigation.navigate('CalendarPage', { onDateChange: this.handleDateChange })}>
                {startDate === '2016-01-01'
                  ? <Text>-</Text>
                  : <Text>{replaceWithDot(startDate)}</Text>}
              </TouchableOpacity>
              <View style={styles.calToCal} />
              <TouchableOpacity style={styles.cal}
                                onPress={() =>
                                  this.props.navigation.navigate('CalendarPage', { onDateChange: this.handleDateChange })}>
                {startDate === '2016-01-01'
                  ? <Text>{replaceWithDot(yesterday())}</Text>
                  : <Text>{replaceWithDot(endDate)}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.queryBtnWrap}>
          <TouchableOpacity
            activeOpacity={0.55}
            style={styles.queryBtn}
            onPress={() => {
              Sound.stop()
              Sound.play()
              this.getDataList(userName, 1)
            }}>
            <Text style={styles.queryBtnText}>搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataTable}>
          <View style={styles.levelWrap}>
            <Text style={styles.tipsText}>当前用户层级</Text>
            <View style={styles.level}>
            {
              userLevel.map((item, index) => {
                let displayArrow = false
                let iscurrentLevel = false
                if (index + 1 < userLevel.length) {
                  displayArrow = true
                }
                if (index + 1 === userLevel.length) {
                  iscurrentLevel = true
                }
                return (
                  <View style={styles.levelItem} key={index}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.levelName, iscurrentLevel && styles.actityWrap]}
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        this.getDataList(item.user_name, 1)
                      }}>
                      <Text style={[styles.levelNameText, iscurrentLevel && styles.actityText]}>{item.user_name}</Text>
                    </TouchableOpacity>
                    {
                      displayArrow && (
                        <View style={styles.arrowWrap}>
                          <View style={styles.arrowTips}>
                            <Text style={styles.arrowTipsText}>下级</Text>
                          </View>
                          <View style={styles.arrow}/>
                        </View>
                      )
                    }
                  </View>
                )
              })
            }
            </View>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.userName, styles.tableText]}>用户名</Text>
            <Text style={[styles.betting, styles.tableText]}>充值</Text>
            <Text style={[styles.betting, styles.tableText]}>提现</Text>
            <Text style={[styles.betting, styles.tableText]}>投注</Text>
            <Text style={styles.detailArrow} />
          </View>
          {
            dataList === -1 ? (
              <LoadingView />
            ) : (
              <GiftedListView
                initialListSize={1}
                pageSize={this.num}
                hasMoreData={hasMore}
                refreshing={isRefreshing}
                isLoadMore={isLoadMore}
                fetchLatestData={this.getDataList.bind(this, userLevel[userLevel.length - 1].user_name, 1)}
                fetchMoreData={this.getDataList.bind(this, userLevel[userLevel.length - 1].user_name)}
                OnEndReachedThreshold={this.num}
                dataSource={ds.cloneWithRows(dataList)}
                renderRow={this.renderRow}
                pullToRefresh={this.state.pullToRefresh}/>
            )
          }
        </View>
        {
          this.modelSetting()
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  queryArea: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    flexDirection: 'column',
  },
  nameInput: {
    width: width - 20,
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#F5F5F9',
    padding: 0,
  },
  calendarWrap: {
    marginTop: 7.5,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calTips: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calIcon: {
    width: 16.61,
    height: 14.85,
  },
  calTipsText: {
    marginLeft: 5,
    color: '#333333',
    fontSize: 14,
  },
  calArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cal: {
    width: 85,
    height: 25,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  calToCal: {
    backgroundColor: '#333333',
    width: 14,
    height: 1,
    marginHorizontal: 8.5,
  },
  queryBtnWrap: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queryBtn: {
    width: 240,
    height: 30,
    backgroundColor: Config.baseColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queryBtnText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  dataTable: {
    flex: 1,
  },
  levelWrap: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  level: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  levelItem: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelName: {
    height: 25,
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDDDDD',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actityWrap: {
    borderColor: '#EC0909',
  },
  actityText: {
    color: '#EC0909',
  },
  levelNameText: {
    color: '#999999',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  tipsText: {
    color: '#999999',
    fontSize: 12,
  },
  arrowWrap: {
    marginLeft: 8,
    marginRight: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowTips: {
    width: 27,
    height: 14,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowTipsText: {
    fontSize: 10,
    color: '#BCBCBC',
  },
  arrow: {
    borderLeftWidth: 6,
    borderLeftColor: '#F2F2F2',
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
  tableRow: {
    height: 40,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  userName: {
    flex: 2,
  },
  betting: {
    flex: 2,
  },
  detailArrow: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableText: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 14,
  },
  arrowIcon: {
    width: 13.7,
    height: 7.5,
  },
  detailWrap: {
    height: 0,
    backgroundColor: '#F4F9FF',
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  detailRow: {
    height: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  detailRowRight: {
    alignItems: 'flex-end',
  },
  detailText: {
    fontSize: 14,
    color: '#64778D',
  },
  eyeIcon: {
    width: 25,
    height: 25,
  },
  btnWrap: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtn: {
    width: 95,
    height: 23,
    borderRadius: 4,
    backgroundColor: '#8BC0FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    width: 23,
    height: 23,
  },
  detailBtnText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5,
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
    height: 50,
    flex: 1,
    flexDirection: 'row',
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
})
