import React, { Component } from 'react'
import { StyleSheet, View,
    ScrollView, Vibration } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { ButtonItem } from '../../components/LHCrenderBall'
import layout from './layout' // 数据源
import SelectedTab from '../../components/LHCselectedTab'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'

const Layout = layout[10]
const objData = Layout
const groupTitle = Layout.totleTitle

class ShengXiaoPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      betInput: '2',
      isRecentLotteryVisible: false,
      isModalVisible: false,
      btnStateArrKeeping: objData,
      keepingCount: 0,
      money: 0,
      sendAction: {},
      activeTab: 0,
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

    const resData = Immutable.fromJS(this.props.resData).toJS()

    const resObj = {}
    resData.forEach((item)=>{
      Object.keys(item).map((v)=>{
        resObj[v] = item[v]
      })
    })
    objData.items.map((item)=>{
      item.data.map((v)=>{
        v.rate = resObj[v.name]
      })
    })
  }
  componentDidMount() {
    this.props.callBack(this._onPressRandom)
  }

  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake')
  }

  _onChangeText(betInput) {
    this.setState({ betInput })

  }
  _onPressCancelInput() {
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction: {}, keepingCount: 0 })
  }
  _onPressRecentLottery() {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm() {
    this._onPressCancelInput()
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    let commitToDetails = {}
    for (let key of Object.keys(sendAction.orders)) {
      sendAction.orders[key].money = this.state.betInput
    }
    sendAction.name = Layout.name
    sendAction.gameNum = 11 + (this.state.activeTab ===3? 4: this.state.activeTab)
    commitToDetails.sendAction = sendAction

    this.props.ADDLHClistItem(commitToDetails)
    this.props.navigation.navigate('BetDetailsPage')
  }
  _onPressItem(item) { // 点击选中玩法
    if (item.isSelected === undefined || item.isSelected === false) {
      this.setState({ keepingCount: this.state.keepingCount + 1 })
      let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
      sendAction.money = this.state.betInput
      sendAction['orders'] = sendAction['orders'] || {}
      sendAction['orders'][item.name] = sendAction['orders'][item.name] || {}
      sendAction['orders'][item.name]['label'] = item.label
      sendAction['orders'][item.name]['money'] = this.state.betInput
      sendAction['orders'][item.name]['title'] = item.title
      sendAction['orders'][item.name]['odds'] = item.rate
      this.setState({
        sendAction: sendAction,
      })
      
    } else {
      this.setState({ keepingCount: this.state.keepingCount - 1 })
      let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
      sendAction["orders"] = sendAction["orders"] || {}
      delete sendAction["orders"][item.name]
      this.setState({
        sendAction: sendAction,
      })
    }

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
      sendAction: {},
      keepingCount: 0,
    }, () => {
      this.props.phoneSettings.shake && Vibration.vibrate()
      const tempBtnStateArrKeeping = Immutable.fromJS(this.state.btnStateArrKeeping.items).toJS()
      const activeTab = this.state.activeTab
      const random2 = Math.round(Math.random() * (tempBtnStateArrKeeping[activeTab].data.length - 1)) || 0

      this._onPressItem(tempBtnStateArrKeeping[activeTab].data[random2])
    })
  }

  render() {
    const { resData } = this.props
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
              <BuyBar randomOrder={this.props.randomOrder} navigation={this.props.navigation} sendAction={this.state.sendAction}
betInput={this.state.betInput} onPressCancelInput={this._onPressCancelInput} onChangeText={this._onChangeText}
onPressConfirm={this._onPressConfirm} />
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
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingBottom: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(ShengXiaoPage)
