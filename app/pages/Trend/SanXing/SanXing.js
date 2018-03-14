import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  InteractionManager,
} from 'react-native'
import { addOrder } from '../../../actions/index'

import ScrollableTabView from 'react-native-scrollable-tab-view'
import STabCustom from '../../../components/github/STabCustom'
import GridView from './GridView'
import Config from '../../../config/global'
import LoadingView from '../../../components/LoadingView'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import BetSettings from '../../lottery/betSettings'
import Immutable from 'immutable'
import BetArea from '../common/BetArea'
import Countdown from '../../../components/countdown'
import { initialOrderState, resetOrderState } from '../../LotteryNew/main'
import { getTotal } from "../../../utils"

class Sanxing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      positionIndex: 0,
      showOrderSettings: false,
      playLabel: '前三组选',
      isFetching: true,
      orderInfo: {
        ...initialOrderState,
      },
      currentSubPlay: props.currentPlay.filter(n => n.name === 'sanxing')[0]
        .detail.filter(n => n.label === '前三组选')[0]
        .method.filter(n => n.label === '组三')[0],
    }
    this.tabs = [
      {
        label: '前三',
        action: 'frontThree',
      },
      {
        label: '中三',
        action: 'middleThree',
      },
      {
        label: '后三',
        action: 'backThree',
      },
    ]

    this.scrollView = {}
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getData(this.props.displayPeriods, this.props.dataSort)
    })
  }

  componentWillReceiveProps(nextProps) {
    const { displayPeriods, dataSort, selectedType, currentPlay } = this.props
    if (displayPeriods !== nextProps.displayPeriods || dataSort !== nextProps.dataSort) {
      this.getData(nextProps.displayPeriods, nextProps.dataSort)
    }
    if (!Immutable.is(Immutable.fromJS(currentPlay), Immutable.fromJS(nextProps.currentPlay))) {
      if (Array.isArray(nextProps.currentPlay) && nextProps.currentPlay.length > 0) {
        this.setState({
          currentSubPlay: nextProps.currentPlay.filter(n => n.name === 'sanxing')[0]
            .detail.filter(n => n.label === '前三组选')[0]
            .method.filter(n => n.label === '组三')[0],
        })
      }
    }
    if (selectedType !== nextProps.selectedType) {
      this.handleChangeTab(0, nextProps.selectedType)
    }

    if (this.props.displayPeriods > nextProps.displayPeriods) {
      for (const key of Object.keys(this.scrollView)) {
        this.scrollView[key].scrollTo({x: 0, y: 0, animated: false })
      }
    }
  }

  setRef = (ref, index) => {
    this.scrollView[index] = ref
  }

  setWinShow = () => {
    this.setState({
      showOrderSettings: !this.state.showOrderSettings,
    })
  }

  getData = (displayPeriods, dataSort) => {
    this.setState({ isFetching: true })

    fetchWithOutStatus({
      act: 10057,
      lotteryId: this.props.lotteryId,
      count: displayPeriods,
      sort: dataSort,
    }).then((res) => {
      if (res) {
        this.setState({
          data: res,
          isFetching: false,
        })
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  betConfirm = (rebate) => {
    const { navigation, currentPlay } = this.props
    const { playLabel, orderInfo, currentSubPlay } = this.state
    this.createOrder(rebate, playLabel, currentSubPlay.label)
    this.setState({
      showOrderSettings: false,
    }, () => {
      navigation.navigate('OrderList', {
        currentPlay,
        currentSubPlay: currentSubPlay,
        playName: playLabel,
        unit: orderInfo.unit,
        unitPrice: orderInfo.unitPrice,
      })

    })
  }

  createOrder = (rebate, playName, subPlayName) => {
    const { addOrder, lotteryInfo } = this.props
    const { orderInfo, currentSubPlay } = this.state
    addOrder([
      {
        ...orderInfo,
        playName,
        subPlayName,
        issue: lotteryInfo.issue,
        playId: currentSubPlay.play_id,
        odds: currentSubPlay.max_odds,
      },
    ])
    this.setState({
      orderInfo: {
        ...orderInfo,
        ...resetOrderState,
        select: [],
      },
    })
  }

  handleChangeTab = (positionIndex) => {
    const { currentPlay } = this.props
    let currentSubPlay = Immutable.fromJS(this.state.currentSubPlay).toJS()
    let playLabel = -1
    if (positionIndex === 0) {
      playLabel = currentPlay.filter(n => n.name === 'sanxing')[0]
        .detail.filter(n => n.label === '前三组选')[0].label
      currentSubPlay = currentPlay.filter(n => n.name === 'sanxing')[0]
        .detail.filter(n => n.label === '前三组选')[0].method.filter(n => n.label === '组三')[0]
    } else if (positionIndex === 1) {
      playLabel = currentPlay.filter(n => n.name === 'sanxing')[0]
        .detail.filter(n => n.label === '中三组选')[0].label
      currentSubPlay = currentPlay.filter(n => n.name === 'sanxing')[0]
        .detail.filter(n => n.label === '中三组选')[0].method.filter(n => n.label === '组三')[0]
    } else if (positionIndex === 2) {
      playLabel = currentPlay.filter(n => n.name === 'sanxing')[0]
        .detail.filter(n => n.label === '后三组选')[0].label
      currentSubPlay = currentPlay.filter(n => n.name === 'sanxing')[0]
        .detail.filter(n => n.label === '后三组选')[0].method.filter(n => n.label === '组三')[0]
    }
    this.setState({
      currentSubPlay,
      positionIndex,
      playLabel,
      orderInfo: {
        ...this.state.orderInfo,
        ...initialOrderState,
        select: [],
      },
    })
  }

  setSelect = (select, betNum) => {
    const { orderInfo } = this.state
    const { unit, unitPrice } = orderInfo
    this.setState({
      orderInfo: {
        ...orderInfo,
        select,
        betNum,
        totalPrice: getTotal(unit, betNum, unitPrice),
      },
    })
  }

  setUnitPrice = (unitPrice) => {
    const { orderInfo } = this.state
    const { betNum, unit } = orderInfo
    const totalPrice = getTotal(unit, betNum, unitPrice)
    this.setState({
      orderInfo: {
        ...orderInfo,
        unitPrice,
        totalPrice,
      },
    })
  }

  setUnit = (unit) => {
    const { orderInfo } = this.state
    const { betNum, unitPrice } = orderInfo
    const totalPrice = getTotal(unit, betNum, unitPrice)
    this.setState({
      orderInfo: {
        ...orderInfo,
        unit,
        totalPrice,
      },
    })
  }

  render() {
    const {
      navigation, lotteryInfo, removeCurrentIssue, lotteryId,
      countdownOver, fromBet, showMisData,
    } = this.props
    const { data, positionIndex, showOrderSettings, isFetching, orderInfo, currentSubPlay } = this.state
    if (isFetching) {
      return <LoadingView/>
    }
    return (
      <View style={{flex: 1}}>
        <ScrollableTabView
          onChangeTab={(arr) => this.handleChangeTab(arr.i)}
          tabBarPosition={'bottom'}
          style={{backgroundColor: '#FFFFFF', flex: 1}}
          tabBarUnderlineStyle={{backgroundColor: Config.baseColor}}
          renderTabBar={() =>
            <STabCustom
              style={styles.tabs}
              tabStyle={styles.tab}
              activeTabStyle={styles.activeTab}
              textStyle={styles.tabText}
              activeTextColor='#FFFFFF'
              inactiveTextColor='#666666'/>}>
          {
            this.tabs.map((item, index) =>
              <GridView tabLabel={item.label} key={item.action} positon={item.action}
                  data={data} index={index} showMisData={showMisData}
                  setRef={this.setRef}/>
            )
          }
        </ScrollableTabView>
        {
          !fromBet
            ? (
              <BetArea
                tab={this.tabs[positionIndex]['label']}
                title={currentSubPlay['select'][0]['label']}
                setWinShow={this.setWinShow}
                currentSubPlay={currentSubPlay}
                navigation={navigation}
                lotteryId={lotteryId}
                lotteryInfo={lotteryInfo}
                removeCurrentIssue={removeCurrentIssue}
                countdownOver={countdownOver}
                positionIndex={0}
                orderInfo={orderInfo}
                setSelect={this.setSelect}/>
            )
            : (
              <View style={styles.btm}>
                <View style={styles.cd}>
                  <View style={styles.point} />
                  <Countdown
                    data={lotteryInfo}
                    simpleMode={'B'}
                    fromTrend={true}
                    removeCurrentIssue={removeCurrentIssue}
                    countdownOver={() => countdownOver(lotteryId)}/>
                </View>
              </View>
            )
        }
        {
          showOrderSettings && orderInfo && orderInfo.betNum > 0 ? (
            <BetSettings
              show={showOrderSettings}
              orderInfo={orderInfo}
              setWinShow={this.setWinShow}
              setUnitPrice={this.setUnitPrice}
              setUnit={this.setUnit}
              betConfirm={this.betConfirm}
              currentSubPlay={currentSubPlay}/>
          ) : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: '#FF8787',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
  },
  tab: {
    height: 23,
    backgroundColor: '#E5E5E5',
  },
  tabs: {
    height: 23,
  },
  point: {
    width: 5,
    height: 5,
    borderRadius: 50,
    backgroundColor: '#333333',
    marginRight: 5,
  },
  cd: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btm: {
    height: 58,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})


const mapDispatchToProps = (dispatch) => {
  return {
    addOrder: (orderList) => {
      dispatch(addOrder(orderList))
    },
  }
}

export default connect(null, mapDispatchToProps)(Sanxing)
