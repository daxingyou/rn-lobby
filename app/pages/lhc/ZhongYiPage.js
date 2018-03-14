import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, Image,
    Vibration } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { _renderGridItem1 } from '../../components/LHCrenderBall'
import GridView from '../../components/GridView'
import { toastShort } from '../../utils/toastUtil'
import layout from './layout' // 数据源
import SelectedTab from '../../components/LHCselectedTab'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'
import { HaoMa } from '../../components/HaoMaPeiLv'

const windowWidth = Dimensions.get('window').width
const Layout = layout[15]
const objData = Layout
const groupTitle = Layout.totleTitle


class ZiXuanBuZhongPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      betInput: '2',
      isRecentLotteryVisible: false,
      isModalVisible: false,
      btnStateArrKeeping: objData,
      money: 0,
      sendAction: {gameNum: 23},
      activeTab: 0,
      rate: [],
      zuhe: 0,
    }
    this._onChangeText = this._onChangeText.bind(this)
    this._onPressCancelInput = this._onPressCancelInput.bind(this)
    this._onPressItem = this._onPressItem.bind(this)
    this._onPressConfirm = this._onPressConfirm.bind(this)
    this._onPressRecentLottery = this._onPressRecentLottery.bind(this)
    this._onPressRandom = this._onPressRandom.bind(this)
  }
  componentWillMount() {
    this.props.phoneSettings.shakeitoff && RNShakeEventIOS.addEventListener('shake', () => {
      this._onPressRandom()
    })

    const resData = Immutable.fromJS(this.props.resData).toJS()
    const rate = []
    Object.keys(resData).map((v)=>{
      rate.push(resData[v])
    })
    this.setState({rate})
  }
  componentDidMount() {
    this.props.callBack(this._onPressRandom)
  }
  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake')
  }
  getCombination(nums, index) {
    let link = [5,6,7,8,9,10,11,12][index]
    let combination = []
    for (let a = 0; a < nums.length - (link - 1); a++) {
      for (let b = a + 1; b < nums.length - (link - 2); b++) {
        for (let c = b + 1; c < nums.length - (link - 3); c++) {
          for (let d = c + 1; d < nums.length - (link - 4); d++) {
            for (let e = d + 1; e < nums.length - (link - 5); e++) {
              let com5 = nums[a] + ', ' + nums[b] + ', ' + nums[c] + ', ' + nums[d] + ', ' + nums[e]
              if (link > 5) {
                for (let f = e + 1; f < nums.length - (link - 6); f++) {
                  let com6 = com5 + ', ' + nums[f]
                  if (link > 6) {
                    for (let g = f + 1; g < nums.length - (link - 7); g++) {
                      let com7 = com6 + ', ' + nums[g]
                      if (link > 7) {
                        for (let h = g + 1; h < nums.length - (link - 8); h++) {
                          let com8 = com7 + ', ' + nums[h]
                          if (link > 8) {
                            for (let i = h + 1; i < nums.length - (link - 9); i++) {
                              let com9 = com8 + ', ' + nums[i]
                              if (link > 9) {
                                for (let j = i + 1; j < nums.length - (link - 10); j++) {
                                  let com10 = com9 + ', ' + nums[j]
                                  if (link > 10) {
                                    for (let k = j + 1; k < nums.length - (link - 11); k++) {
                                      let com11 = com10 + ', ' + nums[k]
                                      if (link > 11) {
                                        for (let l = k + 1; l < nums.length - (link - 12); l++) {
                                          let com12 = com11 + ', ' + nums[l]
                                          combination.push(com12)
                                        }
                                      } else {
                                        combination.push(com11)
                                      }
                                    }
                                  } else {
                                    combination.push(com10)
                                  }
                                }
                              } else {
                                combination.push(com9)
                              }
                            }
                          } else {
                            combination.push(com8)
                          }
                        }
                      } else {
                        combination.push(com7)
                      }
                    }
                  } else {
                    combination.push(com6)
                  }
                }
              } else {
                combination.push(com5)
              }
            }
          }
        }
      }
    }
    return combination.length
  }
  _onChangeText(betInput) {
    this.setState({betInput})
  }
  _onPressCancelInput() {
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction: {gameNum: 23} })
  }
  _onPressRecentLottery() {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm() {
    const  typeArr = {"NI5":"五中一", "NI6":"六中一", "NI7":"七中一", "NI8":"八中一", "NI9":"九中一", "NIA":"十中一"}
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    let commitToDetails = {}
    sendAction.zuhe = this.state.zuhe
    sendAction.money = this.state.betInput
    sendAction.name = Layout.name
    sendAction.title = typeArr[Object.keys(typeArr)[this.state.activeTab]]
    sendAction.odds = this.state.rate[this.state.activeTab]
    sendAction.model = Object.keys(this.props.resData)[this.state.activeTab]
    commitToDetails.sendAction = sendAction

    switch(Object.keys(typeArr)[this.state.activeTab]){
      case "NIC":
      if(sendAction.orders.length<12){
        toastShort('尚未选满12个球号')
        return
      }
      case "NIB":
      if(sendAction.orders.length<11){
        toastShort('尚未选满11个球号')
        return
      }
      case "NIA":
      if(sendAction.orders.length<10){
        toastShort('尚未选满10个球号')
        return
      }
      case "NI9":
      if(sendAction.orders.length<9){
        toastShort('尚未选满9个球号')
        return
      }
      case "NI8":
      if(sendAction.orders.length<8){
        toastShort('尚未选满8个球号')
        return
      }
      case "NI7":
      if(sendAction.orders.length<7){
        toastShort('尚未选满7个球号')
        return
      }
      case "NI6":
      if(sendAction.orders.length<6){
        toastShort('尚未选满6个球号')
        return
      }
      case "NI5":
      if(sendAction.orders.length<5){
        toastShort('尚未选满5个球号')
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
    sendAction["orders"] = sendAction["orders"] || []
    if (item.isSelected === undefined || item.isSelected === false) {
      const nums = [10,10,10,11,12,13]
      if(sendAction["orders"].length>=nums[this.state.activeTab]){
      toastShort(`最多只能选${nums[this.state.activeTab]}个球`)
      return
    }
      sendAction.money = this.state.betInput
      sendAction["orders"].push(item.label)
    } else {
      sendAction["orders"].forEach((v,i)=>{
        if(v === item.label) {
          sendAction["orders"].splice(i,1) //取消选中，数组移除指定元素
        }
      })
    }
    this.setState({
        sendAction: sendAction,
        zuhe: this.getCombination(sendAction.orders, this.state.activeTab),
      })

    const tempKeeping = Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
      tempKeeping.data.forEach((objItem) => {
        if ((objItem.label === item.label)) {
          objItem.isSelected = !objItem.isSelected
          this.setState({ btnStateArrKeeping: tempKeeping })
          return
        }
      })

  }

  _onPressRandom() {
    this.setState({
      btnStateArrKeeping: objData,
      sendAction: {
        gameNum: 23,
      },
    }, () => {
      this.props.phoneSettings.shake && Vibration.vibrate()
      const tempBtnStateArrKeeping = Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
      const nums = [5, 6, 7, 8, 9, 10]
      const activeTab = this.state.activeTab
      const itemList = []
      for (var i = 1; i <= nums[activeTab]; i++) {
        const rannum = Math.round(Math.random() * (tempBtnStateArrKeeping.data.length - 1))
        const item = tempBtnStateArrKeeping.data.splice(rannum, 1)[0]
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
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.rateContent}>
            <ScrollableTabView page={this.state.activeTab} renderTabBar={() => <SelectedTab textArr={groupTitle} rate={this.state.rate} />}
                               onChangeTab={(tab)=>{
                                 this._onPressCancelInput()
                                 this.setState({activeTab: tab.i}, () => {this.props.onChangeTab && this.props.onChangeTab(tab.i)})
                               }}>
              {
                this.state.btnStateArrKeeping.totleTitle.map((item, index) => {
                  return(
                    <View key={index} style={styles.rateContent2}>
                      <View style={styles.contentMsg}>
                        <Image style={styles.msgImg} source={require('../../src/img/ic_ring_red.png')}/>
                        <Text style={styles.msgText}>必须选满{[5,6,7,8,9,10][index]}个球</Text>
                      </View>
                      <View style={{width: 60, alignItems: 'flex-end', marginTop: 10}}>
                        <HaoMa />
                      </View>
                      <View style={styles.gridViewWrap}>
                        <GridView
                              style={styles.gridView}
                              items={this.state.btnStateArrKeeping.data}
                              itemsPerRow={5}
                              callback={this._onPressItem}
                              bottomStyle={styles.gridBottom}
                              renderItem={_renderGridItem1}
                              closeRandom={true}/>
                      </View>
                    </View>
                  )
                })
              }
              </ScrollableTabView>
          </View>
              <BuyBar randomOrder={this.props.randomOrder} navigation={this.props.navigation} type={2}
zuhe={this.state.zuhe} sendAction={this.state.sendAction} betInput={this.state.betInput}
onPressCancelInput={this._onPressCancelInput} onChangeText={this._onChangeText} onPressConfirm={this._onPressConfirm} />

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
  rateContent2: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#fff',
    paddingTop: 20,
  },
  gridViewWrap: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: windowWidth,
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  },
  gridView: {
    flex: 1,
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

export default connect(mapStateToProps, mapDispatchToProps)(ZiXuanBuZhongPage)
