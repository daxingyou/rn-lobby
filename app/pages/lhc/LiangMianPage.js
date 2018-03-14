import React, { Component } from 'react'
import { Vibration, StyleSheet, View } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { _renderGridItem2 } from '../../components/LHCrenderBall'
import GridView from '../../components/GridView'
import SelectedTab from '../../components/LHCselectedTab'
import layout from './layout' // 数据源
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'

const objData = layout[0].items
const groupTitle = layout[0].totleTitle

class LiangMianPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRecentLotteryVisible: false,
      betInput: '2',
      isModalVisible: false,
      btnStateArrKeeping: objData,
      activeTab: 0,
      money: 0,
      sendAction: {gameNum: 1},
    }
    this._onPressRecentLottery = this._onPressRecentLottery.bind(this)
    this._onPressCancelInput = this._onPressCancelInput.bind(this)
    this._onPressRandom = this._onPressRandom.bind(this)
    this._onPressItem = this._onPressItem.bind(this)
    this._onPressConfirm = this._onPressConfirm.bind(this)
    this._onChangeText = this._onChangeText.bind(this)
  }
  componentWillMount() {
    this.props.phoneSettings.shakeitoff &&
    RNShakeEventIOS.addEventListener('shake', () => {
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
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction:{gameNum: 1} })
  }
   _onPressRecentLottery() {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm() {
    this._onPressCancelInput()
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    let commitToDetails = {}
    sendAction.name = layout[0].name
    commitToDetails.sendAction = sendAction
    this.props.ADDLHClistItem(commitToDetails)
    this.props.navigation.navigate('BetDetailsPage')
  }
  _onPressItem(oneBlock) { // 点击选中玩法
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    sendAction["orders"] = sendAction["orders"] || {}
    if (oneBlock.isSelected === undefined || oneBlock.isSelected === false) {
      sendAction["orders"][oneBlock.name] = sendAction["orders"][oneBlock.name] || {}
      sendAction["orders"][oneBlock.name].money = this.state.betInput
      sendAction["orders"][oneBlock.name].odds = oneBlock.rate
      sendAction["orders"][oneBlock.name].label = oneBlock.label
      sendAction["orders"][oneBlock.name].title = oneBlock.title
    } else {
      delete sendAction["orders"][oneBlock.name]
    }
    this.setState({
        sendAction: sendAction,
    })
    const tempKeeping = Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
    tempKeeping.forEach((itemArr) => {
      itemArr.data.forEach((objItem) => {
        if ((objItem.name === oneBlock.name) && (objItem.label === oneBlock.label)) {
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
      sendAction: {gameNum: 1},
    }, () => {
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
            <View style={styles.contentWrap}>
              <ScrollableTabView
                page={this.state.activeTab}
                renderTabBar={() => <SelectedTab textArr={groupTitle} />}
                onChangeTab={(tab)=> {
                  this.setState({
                    activeTab:Number(tab.i),
                  }, () => {
                    this._onPressCancelInput()
                    this.props.onChangeTab && this.props.onChangeTab(tab.i)
                  })
                }}>
                  {
                    this.state.btnStateArrKeeping.map((item, index) => {
                      return (
                        <View key={index} style={[styles.gridViewWrap2, { height: item.gridHeight }]}>
                          <GridView
                            style={styles.gridView}
                            items={item.data}
                            callback={this._onPressItem}
                            itemsPerRow={4}
                            renderItem={_renderGridItem2} />
                        </View>
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
    backgroundColor: '#F4F3F8',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  contentWrap: {
    flex: 1,
    backgroundColor: '#F4F3F8',
  },
  gridViewWrap2: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
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
export default connect(mapStateToProps, mapDispatchToProps)(LiangMianPage)
