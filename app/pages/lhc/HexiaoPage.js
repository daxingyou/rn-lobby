import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions,
    ScrollView, TouchableOpacity, Vibration } from 'react-native'
import RNShakeEventIOS from '../../components/github/RNShakeEventIOS'
import { ButtonItem } from '../../components/LHCrenderBall'
import { toastShort } from '../../utils/toastUtil'
import layout from './layout' // 数据源
import SelectedTab from '../../components/LHCselectedTab'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import BuyBar from '../../components/LHCbuyBar'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { ADDLHClistItem } from '../../actions'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import { MathAdd, MathDiv, MathSub, subNumber } from '../../utils'
import ButtonIos from '../../components/ButtonIos'

const windowWidth = Dimensions.get('window').width
const widthBallWrap = windowWidth * 8 / 60
const Layout = layout[11]
const objData = Layout
const groupTitle = Layout.totleTitle

class HeXiaoPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      betInput: '2',
      isRecentLotteryVisible: false,
      isModalVisible: false,
      btnStateArrKeeping: objData,
      money: 0,
      sendAction: {gameNum: 14},
      activeTab: 0,
      rate: [],
      odds: 0,
      selectedItemIndex: 0,
      zuhe: 0,
    }
  }
  componentWillMount() {
    if (this.props.phoneSettings.shakeitoff) {
      RNShakeEventIOS.addEventListener('shake', () => {
        this._onPressRandom()
      })
    }

    const resData = Immutable.fromJS(this.props.resData).toJS()

    const resObj = {}
    Object.keys(resData).map((v)=>{
      resObj[v] = resData[v]
    })

    objData.items.map((item)=>{
      item.data.map((v)=>{
        v.rate = resObj[v.name] / 1000
      })
    })
  }
  componentDidMount() {
    this.props.callBack(this._onPressRandom)
  }
  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake')
  }

  _onChangeText = (betInput) => {
    this.setState({betInput})

  }
  _onPressCancelInput = () => {
    this.setState({ btnStateArrKeeping: objData, odds: 0,sendAction: {gameNum: 14}, selectedItemIndex: 0 })
  }
  _onPressRecentLottery = () => {
    this.setState({ isRecentLotteryVisible: !this.state.isRecentLotteryVisible })
  }
  _onPressConfirm = () => {
    this._onPressCancelInput()
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    let commitToDetails = {}
    sendAction.money = this.state.betInput
    for (let key of Object.keys(sendAction.orders)) {
      sendAction.orders[key].money = this.state.betInput
    }
    sendAction.name = Layout.name
    sendAction.model = Layout.tabs[this.state.activeTab]
    sendAction.odds = this.state.odds
    commitToDetails.sendAction = sendAction
    this.props.ADDLHClistItem(commitToDetails)
    this.props.navigation.navigate('BetDetailsPage')

  }

  _rate = (item) => {
    const playArr = this.props.resData
    let defaultItem = this.state.sendAction && Object.keys(this.state.sendAction.orders).length > 0 ? this.state.sendAction.orders : {}
    let odds = 0, selectedTotal = 0, coefficient = Object.keys(defaultItem).length,
      selectedTotal2 = 0

    Object.keys(defaultItem).forEach((v) => {
      if (defaultItem && Object.keys(defaultItem).length > 0) {
        selectedTotal += Number(defaultItem[v].odds)
        if (item.title === '中') {
          coefficient = Object.keys(defaultItem).length
          odds = subNumber(MathDiv(MathDiv(MathDiv(selectedTotal, coefficient), coefficient), 1000), 3)
        } else {
          let total = 0
          Object.keys(playArr).map((key) => {
            total = MathAdd(total, Number(playArr[key]))
          })
          selectedTotal2 = MathSub(total, selectedTotal)
          coefficient = 12 - Object.keys(defaultItem).length
          odds = subNumber(MathDiv(MathDiv(MathDiv(selectedTotal2, coefficient), coefficient), 1000), 3)
        }
      }
    })
    this.setState({odds: odds})
  }

  _onPressItem = (item) => { // 点击选中玩法
    const maxNums = this.state.activeTab === 0? 11:10
    let sendAction = Immutable.fromJS(this.state.sendAction).toJS()
    sendAction['orders'] = sendAction['orders'] || {}
    if (item.isSelected === undefined || item.isSelected === false) {
      sendAction.money = this.state.betInput
      sendAction.title = item.totleTitle
      if(Object.keys(sendAction['orders']).length >= maxNums){
        toastShort(`最多只能选${maxNums}个球`)
        return
      }

      sendAction['orders'][item.name] = sendAction['orders'][item.name] || {}
      sendAction['orders'][item.name]['label'] = item.label
      sendAction['orders'][item.name]['title'] = item.title
      sendAction['orders'][item.name]['money'] = this.state.betInput
      sendAction['orders'][item.name]['odds'] = this.props.resData[item.name]
    } else {
      delete sendAction["orders"][item.name]
    }
    this.setState({
      sendAction: sendAction,
    },()=>{
      this._rate(item)
    })

    const tempKeeping = Immutable.fromJS(this.state.btnStateArrKeeping).toJS()
    tempKeeping.items.forEach((itemArr) => {
      itemArr.data.forEach((objItem) => {
        if ((objItem.label === item.label)) {
          objItem.isSelected = !objItem.isSelected
          this.setState({ btnStateArrKeeping: tempKeeping })
        }
      })
    })
  }
  onPressSelectedItem = (index) => {
    const aData =  this.state.btnStateArrKeeping.items[this.state.activeTab].data
    const defaultItemList = {
      1: [0, 2, 3, 4, 5, 8],
      2: [1, 6, 7, 9, 10, 11],
      3: [1, 3, 5, 7, 9, 11],
      4: [0, 2, 4, 6, 8, 10],
      5: [0, 1, 2, 3, 4,5],
      6: [6, 7, 8, 9, 10, 11],
      7: [1, 3, 4, 6, 8, 11],
      8: [0, 2, 5, 7, 9, 10],
    }
    this._onPressCancelInput()
    if(this.state.selectedItemIndex !== index){
      this.setState({
        selectedItemIndex: index,
      },()=>{
        defaultItemList[index].map((item)=>{
          let data = aData[item]
          data.isSelected = false
        setTimeout(()=>{
          this._onPressItem(data)
        },0)
      })
      })
    }

  }
  _onPressRandom = () => {
    this.setState({
      btnStateArrKeeping: objData,
      sendAction: {
        gameNum: 14,
      },
    }, () => {
      this.props.phoneSettings.shake && Vibration.vibrate()
      const tempBtnStateArrKeeping = Immutable.fromJS(this.state.btnStateArrKeeping.items).toJS()
      const activeTab = this.state.activeTab
      const random2 = Math.round(Math.random() * (tempBtnStateArrKeeping[activeTab].data.length - 1)) || 0

      this._onPressItem(tempBtnStateArrKeeping[activeTab].data[random2], tempBtnStateArrKeeping[activeTab])
    })
  }

  _renderGridItem1 = (item) => { // 5行
    const isSelect = item.isSelected
    return (
      <ButtonIos
        key={item.number}
        flexOrientation='column'
        wrapBallStyle={[styles.wrapBall, isSelect ?{ backgroundColor: Config.baseColor }:{ backgroundColor: '#FFF' }]}
        containerStyle={styles.grid5Btn}
        styleTextLeft={isSelect ? { color: '#FFF',fontSize: 21 } : { color: '#000',fontSize: 21}}
        styleTextRight={{ color: '#FF0000',fontSize: 11, marginTop: 2 }}
        text={item.number + " " + this.state.rate[this.state.activeTab]}
        onPress={() => {
          Sound.stop()
          Sound.play()
          this._onPressItem(item
          )}}/>
    )
  }
  _renderGridItem2 = (item) => { // 3行
    const isSelect = item.isSelected

    return (
      <ButtonIos
        key={item.label}
        flexOrientation='column'
        containerStyle={[styles.grid3Btn, isSelect ? { backgroundColor: Config.baseColor } : { backgroundColor: '#FFF' }]}
        styleTextLeft={isSelect ? { color: '#FFF',fontSize: 20 } : { color: 'black',fontSize: 20 }}
        styleTextRight={isSelect ? { color: '#FFF',marginTop: 5,fontSize: 18 } : { color: '#FF0000',marginTop: 5,fontSize: 18 }}
        text={item.label + " " + 1000}
        onPress={() => {
          Sound.stop()
          Sound.play()
          this._onPressItem(item)
        }}/>
    )
  }

  render() {
    const resData = this.props.resData
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.rateContent}>
            <View style={styles.ORate}>
              <Text style={styles.ORateText}>赔率：{this.state.odds}</Text>
            </View>
            <ScrollableTabView page={this.state.activeTab} renderTabBar={() => <SelectedTab textArr={groupTitle} />}
                               onChangeTab={(tab)=>{
                                 this._onPressCancelInput()
                                 this.setState({activeTab: tab.i}, () => {this.props.onChangeTab && this.props.onChangeTab(tab.i)})
                               }}>
              {
                    this.state.btnStateArrKeeping.items.map((item, index) => {
                      return (
                        <View style={{flex:1}} key={index}>
                        <View style={styles.selectedListWrap}>
                            <View style={styles.selectedList}>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(1)
                              }}>
                                <Text style={this.state.selectedItemIndex === 1?styles.selectedItem2:styles.selectedItem}>野兽</Text>
                              </TouchableOpacity>
                              <Text style={styles.selectedLine}>|</Text>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(2)
                              }}>
                                <Text style={this.state.selectedItemIndex === 2?styles.selectedItem2:styles.selectedItem}>家禽</Text>
                              </TouchableOpacity>
                              <Text style={styles.selectedLine}>|</Text>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(3)
                              }}>
                                <Text style={this.state.selectedItemIndex === 3?styles.selectedItem2:styles.selectedItem}>单</Text>
                              </TouchableOpacity>
                              <Text style={styles.selectedLine}>|</Text>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(4)
                              }}>
                                <Text style={this.state.selectedItemIndex === 4?styles.selectedItem2:styles.selectedItem}>双</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.selectedList}>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(5)
                              }}>
                                <Text style={this.state.selectedItemIndex === 5?styles.selectedItem2:styles.selectedItem}>前肖</Text>
                              </TouchableOpacity>
                              <Text style={styles.selectedLine}>|</Text>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(6)
                              }}>
                                <Text style={this.state.selectedItemIndex === 6?styles.selectedItem2:styles.selectedItem}>后肖</Text>
                              </TouchableOpacity>
                              <Text style={styles.selectedLine}>|</Text>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(7)
                              }}>
                                <Text style={this.state.selectedItemIndex === 7?styles.selectedItem2:styles.selectedItem}>天肖</Text>
                              </TouchableOpacity>
                              <Text style={styles.selectedLine}>|</Text>
                              <TouchableOpacity onPress={() => {
                                Sound.stop()
                                Sound.play()
                                this.onPressSelectedItem(8)
                              }}>
                                <Text style={this.state.selectedItemIndex === 8?styles.selectedItem2:styles.selectedItem}>地肖</Text>
                              </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView contentContainerStyle={{alignItems:'center'}} automaticallyAdjustContentInsets={false} horizontal={false}>
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
                        </View>
                      )
                    })
                  }
            </ScrollableTabView>
          </View>
              <BuyBar randomOrder={this.props.randomOrder} navigation={this.props.navigation} type={2}
