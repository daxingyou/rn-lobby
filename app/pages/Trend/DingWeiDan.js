import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  ART,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native'
import {
  setPlayId,
  setUnit,
  setUnitPrice,
  createOrder,
} from '../../actions/index'

import ScrollableTabView from 'react-native-scrollable-tab-view'
import STabCustom from '../../components/github/STabCustom'
import LoadingView from '../../components/LoadingView'
import Immutable from 'immutable'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import { layout } from '../../utils/layout'
import Config from '../../config/global'
import BetSettings from '../lottery/betSettings'
import Statistical from './common/Statistical'
import BetArea from './common/BetArea'
import calLine from '../../utils/polyline'
import Countdown from '../../components/countdown'

const windowWidth = Dimensions.get('window').width

class DingWeiDan extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      positionIndex: 0,
      showOrderSettings: false,
      showDelay: false,
      layoutId: props.layoutId,
      isFetching: true,
    }
    this.lv = {
      '定位胆': {},
      '定位胆1~5': {},
      '定位胆6~10': {},
    }
    this.setInitialStatistical(props.layoutId)
  }

  componentDidMount() {
    const { totalPeriods, layoutId } = this.props

    InteractionManager.runAfterInteractions(() => {
      this.getData(totalPeriods, layoutId)
    })
  }

  componentWillReceiveProps(nextProps) {
    const { displayPeriods, setPlayId, orderInfo } = this.props

    if (Platform.OS !== 'ios') {
      if (displayPeriods !== nextProps.displayPeriods) {
        if (nextProps.showPolyline) {
          this.setState({ showDelay: true }, () => {
            InteractionManager.runAfterInteractions(() => {
              this.setState({ showDelay: false })
            })
          })
        }
      }
    }

    if (displayPeriods > nextProps.displayPeriods) {
      for (const type of Object.keys(this.lv)) {
        for (const tab of Object.keys(this.lv[type])) {
          if (this.lv[type][tab] !== null) {
            this.lv[type][tab].scrollTo({x: 0, y: 0, animated: false })
          }
        }
      }
    }

    if (this.state.layoutId !== nextProps.layoutId) {
      this.getData(nextProps.totalPeriods, nextProps.layoutId)
      this.setState({ layoutId: nextProps.layoutId })
      this.setInitialStatistical(nextProps.layoutId)
    }

    if (nextProps.currentPlay !== -1 && nextProps.currentPlay['method'][0]['play_id'] !== orderInfo.playId) {
        setPlayId(nextProps.currentPlay['method'][0]['play_id'], nextProps.currentPlay['method'][0]['max_odds'])
    }
  }

  setInitialStatistical = (layoutId) => {
    this.layout = layout
    this.data = {}
    let detail = this.layout[layoutId]
    for (let label of detail.label) {
      this.data[label] = Array.from({ length: detail.content.length - 1 }, () => 0)
    }
    this.statistical =
      [
        {
          label: '出现次数',
          data: Immutable.fromJS(this.data).toJS(),
        },
        {
          label: '平均遗漏',
          data: Immutable.fromJS(this.data).toJS(),
        },
        {
          label: '最大遗漏',
          data: Immutable.fromJS(this.data).toJS(),
        },
        {
          label: '最大连出',
          data: Immutable.fromJS(this.data).toJS(),
        },
      ]
  }

  getData = (totalPeriods, layoutId) => {
    this.setState({ isFetching: true })

    fetchWithOutStatus({
      act: 10017,
      lottery_id: this.props.lotteryId,
      count: totalPeriods,
      sort: 'desc',
    }).then((res) => {
      let modifiedRes = res

      if ([191, 251].includes(layoutId)) { // 北京PK拾 极速PK拾
        modifiedRes = res.map(item => ({
          ...item,
          ['prize_num']: item['prize_num'].slice(15),
        }))
      }

      if (modifiedRes) {
        this.setState({
          dataList: modifiedRes,
          isFetching: false,
        })
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  calStatistical = (lotteryRecord, detail) => {
    let ct = detail.content.slice(1)
    this.statistical[0].data = Immutable.fromJS(this.data).toJS()
    let averageOmission = this.statistical[1].data
    let maximumOmission = this.statistical[2].data
    let maximumContinuous = this.statistical[3].data
    let keys = Object.keys(averageOmission)
    for (let k = 0; k < keys.length; k++) {
      let key = keys[k]
      for (let i = 0; i < ct.length; i++) {
        let count = 0
        let index = 0
        let arr = []
        let startIndex = 0
        let mcArr = []
        let continuousIndex = -2
        for (let j = 0; j < lotteryRecord.length; j++) {
          let record = lotteryRecord[j]
          let prizeNums = record.prize_num.split(',')
          if (prizeNums[k] === ct[i]) {
            count += 1
            arr.push(j - index - 1)
            index = j
            if (j - continuousIndex !== 1) {
              startIndex = j
            }
            continuousIndex = j
          } else {
            if (j - continuousIndex === 1) {
              mcArr.push(j - startIndex)
            }
            continuousIndex = -2
          }
        }
        averageOmission[key][i] = Math.round((lotteryRecord.length - count) / (count || 1))
        maximumOmission[key][i] = this.getMaxNumOfArr(arr)
        maximumContinuous[key][i] = this.getMaxNumOfArr(mcArr)
      }
    }
  }

  getMaxNumOfArr = (arr) => {
    if (arr && arr.length > 0) {
      let maxNum = arr[0]
      for (let num of arr) {
        if (num > maxNum) {
          maxNum = num
        }
      }
      return maxNum
    } else {
      return 0
    }
  }

  initMissing = (length, detail, lotteryRecord) => {
    let missing = {}
    let ct = detail.content.slice(1)
    const { displayPeriods } = this.props
    let remainingRecord = lotteryRecord.slice(displayPeriods)
    for (let l = 0; l < detail.label.length; l++) {
      let label = detail.label[l]
      missing[label] = Array.from({length: length}).fill(0)
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < remainingRecord.length; j++) {
          let record = remainingRecord[j]
          let prizeNums = record.prize_num.split(',')

          if (prizeNums[l] === ct[i]) {
            missing[label][i] = j
            break
          }
        }

      }
    }

    return missing
  }

  setWinShow = () => {
    this.setState({
      showOrderSettings: !this.state.showOrderSettings,
    })
  }

  betConfirm = (rebate) => {
    const { navigation, createOrder, currentPlay } = this.props
    createOrder(rebate, currentPlay.label, currentPlay['method'][0].label)
    this.setState({
      showOrderSettings: false,
    }, () => {
      navigation.navigate('OrderList', {currentSubPlay: currentPlay['method'][0], playName: currentPlay.label})
    })
  }

  render() {
    const {
      lotteryId, displayPeriods, currentPlay, orderInfo, lotteryInfo, selectedType,
      removeCurrentIssue, countdownOver, setUnitPrice, setUnit, betWidth,
      navigation, showMisData, showStatData, showPolyline, dataSort, layoutId, fromBet,
    } = this.props
    const { dataList, positionIndex, showOrderSettings, showDelay, isFetching } = this.state
    if (Array.isArray(dataList) && dataList.length <= 0 || currentPlay === -1 || isFetching) {
      return <LoadingView/>
    } else {
      let detail = '',
          missing = {}, //每行遗漏
          prizeNums = [], //中奖号码
          displayRecord = [] //当前要显示的数据
      detail = this.layout[layoutId]
      if (dataSort === 'desc') {
        displayRecord = Immutable.fromJS(dataList).toJS().slice(0, displayPeriods)
      } else {
        displayRecord = Immutable.fromJS(dataList).toJS().sort((a, b) => (a.issue_no - b.issue_no)).slice(-displayPeriods)
      }
      if (showMisData) {
        missing = this.initMissing(detail.content.length - 1, detail, dataList)
      }
      showStatData && this.calStatistical(displayRecord, detail)

      const currentSubPlay = currentPlay['method'][0]

      return (
        <View style={styles.container}>
          <ScrollableTabView
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
                inactiveTextColor='#666666'/>}
            onChangeTab={arr => {
              this.setState({ positionIndex: arr.i })

              if (Platform.OS !== 'ios') {
                this.setState({ showDelay: true }, () => {
                  InteractionManager.runAfterInteractions(() => {
                    this.setState({ showDelay: false })
                  })
                })
              }
            }}>
          {
            detail.label.map((label, unitIndex) =>
            {
              let occurrencesNumber = this.statistical[0].data[label]
              const path = ART.Path()
              return (
                <View style={{flex: 1, position: 'relative'}} key={unitIndex} tabLabel={label}>
                  <View style={styles.titleRow}>
                  {
                    detail.content.map((ct, index) =>
                      <View
                        style={index === 0 ? styles.label : styles.numWrap}
                        key={index}>
                        <Text style={styles.titleText}>{ct}</Text>
                      </View>
                    )
                  }
                  </View>
                  <ScrollView
                    ref={res => {this.lv[selectedType][label] = res}}
                    style={{flex: 1}}>
                    {
                      displayRecord.map((rowData, rowID) => {
                        prizeNums = rowData.prize_num.split(',')
                        let numList = detail.content.slice(1)
                        return (
                          <View style={[styles.row, rowID % 2 === 0 ? {backgroundColor: '#F8F8F8'} : null]} key={rowID}>
                            <View style={styles.label}>
                              <Text style={styles.ctText}>{rowData.issue_no.substr(-4) + '期'}</Text>
                            </View>
                            {
                              numList.map((item, index) => {
                                let prizeNum = prizeNums[unitIndex]
                                let prizeNumIndex = numList.indexOf(prizeNum)
                                if (showPolyline && prizeNumIndex === index) {
                                  calLine({ path, numList, displayRecord, unitIndex, rowID, index, item, windowWidth, prizeNum: 'prize_num', beforeItem: 70 })
                                }
                                if (showMisData) {
                                  missing[label][index] = prizeNumIndex === index ? 0 : missing[label][index] + 1
                                }
                                if (showStatData) {
                                  occurrencesNumber[index] = prizeNumIndex === index ? occurrencesNumber[index] + 1 : occurrencesNumber[index]
                                }
                                return (
                                  <View style={styles.numWrap} key={index}>
                                    <View style={prizeNumIndex === index ? styles.prizeNum : null}>
                                      <Text style={prizeNumIndex === index ? styles.hText : styles.gText}>
                                        {
                                          item === prizeNum ? prizeNum : (
                                            showMisData ? missing[label][index] : ''
                                          )
                                        }
                                      </Text>
                                    </View>
                                  </View>
                                )
                              })
                            }
                          </View>
                        )
                      })
                    }
                    {
                      showPolyline && !showDelay && (
                        <View style={{flex: 1, position: 'absolute', backgroundColor: 'transparent'}}>
                          <ART.Surface width={windowWidth} height={displayRecord.length * 30} position='absolute' >
                            <ART.Shape d={path} stroke={Config.baseColor} strokeWidth={1} />
                          </ART.Surface>
                        </View>
                      )
                    }
                  </ScrollView>
                  {
                    showStatData && <Statistical stat={this.statistical} label={label} width={70} />
                  }
                </View>
              )
            })
          }
          </ScrollableTabView>
          {
            !fromBet
              ? (
                <BetArea
                  tab={currentSubPlay['select'][positionIndex]['label']}
                  title={'定位胆'}
                  setWinShow={this.setWinShow}
                  currentSubPlay={currentSubPlay}
                  navigation={navigation}
                  lotteryId={lotteryId}
                  lotteryInfo={lotteryInfo}
                  removeCurrentIssue={removeCurrentIssue}
                  countdownOver={countdownOver}
                  positionIndex={positionIndex}
                  betWidth={betWidth}/>
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
            showOrderSettings && orderInfo && orderInfo.playId && orderInfo.betNum > 0 ? (
              <BetSettings
                navigation={navigation}
                show={showOrderSettings}
                orderInfo={orderInfo}
                setWinShow={this.setWinShow}
                setUnitPrice={setUnitPrice}
                setUnit={setUnit}
                betConfirm={this.betConfirm}
                currentSubPlay={currentSubPlay}/>
            ) : null
          }
        </View>
      )
    }
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
  titleRow: {
    backgroundColor: '#E5E5E5',
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },
  label: {
    width: 70,
    alignItems: 'center',
  },
  numWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#DCDCDC',
    height: 30,
  },
  ctText: {
    fontSize: 15,
    color: '#9198AB',
    backgroundColor: 'transparent',
  },
  titleText: {
    fontSize: 12,
    color: '#9198AB',
    backgroundColor: 'transparent',
  },
  gText: {
    fontSize: 14,
    color: '#B6BDCF',
    backgroundColor: 'transparent',
  },
  hText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  prizeNum: {
    width: 25,
    height: 25,
    backgroundColor: Config.baseColor,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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

const mapStateToProps = (state) => {
  const { orderInfo, sysInfo } = state
  return {
    orderInfo,
    sysInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    setPlayId: (playId, odds) => {
      dispatch(setPlayId(playId, odds))
    },
    setUnit: (unit) => {
      dispatch(setUnit(unit))
    },
    setUnitPrice: (unitPrice) => {
      dispatch(setUnitPrice(unitPrice))
    },
    createOrder: (rebate, playName, subPlayName) => {
      dispatch(createOrder(rebate, playName, subPlayName))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DingWeiDan)
