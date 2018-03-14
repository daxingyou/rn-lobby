import React, { Component } from 'react'
import { StyleSheet, View, Text, Image,
    ScrollView, Vibration } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { ButtonItem } from '../../components/LHCrenderBall'
import { toastShort } from '../../utils/toastUtil'
import SelectedTab from '../../components/LHCselectedTab'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'
import layout from './layout' // 数据源

const Layout = layout[8]
const objData = Layout
const groupTitle = Layout.totleTitle

class LianWeiPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      betInput: '2',
      isRecentLotteryVisible: false,
      isModalVisible: false,
      btnStateArrKeeping: objData,
      keepingCount: 0,
      money: 0,
      sendAction: {gameNum: 9},
      activeTab: 0,
      rate: [],
      zuhe: 0,
    }
    this._onChangeText = this._onChangeText.bind(this)
    this._onPressCancelInput = this._onPressCancelInput.bind(this)
    this._onPressConfirm = this._onPressConfirm.bind(this)
    this._onPressRecentLottery = this._onPressRecentLottery.bind(this)
    this._onPressRandom = this._onPressRandom.bind(this)
  }
  componentWillMount() {
    this.props.phoneSettings.shakeitoff && RNShakeEventIOS.addEventListener('shake', () => {
      this._onPressRandom()
    })
  }
  componentDidMount() {
    this.props.callBack(this._onPressRandom)
  }
  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake')
  }
  getCombination(selectedItem,index) {
    let link = index+2
    let combination = []
    if(selectedItem.length >= link) {
      for(let i = 0; i < selectedItem.length - (link - 1); i++) {
        for(let j = i + 1; j < selectedItem.length - (link - 2); j++) {
          if(link > 2) {
            for(let m = j + 1; m < selectedItem.length - (link - 3); m++) {
              if(link > 3) {
                for(let n = m + 1; n < selectedItem.length - (link - 4); n++) {
                  if(link > 4) {
                    for(let g = n + 1; g < selectedItem.length - (link - 5); g++) {
                      let com = []
                      com.push(selectedItem[i])
                      com.push(selectedItem[j])
                      com.push(selectedItem[m])
                      com.push(selectedItem[n])
                      com.push(selectedItem[g])
                      combination.push(com)
                    }
                  } else {
                    let com = []
                    com.push(selectedItem[i])
                    com.push(selectedItem[j])
                    com.push(selectedItem[m])
                    com.push(selectedItem[n])
                    combination.push(com)
                  }
                }
              } else {
                let com = []
                com.push(selectedItem[i])
                com.push(selectedItem[j])
                com.push(selectedItem[m])
                combination.push(com)
              }
            }
          } else {
            let com = []
            com.push(selectedItem[i])
            com.push(selectedItem[j])
            combination.push(com)
          }
        }

      }

    }

    return combination.length
  }

  _onChangeText(betInput) {
    this.setState({ betInput })
  }
  _onPressCancelInput() {
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction: {gameNum: 9}, keepingCount: 0 })
  }
  _onPressRecentLottery() {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm() {
    const typeArr = {"LF2": "二尾碰", "LF3": "三尾碰", "LF4": "四尾碰", "LF5": "五尾碰"}
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    let commitToDetails = {}
    sendAction.zuhe = this.state.zuhe
    sendAction.money = this.state.betInput
    sendAction.name = Layout.name
    sendAction.title = typeArr[Object.keys(typeArr)[this.state.activeTab]]
    sendAction.model = Layout.tabs[this.state.activeTab]
    commitToDetails.sendAction = sendAction


    switch(Object.keys(typeArr)[this.state.activeTab]){
      case "LF5":
      if(Object.keys(sendAction.orders).length<5){
        toastShort('尚未选满5个球号')
        return
      }
      case "LF4":
      if(Object.keys(sendAction.orders).length<4){
        toastShort('尚未选满4个球号')
        return
      }
      case "LF3":
      if(Object.keys(sendAction.orders).length<3){
        toastShort('尚未选满3个球号')
        return
      }
      case "LF2":
      if(Object.keys(sendAction.orders).length<2){
        toastShort('尚未选满2个球号')
        return
      }
      default:
        this.props.ADDLHClistItem(commitToDetails)
        this.props.navigation.navigate('BetDetailsPage')
        this._onPressCancelInput()
        return
    }
  }
  _onPressItem(item) { // 点击选中玩法
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    sendAction['orders'] = sendAction['orders'] || {}
    if (item.isSelected === undefined || item.isSelected === false) {
      if (Object.keys(sendAction["orders"]).length>=6){ toastShort("最多只能选6个球");return }
      sendAction.money = this.state.betInput
      for (let key of Object.keys(sendAction.orders)) {
        sendAction.orders[key].money = this.state.betInput
      }
      sendAction['orders'][item.type] = sendAction['orders'][item.type] || {}
      sendAction['orders'][item.type]['label'] = item.label
      sendAction['orders'][item.type]['odds'] = this.props.resData[item.type]
    } else {
      delete sendAction["orders"][item.type]
    }
    this.setState({
        sendAction: sendAction,
        zuhe: this.getCombination(Object.keys(sendAction.orders),this.state.activeTab),
      })
    const tempKeeping = Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
    tempKeeping.items.forEach((itemArr) => {
      itemArr.data.forEach((objItem) => {
        if ((objItem.label=== item.label)) {
          objItem.isSelected = !objItem.isSelected
          this.setState({ btnStateArrKeeping: tempKeeping })
          return
        }
      })
    })

  }
  _onPressRandom() {
    this.setState({
      btnStateArrKeeping: objData,
      sendAction: {
        gameNum: 9,
      },
      keepingCount: 0,
    }, () => {
      this.props.phoneSettings.shake && Vibration.vibrate()
      const tempBtnStateArrKeeping = Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
      const nums = [2, 3, 4, 5]
      const activeTab = this.state.activeTab
      const itemList = []
      for (var i = 1; i <= nums[activeTab]; i++) {
        const rannum = Math.round(Math.random() * (tempBtnStateArrKeeping.items[activeTab].data.length - 1))
        const item = tempBtnStateArrKeeping.items[activeTab].data.splice(rannum, 1)[0]
        itemList.push(item)
      }

      itemList.forEach((v) => {
        setTimeout(() => {
          this._onPressItem(v)
        }, 0)
      })
    })
  }

  render() {
    const resData = this.props.resData
    return (
      <View style={styles.container}>
        <View style={styles.content}>

          <View style={styles.rateContent}>
            <ScrollableTabView page={this.state.activeTab} renderTabBar={() => <SelectedTab textArr={groupTitle} />}
                               onChangeTab={(tab)=>{ this._onPressCancelInput();this.setState({activeTab: tab.i}, () => {this.props.onChangeTab && this.props.onChangeTab(tab.i)}) }}>
              {
                    this.state.btnStateArrKeeping.items.map((item, index) => {
                      return (
                        <ScrollView style={{borderTopWidth: 2, borderTopColor: '#fff'}} contentContainerStyle={{alignItems:'center'}} key={index}
automaticallyAdjustContentInsets={false} horizontal={false}>
                          <View style={styles.contentMsg}>
                            <Image style={styles.msgImg} source={require('../../src/img/ic_ring_red.png')}/>
                            <Text style={styles.msgText}>必须选满{[2,3,4,5][index]}个球</Text>
                          </View>
                          <View style={[styles.oneGroupWrap]}>
                              {
                                item.data.map((oneBlock, i) => {
                                  return (
                                    <ButtonItem item={oneBlock} rate={resData[oneBlock.type]} key={i}
onPressItem={() => this._onPressItem(oneBlock)} />
                                  )
                                })
                              }
                          </View>
                        </ScrollView>
                      )
                    })
                  }
            </ScrollableTabView>
          </View>
              <BuyBar randomOrder={this.props.randomOrder} type={2} navigation={this.props.navigation}
zuhe={this.state.zuhe} sendAction={this.state.sendAction} betInput={this.state.betInput}
onPressCancelInput={this._onPressCancelInput} onChangeText={this._onChangeText} onPressConfirm={this._onPressConfirm}/>
        </View>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  rateContent: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  oneGroupWrap: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 25,
    paddingBottom: 10,
  },
  contentMsg: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
  },
  msgImg: {
    width: 12,
    height: 14,
    marginRight: 6,
  },
  msgText: {
    fontSize: 12,
    color: '#D0021B',
  },
})

const mapStateToProps = (state) => {
  const { LHCbetDetails, phone } = state
  const { phoneSettings } = phone
  return {
    LHCbetDetails,
    phoneSettings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ADDLHClistItem: (commitToDetails) => {
      dispatch(ADDLHClistItem(commitToDetails))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LianWeiPage)
