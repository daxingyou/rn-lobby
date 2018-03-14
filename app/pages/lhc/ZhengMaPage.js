import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Vibration } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { _renderGridItem1 } from '../../components/LHCrenderBall'
import GridView from '../../components/GridView'
import layout from './layout' // 数据源
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import { HaoMaPeiLv } from '../../components/HaoMaPeiLv'
import ButtonIos from '../../components/ButtonIos'

const windowWidth = Dimensions.get('window').width
const widthBallWrap = windowWidth * 8 / 60
const objData = layout[2].items


class ZhengMaPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      betInput: '2',
      isRecentLotteryVisible: false,
      isModalVisible: false,
      btnStateArrKeeping: objData,
      keepingCount: 0,
      money: 0,
      sendAction: {gameNum: 3},
      activeTab: 0,
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
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction: {gameNum: 3}, keepingCount: 0 })
  }
   _onPressRecentLottery() {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm() {
    this._onPressCancelInput()
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    let commitToDetails = {}
    sendAction.money = this.state.betInput
    for (let key of Object.keys(sendAction.orders)) {
      sendAction.orders[key].money = this.state.betInput
    }
    sendAction.name = layout[2].name
    commitToDetails.sendAction = sendAction

    this.props.ADDLHClistItem(commitToDetails)
    this.props.navigation.navigate('BetDetailsPage')
  }
  _onPressItem(item) { // 点击选中玩法
    if (item.isSelected === undefined || item.isSelected === false) {
      this.setState({ keepingCount: this.state.keepingCount + 1 })
      let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
      sendAction["orders"] = sendAction["orders"] || {}
      sendAction["orders"][item.name] = sendAction["orders"][item.name] || {}
      sendAction["orders"][item.name].money = this.state.betInput
      sendAction["orders"][item.name].odds = item.rate
      sendAction["orders"][item.name].label = item.label
      sendAction["orders"][item.name].title = item.title
      this.setState({
        sendAction: sendAction,
      })
    } else {
      this.setState({ keepingCount: this.state.keepingCount - 1 })
      let sendAction = this.state.sendAction
      sendAction["orders"] = sendAction["orders"] || {}
      delete sendAction["orders"][item.name]
      this.setState({
        sendAction: sendAction,
      })
    }

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
    this.setState({ btnStateArrKeeping: objData, sendAction:{gameNum: 3}, keepingCount: 0 },()=>{
      this.props.phoneSettings.shake && Vibration.vibrate()
      const tempBtnStateArrKeeping =  Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
      const random1 = Math.round(Math.random()*(objData.length-1)) || 0
      const random2 = Math.round(Math.random()*(objData[random1].data.length-1)) || 0
      this._onPressItem(tempBtnStateArrKeeping[random1].data[random2], tempBtnStateArrKeeping[random1])
    })
  }

  _renderGridItem1(item) { // 5行
    const isSelect = item.isSelected
    return (
      <ButtonIos
        key={item.label}
        flexOrientation='column'
        wrapBallStyle={[styles.wrapBall, isSelect ?{ backgroundColor: Config.baseColor }:{ backgroundColor: '#FFF' }]}
        containerStyle={styles.grid5Btn}
        styleTextLeft={isSelect ? { color: '#FFF',fontSize: 21 } : { color: '#000',fontSize: 21}}
        styleTextRight={{ color: '#FF0000',marginTop: 2,fontSize: 12 }}
        text={item.label + " " + item.rate}
        onPress={() => {Sound.stop();Sound.play();this._onPressItem(item)}}/>
    )
  }
  _renderGridItem2(item) { // 3行
    const isSelect = item.isSelected
    return (
      <ButtonIos
        key={item.label}
        flexOrientation='column'
        containerStyle={[styles.grid3Btn, isSelect ? { backgroundColor: Config.baseColor } : { backgroundColor: '#FFF' }]}
        styleTextLeft={isSelect ? { color: '#FFF', fontSize: 19 } : { color: 'black', fontSize: 19 }}
        styleTextRight={isSelect ? { color: '#FFF',marginTop: 5 } : { color: '#FF0000',marginTop: 5 }}
        text={item.label + " " + item.rate}
        onPress={() => {Sound.stop();Sound.play();this._onPressItem(item)}}/>
    )
  }

  render() {
    const { sendAction, betInput } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.rateContent}>
              {
                this.state.btnStateArrKeeping.map((item, index) => {
                    return (
                      <View key={index} style={[styles.gridViewWrap, { height: widthBallWrap * 10 + 10 }]}>
                        <HaoMaPeiLv />
                          <GridView
                            style={styles.gridView}
                            items={item.data}
                            callback={this._onPressItem}
                            itemsPerRow={5}
                            bottomStyle={styles.gridBottom}
                            renderItem={_renderGridItem1}/>
                      </View>
                    )
                })
              }
          </View>
              <BuyBar
                randomOrder={this.props.randomOrder}
                navigation={this.props.navigation}
                sendAction={sendAction}
                betInput={betInput}
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
    backgroundColor: '#FFF',
  },
  rateContent: {
    flex: 1,
  },
  gridViewWrap: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 2,
    paddingTop: 20,
    paddingBottom: 10,
  },
  gridView: {
    flex: 1,
  },
  grid3Btn: {
    borderWidth: 1,
    borderRadius: 50,
    margin: 14,
    marginTop: 0,
    paddingTop: 8,
    paddingBottom: 8,
    width: windowWidth / 6,
    height: windowWidth / 6,
    borderColor: '#CCC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#CCC',
    shadowOpacity: 0.6,
    shadowOffset: {height:1},
  },
  grid5Btn: {
    flex: 1,
    width: widthBallWrap+10,
    borderColor: Config.baseColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  wrapBall: {
    borderColor: '#CCCCCC',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor:'#000000',
    shadowOpacity: 0.26,
    shadowOffset: {height:2},
    shadowRadius: 2,
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

export default connect(mapStateToProps, mapDispatchToProps)(ZhengMaPage)
