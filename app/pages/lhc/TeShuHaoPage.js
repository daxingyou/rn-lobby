import React, { Component } from 'react'
import { StyleSheet, View,
  Vibration } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { _renderGridItem1, _renderGridItem2 } from '../../components/LHCrenderBall'
import GridView from '../../components/GridView'
import layout from './layout' // 布局数据
import SelectedTab from '../../components/LHCselectedTab'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'
import { HaoMaPeiLv } from '../../components/HaoMaPeiLv'

const objData = layout[1].items
const groupTitle = layout[1].totleTitle

class TeShuHaoPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      betInput: '2',
      isRecentLotteryVisible: false,
      isModalVisible: false,
      btnStateArrKeeping: objData,
      keepingCount: 0,
      money: 0,
      sendAction: {gameNum: 2},
      activeTab: 0,
    }
    this._onChangeText = this._onChangeText.bind(this)
    this._onPressCancelInput = this._onPressCancelInput.bind(this)
    this._onPressConfirm = this._onPressConfirm.bind(this)
    this._onPressRecentLottery = this._onPressRecentLottery.bind(this)
    this._onPressItem = this._onPressItem.bind(this)
    this._onPressRandom = this._onPressRandom.bind(this)
  }

  componentWillMount() {
    this.props.phoneSettings.shakeitoff && RNShakeEventIOS.addEventListener('shake', () => {
      this._onPressRandom()
    })

      const resData = this.props.resData
      objData.map((v)=>{
        v.data.map((value)=>{
          value.rate = resData[value.name]
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
    this.setState({betInput}, ()=>{
      let sendAction = this.state.sendAction
      sendAction["orders"] = sendAction["orders"] || {}
      if (sendAction["orders"] && Object.keys(sendAction["orders"]).length>0) {
        Object.keys(sendAction["orders"]).map((v)=>{
          sendAction["orders"][v].money = this.state.betInput
        })
      }
    })
  }

  _onPressCancelInput() {
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction: {gameNum: 2}, keepingCount: 0 })
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
    sendAction.name = layout[1].name
    commitToDetails.sendAction = sendAction
    this.props.ADDLHClistItem(commitToDetails)
    this.props.navigation.navigate('BetDetailsPage', {category_id: this.props.category_id, lottery_id: this.props.lottery_id})

  }

  _onPressItem(item) { // 点击选中玩法
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
      sendAction["orders"] = sendAction["orders"] || {}

    if (item.isSelected === undefined || item.isSelected === false) {

      sendAction["orders"][item.name] = sendAction["orders"][item.name] || {}
      sendAction["orders"][item.name].money = this.state.betInput
      sendAction["orders"][item.name].odds = item.rate
      sendAction["orders"][item.name].label = item.label
      sendAction["orders"][item.name].title = item.title
    } else {
      delete sendAction["orders"][item.name]
    }
    this.setState({
        sendAction: sendAction,
      })

    const tempKeeping = JSON.parse(JSON.stringify(this.state.btnStateArrKeeping))
    tempKeeping.forEach((itemArr) => {
      itemArr.data.forEach((objItem) => {
        if ((objItem.name === item.name)) {
          objItem.isSelected = !objItem.isSelected
          this.setState({ btnStateArrKeeping: tempKeeping })
          return
        }
      })
    })
  }

  _onPressRandom() {
    this.setState({ btnStateArrKeeping: objData, sendAction: {gameNum: 2}, keepingCount: 0 }, () => {
      this.props.phoneSettings.shake && Vibration.vibrate()
      const activeTab = this.state.activeTab
      const tempBtnStateArrKeeping =  Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
      const random2 = Math.round(Math.random()*(tempBtnStateArrKeeping[activeTab].data.length-1)) || 0
      this._onPressItem(tempBtnStateArrKeeping[activeTab].data[random2], tempBtnStateArrKeeping[activeTab])
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.rateContent}>
            <ScrollableTabView
              page={this.state.activeTab}
              renderTabBar={() => <SelectedTab textArr={groupTitle} />}
              onChangeTab={(tab) => {
                this.setState({
                  activeTab:Number(tab.i),
                }, () => {
                  this._onPressCancelInput()
                  this.props.onChangeTab && this.props.onChangeTab(tab.i)
                })
              }}>
              {
                this.state.btnStateArrKeeping.map((item, index) => {
                  if (index === 0 || index === 1) {
                    return (
                      <View key={index} style={styles.gridViewWrap}>
                        <HaoMaPeiLv />
                        <GridView
                          style={styles.gridView}
                          items={item.data}
                          callback={this._onPressItem}
                          itemsPerRow={5}
                          renderItem={_renderGridItem1}/>
                      </View>
                    )
                  }else if (index === 2) {
                    return (
                      <View key={index} style={[styles.gridViewWrap2, { height: item.gridHeight }]}>
                        <GridView
                          style={styles.gridView}
                          items={item.data}
                          callback={this._onPressItem}
                          itemsPerRow={4}
                          renderItem={_renderGridItem2}/>
                      </View>
                    )
                  }else {
                    return null
                  }
                })
              }
            </ScrollableTabView>
          </View>
            <BuyBar
              randomOrder={this.props.randomOrder}
              navigation={this.props.navigation}
              sendAction={this.state.sendAction}
              betInput={this.state.betInput}
              onPressCancelInput={this._onPressCancelInput}
              onChangeText={this._onChangeText}
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
    backgroundColor: '#fff',
  },
  rateContent: {
    flex: 1,
  },
  gridViewWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#fff',
  },
  gridViewWrap2: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 2,
    borderTopColor: '#fff',
  },
  gridView: {
    flex: 1,
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

export default connect(mapStateToProps, mapDispatchToProps)(TeShuHaoPage)