zuhe={1} sendAction={this.state.sendAction} betInput={this.state.betInput}
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
  },
  ORate: {
    position: 'absolute',
    zIndex: 1,
    right: 10,
    top: 10,
    backgroundColor: '#FFD5D6',
    padding: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 10,
  },
  ORateText: {
    fontSize:14,
    textAlign:'center',
    color: Config.baseColor,
  },
  selectedListWrap: {
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#B0B0B0',
  },
  selectedList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  selectedItem: {
    width: 50,
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
  },
  selectedItem2: {
    width: 50,
    color: '#ff0000',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
  },
  selectedLine: {
    color: '#D8D8D8',
  },
  oneGroupWrap: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  grid3Btn: {
    borderWidth: 1,
    borderRadius: 6,
    margin: 14,
    marginTop: 0,
    paddingTop: 8,
    paddingBottom: 8,
    width: windowWidth / 4.5,
    height: windowWidth / 5.5,
    borderColor: '#CCC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#CCC',
    shadowOpacity: 0.6,
    shadowOffset: {height:3},
  },
  grid5Btn: {
    height: widthBallWrap +8,
    width: widthBallWrap+8,
    borderColor: Config.baseColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapBall: {
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor:'#CCC',
    shadowOpacity: 0.6,
    shadowOffset: {height:1},
  },
})

const mapStateToProps = (state) => {
  const { LHCbetDetails } = state
  const { phoneSettings } = state.phone
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

export default connect(mapStateToProps, mapDispatchToProps)(HeXiaoPage)
