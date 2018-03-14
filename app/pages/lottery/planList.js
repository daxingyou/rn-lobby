import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  initPlanList,
  setMultiple,
  clearPlanList,
  getBetCountdown,
  removeCurrentIssue,
} from '../../actions'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  ListView,
  TextInput,
  Switch,
  TouchableOpacity,
  BackAndroid,
  Platform,
  Alert,
  Dimensions,
} from 'react-native'
import LotteryNavBar from '../../components/lotteryNavBar'
import Countdown from '../../components/countdown'
import PlanItem from './planItem'
import { MathAdd, MathMul } from '../../utils'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
const winWidth = Dimensions.get('window').width

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const inputs = [
  [
    {beforeInput: '追号', afterInput: '期数'},
    {beforeInput: '起始', afterInput: '倍数'},
  ],
  [
    {beforeInput: '每隔', afterInput: '期'},
    {beforeInput: '倍数*', afterInput: ''},
  ],
]

class PlanList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      falseSwitchIsOn: false,
      isBetting: false,
      periods: 10,
      mutiple: 1,
      interval: 2,
      intervalMultiple: 2,
      tab: 1,
    }
  }

  componentDidMount() {
    if (Platform.OS !== 'ios') {
      BackAndroid.addEventListener('hardwareBackPress', this.backFun)
    }
    InteractionManager.runAfterInteractions(() => {
      this.props.initPlanList(10, 1)
    })
  }

  componentWillReceiveProps(nextProps) {
    const { periods, mutiple, interval, intervalMultiple } = this.state
    if (this.props.issueList.length !== nextProps.issueList.length) {
      if (this.state.tab === 1) {
        this.props.initPlanList(periods, mutiple)
      } else {
        this.props.initPlanList(periods, mutiple, interval, intervalMultiple)
      }
    }
  }

  componentDidUpdate() {
    const { orderList, navigation } = this.props
    if (orderList && orderList.length <= 0) {
      navigation.goBack()
    }
  }

  backFun = () => {
    const { navigation, clearPlanList, planList } = this.props
    if (planList && planList.length > 0) {
      clearPlanList()
    }
    navigation.goBack()
  }

  onChangeText = (title, level, text) => {
    const { periods, mutiple, interval, intervalMultiple } = this.state
    const { initPlanList } = this.props
    const value = Number(text.replace('.', ''))
    let intervalValue = 0
    let intervalMultipleValue = 0
    if (level === '高级追号') {
      intervalValue = interval
      intervalMultipleValue = intervalMultiple
    }
    if (title === '追号') {
      this.setState({periods: value})
      initPlanList(text, mutiple, intervalValue, intervalMultipleValue)
    } else if (title === '起始') {
      this.setState({mutiple: value})
      initPlanList(periods, text, intervalValue, intervalMultipleValue)
    } else if (title === '每隔') {
      this.setState({interval: value})
      initPlanList(periods, mutiple, text, intervalMultipleValue)
    } else {
      this.setState({intervalMultiple: value})
      initPlanList(periods, mutiple, intervalValue, text)
    }
  }

  value = (title) => {
    const { periods, mutiple, interval, intervalMultiple } = this.state
    if (title === '追号') {
      return periods
    } else if (title === '起始') {
      return mutiple
    } else if (title === '每隔') {
      return interval
    } else {
      return intervalMultiple
    }
  }

  render() {
    const { periods, mutiple, interval, intervalMultiple } = this.state
    const { navigation, planList, orderInfo, initPlanList, setMultiple, orderList,
      clearPlanList, lotteryInfo, removeCurrentIssue, countdownOver } = this.props
    const { betting } = navigation.state.params
    let totalBetNum = 0, orderTotalPrice = 0, totalPrice = 0
    if (orderList && orderList.length > 0) {
      for (let order of orderList) {
        orderTotalPrice = MathAdd(orderTotalPrice, order.totalPrice)
      }
    }
    if (planList && planList.length > 0) {
      for (let plan of planList) {
        totalBetNum += 1
        totalPrice = MathAdd(totalPrice, MathMul(orderTotalPrice, plan.multiple))
      }
    }
    return (
      <View style={{flex: 1}}>
        <LotteryNavBar
          navigation={navigation}
          backFun={this.backFun}
          title={'智能追号'}/>
        <Countdown
          data={lotteryInfo}
          simpleMode={'A'}
          removeCurrentIssue={removeCurrentIssue}
          countdownOver={() => countdownOver(orderInfo.lotteryId)}
          categoryId={orderInfo.categoryId}/>
        <View style={{flex: 1}}>
          <ScrollableTabView
            style={{backgroundColor: '#FFF'}}
            tabBarTextStyle={{fontSize: 17}}
            tabBarInactiveTextColor='#666'
            tabBarUnderlineStyle={{backgroundColor: Config.baseColor}}
            tabBarActiveTextColor={Config.baseColor}
            renderTabBar={() => <ScrollableTabBar/>}
            onChangeTab={(tab) => {
              this.setState({ tab })
              tab.i === 0 ?
                initPlanList(periods, mutiple) :
                initPlanList(periods, mutiple, interval, intervalMultiple)
            }}>
            {
              [
                {tabLabel: '普通追号', inputs: [inputs[0]]},
                {tabLabel: '高级追号', inputs: inputs},
              ].map((tab, index) => (
                <View
                  key={index}
                  tabLabel={tab.tabLabel}
                  style={styles.wrap}>
                  {
                    tab.inputs.map((row, index) => (
                      <View key={index} style={styles.query}>
                        {
                          row.map((query, index) => (
                            <View key={index} style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                              <Text style={styles.queryText}>{query.beforeInput}</Text>
                              <TextInput underlineColorAndroid='transparent'
                                         style={styles.input}
                                         keyboardType={'numeric'}
                                         maxLength={2}
                                         value={this.value(query.beforeInput).toString()}
                                         onChangeText={(text) => this.onChangeText(query.beforeInput, tab.tabLabel, text)}/>
                              <Text style={styles.queryText}>{query.afterInput}</Text>
                            </View>
                          ))
                        }
                      </View>
                    ))
                  }
                  <View style={styles.table}>
                    <View style={styles.theader}>
                      {
                        ['期数', '倍数', '金额', '预计开奖时间'].map((title, index) => (
                          <Text key={index} style={{flex: index === 2 ? 1 : 3, textAlign: 'center', fontSize: 14, color: '#666666'}}>
                            {title}
                          </Text>
                        ))
                      }
                    </View>
                    {
                      planList && planList.length > 0 ? (
                        <ListView
                          removeClippedSubviews={false}
                          style={styles.tbody}
                          dataSource={ds.cloneWithRows(planList)}
                          renderRow={(rowData, sectionID, rowID) =>
                            <PlanItem
                              data={rowData}
                              index={rowID}
                              orderTotalPrice={orderTotalPrice}
                              setMultiple={setMultiple}/>}/>
                      ) : null
                    }
                  </View>
                </View>
              ))
            }
          </ScrollableTabView>
        </View>
        <View style={styles.bottom}>
          <View style={{paddingLeft: 10}}>
            <Switch
              onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
              value={this.state.falseSwitchIsOn} />
          </View>
          <View style={styles.total}>
            <Text style={{fontSize: 14, color: '#000000'}}>
              中奖后停止追号
            </Text>
            <Text style={{fontSize: 14, color: '#000000'}}>
              <Text  style={{fontSize: 14, color: Config.baseColor}}>
                {totalBetNum}
              </Text>
              注
              <Text  style={{fontSize: 14, color: Config.baseColor}}>
                {totalPrice || 0}
              </Text>
              元
            </Text>
          </View>
          <View style={styles.confirm}>
            <TouchableOpacity
              underlayColor='transparent'
              disabled={this.state.isBetting}
              onPress={() => {
                Sound.stop()
                Sound.play()
                if (periods === 0 || mutiple === 0 || interval === 0 || intervalMultiple === 0) {
                  Alert.alert('', '输入值不能为0', [
                    {text: '确定'},
                  ])
                } else {
                  this.setState({
                    isBetting: true,
                  }, () => {
                    betting(planList, this.state.falseSwitchIsOn, (needClear = true) => {
                      if (needClear) {
                        clearPlanList()
                      }
                      this.setState({
                        isBetting: false,
                      })
                    })
                  })
                }
              }}>
              <View style={styles.btn}>
                <Text style={{fontSize: 16, color: '#FFFFFF', letterSpacing: 1.37}}>
                  {this.state.isBetting ? '投注中' : '投注'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  query: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  queryText: {
    fontSize: 14,
    color: "#666",
    width: winWidth<375 ? 29 : 40,
  },
  input: {
    padding: 0,
    width: winWidth<375 ? 60 : 80,
    height: 30,
    fontSize: 17,
    color: '#000000',
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  table: {
    flex: 1,
  },
  theader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F5F8',
  },
  bottom: {
    height: 50,
    backgroundColor: '#FBFBFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  confirm: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  btn: {
    backgroundColor: Config.baseColor,
    width: 60,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const mapStateToProps = ({ planList, orderInfo, orderList, issueList, lotteryInfo }) => (
  {
    planList,
    orderInfo,
    orderList,
    issueList,
    lotteryInfo,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    dispatch,
    initPlanList: (periods, multiple, interval, intervalMultiple) => {
      dispatch(initPlanList(periods, multiple, interval, intervalMultiple))
    },
    setMultiple: (index, multiple) => {
      dispatch(setMultiple(index, multiple))
    },
    clearPlanList: () => {
      dispatch(clearPlanList())
    },
    removeCurrentIssue: (currentIssue) => {
      dispatch(removeCurrentIssue(currentIssue))
    },
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(PlanList)
