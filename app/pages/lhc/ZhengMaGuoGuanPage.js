import React, { Component } from 'react'
import { Vibration, StyleSheet, View, Text, Dimensions, Image, ScrollView } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { _renderGridItem2 } from '../../components/LHCrenderBall'
import GridView from '../../components/GridView'
import { toastShort } from '../../utils/toastUtil'
import layout from './layout' // 数据源
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'

const windowWidth = Dimensions.get('window').width
const objData = layout[5].items

class ZhengMaGuoGuan extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isRecentLotteryVisible: false,
      betInput: '2',
      isModalVisible: false,
      btnStateArrKeeping: objData,
      keepingCount: 0,
      activeTab: 0,
      money: 0,
      sendAction: {gameNum: 6},
      zuhe: 0,
    }
    this._onPressRecentLottery = this._onPressRecentLottery.bind(this)
    this._onPressCancelInput = this._onPressCancelInput.bind(this)
    this._onPressItem = this._onPressItem.bind(this)
    this._onPressConfirm = this._onPressConfirm.bind(this)
    this._onChangeText = this._onChangeText.bind(this)
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
    this.setState({ btnStateArrKeeping: objData, money: "", sendAction:{gameNum: 6}, keepingCount: 0 })
  }
   _onPressRecentLottery() {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm() {
      this.state.sendAction.orders && Object.keys(this.state.sendAction.orders).length>1?(()=>{
      let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
      let commitToDetails = {}
      sendAction.money = this.state.betInput
      for (let key of Object.keys(sendAction.orders)) {
        sendAction.orders[key].money = this.state.betInput
      }
      sendAction.name = layout[5].name
      commitToDetails.sendAction = sendAction
      this.props.ADDLHClistItem(commitToDetails)
      this.props.navigation.navigate('BetDetailsPage')
      this._onPressCancelInput()
    })():toastShort('必须两组以上玩法')
  }
  _onPressItem(item) { // 点击选中玩法
    if (item.isSelected === undefined || item.isSelected === false) {
      this.setState({ keepingCount: this.state.keepingCount + 1 })
      let sendAction = this.state.sendAction
      sendAction["orders"] = sendAction["orders"] || {}
      sendAction["orders"][item.name] = sendAction["orders"][item.name] || {}
      sendAction["orders"][item.name].money = this.state.betInput
      sendAction["orders"][item.name].odds = item.rate
      sendAction["orders"][item.name].label = item.label
      sendAction["orders"][item.name].title = item.title
      sendAction.money = this.state.betInput
      this.setState({
        sendAction: sendAction,
        zuhe: Object.keys(sendAction.orders).length,
      })
    } else {

      this.setState({ keepingCount: this.state.keepingCount - 1 })
      let sendAction = this.state.sendAction
      sendAction["orders"] = sendAction["orders"] || {}
      delete sendAction["orders"][item.name]
      this.setState({
        sendAction: sendAction,
        zuhe: Object.keys(sendAction.orders).length,
      })
    }

    const tempKeeping = JSON.parse(JSON.stringify(this.state.btnStateArrKeeping))
    tempKeeping.forEach((itemArr) => {
      itemArr.data.forEach((objItem) => {
        if ( objItem.name === item.name ) {
          objItem.isSelected = !objItem.isSelected
          this.setState({ btnStateArrKeeping: tempKeeping })
        }
        if( (objItem.name !== item.name) && (objItem.name.match(/.+(?=_)/i)[0] === item.name.match(/.+(?=_)/i)[0]) && objItem.isSelected === true ){
          objItem.isSelected = false
          this.setState({ btnStateArrKeeping: tempKeeping })
          let sendAction = this.state.sendAction
          sendAction["orders"] = sendAction["orders"] || {}
          delete sendAction["orders"][objItem.name]
          this.setState({
            sendAction: sendAction,
          })
        }
      })
    })
  }

  _onPressRandom() {
    this.setState({ btnStateArrKeeping: objData, sendAction:{gameNum: 6}, keepingCount: 0 },()=>{
      this.props.phoneSettings.shake && Vibration.vibrate()
      const tempBtnStateArrKeeping =  Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
      const random1List = []
      while (random1List.length < 2) {
        let random1 = Math.round(Math.random()*(tempBtnStateArrKeeping.length-1)) || 0
        if (!random1List.includes(random1)) {
          random1List.push(random1)
        }
      }
      random1List.forEach((v)=>{
        const random2 = Math.round(Math.random()*(tempBtnStateArrKeeping[v].data.length-1))
        setTimeout(()=>{
          this._onPressItem(tempBtnStateArrKeeping[v].data[random2])
        },0)
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
            <View style={styles.contentWrap}>
              <ScrollView>
                <View style={styles.contentMsg}>
                  <Image style={styles.msgImg} source={require('../../src/img/ic_ring_red.png')}/>
                  <Text style={styles.msgText}>必须二组以上玩法</Text>
                </View>
                  {
                    this.state.btnStateArrKeeping.map((item, index) => {
                      return (
                        <View key={index} style={[styles.oneGroupWrap]}>
                          <View style={styles.itemNameWrap}>
                            <View style={styles.itemName}>
                              <Text style={styles.itemNameText}>{item.name}</Text>
                            </View>
                          </View>
                          <View key={index} style={[styles.gridViewWrap2, { height: item.gridHeight }]}>
                            <GridView
                              style={styles.gridView}
                              items={item.data}
                              callback={this._onPressItem}
                              this={this}
                              itemsPerRow={4}
                              renderItem={_renderGridItem2} />
                          </View>
                        </View>
                      )
                    })
                  }
              </ScrollView>
            </View>
              <BuyBar randomOrder={this.props.randomOrder} zuhe={this.state.zuhe} navigation={this.props.navigation}
type={1} sendAction={this.state.sendAction} betInput={this.state.betInput}
onPressCancelInput={this._onPressCancelInput} onChangeText={this._onChangeText} onPressConfirm={this._onPressConfirm} />
        </View>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  itemNameWrap: {
    width: windowWidth,
  },
  itemName : {
    marginLeft: 15,
    width: 60,
    marginBottom: 5,
    borderRadius: 4,
    backgroundColor: '#FFD5D6',
  },
  itemNameText: {
    textAlign: 'center',
    paddingVertical: 4,
    fontSize: 12,
    color: 'red',
    backgroundColor: 'transparent',
  },
  contentWrap: {
    flex: 1,
  backgroundColor: '#FFF',
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
   gridViewWrap2: {
     width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridView: {
    flex: 1,
  },
  oneGroupWrap: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(ZhengMaGuoGuan)
