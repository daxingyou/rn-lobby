import React, { Component } from 'react'
import { Vibration, StyleSheet, View, Text,  Dimensions, Image} from 'react-native'
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
import { HaoMaPeiLv } from '../../components/HaoMaPeiLv'

const windowWidth = Dimensions.get('window').width
const Layout = layout[6]
const objData = Layout
const groupTitle = Layout.totleTitle

class LianMaPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      betInput: '2',
      isRecentLotteryVisible: false,
      isModalVisible: false,
      btnStateArrKeeping: objData,
      keepingCount: 0,
      money: 0,
      sendAction: {gameNum: 7},
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
    const series = [4,3,3,2,2,2][index]
    let combination = []
    if(nums && nums.length >= series ) {
      for(let a = 0; a < nums.length - (series - 1); a++) {
        for(let b = a + 1; b < nums.length - (series - 2); b++) {
          let com = nums[a] + ',  ' + nums[b]
          if (series > 2) {
            for(let c = b + 1; c < nums.length - (series - 3); c++) {
              let com_1 = com + ',  ' + nums[c]
              if (series > 3) {
                for(let d = c + 1; d < nums.length - (series - 4); d++) {
                  let com_2 = com_1 + ',  ' + nums[d]
                  combination.push(com_2)
                }
              } else {
                combination.push(com_1)
              }
            }
          } else {
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
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction: {gameNum: 7}, keepingCount: 0 })
  }
  _onPressRecentLottery() {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm() {
    const  typeArr = {"CH_4":"四全中", "CH_3":"三全中", "CH_32":"三中二", "CH_2":"二全中", "CH_2S":"二中特", "CH_2SP":"特串"}
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    let commitToDetails = {}
    sendAction.money = this.state.betInput
    sendAction.zuhe = this.state.zuhe
    sendAction.name = Layout.name
    sendAction.odds = this.state.rate[this.state.activeTab]
    sendAction.model = Object.keys(this.props.resData)[this.state.activeTab]
    commitToDetails.sendAction = sendAction

    switch(Object.keys(typeArr)[this.state.activeTab]){
      case "CH_4":
      if(sendAction.orders.length<4){
        toastShort('尚未选满4个球号')
        return
      }
      case "CH_3":
      if(sendAction.orders.length<3){
        toastShort('尚未选满3个球号')
        return
      }
      case "CH_32":
      if(sendAction.orders.length<3){
        toastShort('尚未选满3个球号')
        return
      }
      case "CH_2":
      if(sendAction.orders.length<2){
        toastShort('尚未选满2个球号')
        return
      }
      case "CH_2S":
      if(sendAction.orders.length<2){
        toastShort('尚未选满2个球号')
        return
      }
      case "CH_2SP":
      if(sendAction.orders.length<2){
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
    sendAction["orders"] = sendAction["orders"] || []
    if (item.isSelected === undefined || item.isSelected === false) {

       if (sendAction["orders"].length>=10){ toastShort("最多只能选10个球");return }
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
          zuhe: this.getCombination(sendAction.orders,this.state.activeTab),
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
        gameNum: 7,
      },
      keepingCount: 0,
    }, () => {
      this.props.phoneSettings.shake && Vibration.vibrate()
      const tempBtnStateArrKeeping = Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
      const nums = [4, 3, 3, 2, 2, 2]
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
    const rate = this.state.rate[this.state.activeTab]
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.rateContent}>
            <ScrollableTabView page={this.state.activeTab} renderTabBar={() => <SelectedTab textArr={groupTitle} />}
                               onChangeTab={(tab)=> { this._onPressCancelInput();this.setState({activeTab: tab.i}, () => {this.props.onChangeTab && this.props.onChangeTab(tab.i)})  }}>
              {
                this.state.btnStateArrKeeping.totleTitle.map((item, index) => {
                  item.rate = rate
                  return(
                    <View key={index} style={styles.rateContent2}>
                      <View style={styles.contentMsg}>
                        <Image style={styles.msgImg} source={require('../../src/img/ic_ring_red.png')}/>
                        <Text style={styles.msgText}>必须选满{[4,3,3,2,2,2][index]}个球</Text>
                      </View>
                      <HaoMaPeiLv />
                      <View style={styles.gridViewWrap}>
                        <GridView
                          style={styles.gridView}
                          items={this.state.btnStateArrKeeping.data}
                          callback={this._onPressItem}
                          itemsPerRow={5}
                          rate = {rate}
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
    marginTop: 8,
    paddingBottom: 10,
    width: windowWidth,
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

export default connect(mapStateToProps, mapDispatchToProps)(LianMaPage)
