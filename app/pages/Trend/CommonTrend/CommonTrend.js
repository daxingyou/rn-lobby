import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  InteractionManager,
} from 'react-native'
import { addOrder } from '../../../actions/index'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import STabCustom from '../../../components/github/STabCustom'
import GridView from './GridView'
import HotCold from '../JiBenZouShi/HotCold'
import AverageOmission from '../JiBenZouShi/AverageOmission'
import Config from '../../../config/global'
import Countdown from '../../../components/countdown'
import Sound from '../../../components/clickSound'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import Immutable from 'immutable'
import BetArea from '../common/BetArea'
import BetSettings from '../../lottery/betSettings'
import LoadingView from '../../../components/LoadingView'
import { goToLottery } from '../../../utils/navigation'
import { initialOrderState, resetOrderState } from '../../LotteryNew/main'
import { getTotal } from "../../../utils"

const isIos = Platform.OS === 'ios'
const sx = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪']

class CommonTrend extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentSubPlay: props.currentSubPlay,
      data: '',
      activeIndex: 0,
      showDelay: false,
      showOrderSettings: false,
      isFetching: true,
      orderInfo: {
        ...initialOrderState,
      },
    }
    this.statistical = [
      {
        label: '出现次数',
        data: {},
      },
      {
        label: '平均遗漏',
        data: {},
      },
      {
        label: '最大遗漏',
        data: {},
      },
      {
        label: '最大连出',
        data: {},
      },
    ]
    this.SXstatistical = [
      {
        label: '出现次数',
        data: {},
      },
      {
        label: '平均遗漏',
        data: {},
      },
      {
        label: '最大遗漏',
        data: {},
      },
      {
        label: '最大连出',
        data: {},
      },
    ]

    // 任何使用GridView组件的页面 其selectedType都要填到这里作key
    this.scrollView = {
      '基本走势': {},
      '定位胆': {},
      '冠亚和': {},
      '和值': {},
      '特码': {},
      '生肖': {},
      '色波': {},
    }
  }

  componentDidMount() {
    const {lotteryId, type, displayPeriods, dataSort, tabLabels } = this.props
    InteractionManager.runAfterInteractions(() => {
      this.getData({ lotteryId, type, displayPeriods, dataSort, tabLabels })
    })
  }

  componentWillReceiveProps(nextProps) {
    const { displayPeriods, dataSort, selectedType } = this.props

    if (selectedType !== nextProps.selectedType) {
        this.setState({ activeIndex: 0})
    }

    if (displayPeriods !== nextProps.displayPeriods || dataSort !== nextProps.dataSort || selectedType !== nextProps.selectedType) {
      this.getData({
        lotteryId: nextProps.lotteryId,
        type: nextProps.type,
        displayPeriods: nextProps.displayPeriods,
        dataSort: nextProps.dataSort,
        tabLabels: nextProps.tabLabels,
        showPolyline: nextProps.showPolyline,
        updatePolyline: displayPeriods !== nextProps.displayPeriods,
      })
    }

    if (selectedType !== nextProps.selectedType
      || this.props.currentSubPlay.play_id !== nextProps.currentSubPlay.play_id) {
      this.setState({
        currentSubPlay: nextProps.currentSubPlay,
        orderInfo: {
          ...initialOrderState,
        },
      })
    }

    if (displayPeriods > nextProps.displayPeriods || selectedType !== nextProps.selectedType) {
      for (const type of Object.keys(this.scrollView)) {
        for (const tab of Object.keys(this.scrollView[type])) {
          if (this.scrollView[type][tab] !== null) {
            this.scrollView[type][tab].scrollTo({x: 0, y: 0, animated: false })
          }
        }
      }
    }
  }

  getData = ({ lotteryId, type, displayPeriods, dataSort, tabLabels, updatePolyline, showPolyline }) => {
    // this.setState({ isFetching: true })
    fetchWithOutStatus({
      act: 10058,
      lotteryId: lotteryId,
      count: displayPeriods,
      sort: dataSort,
      type: type ? type : '',
    }).then((res) => {
      let modifiedRes
      if (type === 'position') {
        if (this.props.selectedType === '定位胆6~10') {
          tabLabels.map((item, index) =>
            ['numTimes','numAveMiss','numMaxMiss','numMaxContinue'].map((subItem, subIndex) =>
            this.statistical[subIndex].data[item] = res[index+6][subItem]
          ))
        } else {
          tabLabels.map((item, index) =>
            ['numTimes','numAveMiss','numMaxMiss','numMaxContinue'].map((subItem, subIndex) =>
            this.statistical[subIndex].data[item] = res[index+1][subItem]
          ))
        }
        modifiedRes = {}
        for (let i = 0; i < tabLabels.length; i++) {
          if (this.props.selectedType === '定位胆6~10') {
            modifiedRes[tabLabels[i]] = this.handleRes(res[['6', '7', '8', '9', '10'][i]])
          } else {
            modifiedRes[tabLabels[i]] = this.handleRes(res[['1', '2', '3', '4', '5'][i]])
          }
        }
      }
      else if (['pk10gy', 'sumTrend', 'speNum'].includes(type)) {
        if (this.props.categoryId === '1') {
          [['frontTwoSum','前二'], ['backTwoSum','后二'], ['frontThreeSum','前三'], ['middleThreeSum','中三'], ['backThreeSum','后三']].map((item) =>
            ['numTimes','numAveMiss','numMaxMiss','numMaxContinue'].map((stValue, valueIndex) =>
              this.statistical[valueIndex].data[item[1]] = res[item[0]][stValue]
            )
          )
          modifiedRes = {}
          for (let i = 0; i < tabLabels.length; i++) {
            modifiedRes[tabLabels[i]] = this.handleRes(res[['frontTwoSum', 'backTwoSum', 'frontThreeSum', 'middleThreeSum', 'backThreeSum'][i]])
          }
        }
        else if (this.props.categoryId === '4') {
          [['threeSum','三码'], ['frontTwoSum','前二码'], ['backTwoSum','后二码']].map((item) =>
            ['numTimes','numAveMiss','numMaxMiss','numMaxContinue'].map((stValue, valueIndex) =>
              this.statistical[valueIndex].data[item[1]] = res[item[0]][stValue]
            )
          )
          modifiedRes = {}
          for (let i = 0; i < tabLabels.length; i++) {
            modifiedRes[tabLabels[i]] = this.handleRes(res[['threeSum', 'frontTwoSum', 'backTwoSum'][i]])
          }
        }
        else {
          this.statistical = this.setInitialStatistical(tabLabels)
          let Times = this.statistical[0].data
          let AveMiss = this.statistical[1].data
          let MaxMiss = this.statistical[2].data
          let MaxContinue = this.statistical[3].data
          for (let label of tabLabels) {
            Times[label] = label === '和值号码分布' ? Object.values(res.numTimes) : Object.values(res.times)
            AveMiss[label] = label === '和值号码分布' ? Object.values(res.numAveMiss) : Object.values(res.aveMiss)
            MaxMiss[label] = label === '和值号码分布' ? Object.values(res.numMaxMiss) : Object.values(res.maxMiss)
            MaxContinue[label] = label === '和值号码分布' ? Object.values(res.numMaxContinue) : Object.values(res.maxContinue)
          }
          modifiedRes = {}
          for (let label of tabLabels) {
            modifiedRes[label] = this.handleRes(res)
          }
        }
      }
      else if (type === 'sx') {
        this.SXstatistical = []
        for (let animal of sx) {
          const item = {}
          item['label'] = animal
          item['countY'] = []
          item['all'] = sx.map(subItem => {
              if (subItem === animal) {
                  return res.sxCountXAll[animal]
              } else {
                  return ''
              }
          })
          for (let countY of res.sxCountY) {
            item['countY'].push(typeof countY[animal] === 'undefined' ? 0 : countY[animal])
          }
          this.SXstatistical.push(item)
        modifiedRes = res.data
        }
      }
      else if (type === 'color') {
        this.statistical = res.colorTotal
        modifiedRes = res.data
      }
      else {
        modifiedRes = res
      }
        if (!isIos) {
          if (updatePolyline) {
            if (showPolyline) {
              this.setState({ showDelay: true }, () => {
                InteractionManager.runAfterInteractions(() => {
                  this.setState({ showDelay: false })
                })
              })
            }
          }
        }
        this.setState({
          data: modifiedRes,
          isFetching: false,
        })
    }).catch((err) => {
      console.warn(err)
    })
  }

  setInitialStatistical = (tabLabels) => {
    this.data = {}
    for (let label of tabLabels) {
      this.data[label] = []
    }
    return [
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

  handleRes = (res) => {
    let result = res.data
    this.nums = Object.keys(res.numData).sort((a, b) => a - b)
    for (let index = 0; index < result.length; index++) {
      let value = result[index]
      if (this.props.type !== 'position') {
        value['dataSum'] = res.dataSum[index]
      }
      for (let num of this.nums) {
        value[num] = res.numData[num][index]
      }
    }
    return result
  }

  renderContent = () => {
    const {
      categoryId, lotteryId, displayPeriods, dataSort,
      selectedType, showStatData, showMisData, showPolyline, tabLabels, currentPlay,
    } = this.props
    const { activeIndex, data, showDelay } = this.state
    // categoryId 1 时时彩
    // 2 快3
    // 3 11选5
    // 4 低频彩
    // 5 PK拾
    // 6 PC蛋蛋
    // 7 六合彩
    if (['1','2','3','4','5'].includes(categoryId) || (['7', '8'].includes(categoryId) && selectedType === '基本走势')) {
      if (categoryId === '3' && selectedType === '基本走势') {
        return (
          <GridView categoryId={categoryId} selectedType={'基本走势'} dataList={data} horizontal={true}
            statWidth={85} titles={['总和', '龙虎', '前三', '中三', '后三']} setRef={this.setRef}/>
        )
      }
      else if (['2','4'].includes(categoryId) && selectedType === '基本走势') {
        return <GridView dataList={data} categoryId={categoryId} selectedType={'基本走势'}
          titles={['和值', '跨度', '形态']} setRef={this.setRef}/>
      }
      else if (['2'].includes(categoryId) && selectedType === '和值') {
        return <GridView categoryId={categoryId} selectedType={'和值'} tabLabel={'和值号码分布'}
                  dataList={data['和值号码分布']} nums={this.nums} stat={this.statistical}
                  horizontal={true} showMisData={showMisData} showStatData={showStatData}
                  statWidth={85} showPolyline={showPolyline} balls={16} showDelay={showDelay}
                  titles={['和值', ...Array.from(new Array(16),(val,index)=>index+3)]}
                  hidePrizeColumn={true} setRef={this.setRef}/>
      }
      else if (categoryId === '5' && selectedType === '基本走势') {
        return <GridView dataList={data} categoryId={categoryId} selectedType={'基本走势'}
          titles={['冠亚和']} setRef={this.setRef}/>
      }
      else {
        return (
          <ScrollableTabView
            page={activeIndex > 0 ? activeIndex : 0}
            onChangeTab={({ i }) => {
              let currentSubPlay = this.state.currentSubPlay
              if (categoryId === '1' && selectedType === '和值') {
                [['erxing','前二直选'],['erxing','后二直选'],['sanxing','前三直选'],['sanxing','中三直选'],['sanxing','后三直选']].map((item, index) => {
                  if (index === i) {
                    currentSubPlay = currentPlay.filter(n=>n.name===item[0])[0]
                      .detail.filter(n=>n.label===item[1])[0].method.filter(n=>n.label==='直选和值')[0]
                  }
                })
              } else if (categoryId === '4' && selectedType === '和值') {
                [['sanma','直选'],['erma','前二码直选'],['erma','后二码直选']].map((item, index) => {
                  if (index === i) {
                    currentSubPlay = currentPlay.filter(n=>n.name===item[0])[0]
                      .detail.filter(n=>n.label===item[1])[0].method.filter(n=>n.label==='直选和值')[0]
                  }
                })
              }
              this.setState({
                currentSubPlay,
                activeIndex: i,
                showDelay: isIos ? false : true,
                orderInfo: {
                  ...this.state.orderInfo,
                  ...resetOrderState,
                  select: [],
                },
              }, () => {
                if (!isIos) {
                  InteractionManager.runAfterInteractions(() => {
                    this.setState({ showDelay: false })
                  })
                }
              })
            }}
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
            {categoryId === '1' && selectedType === '基本走势' && <GridView categoryId={categoryId} selectedType={'基本走势'} tabLabel={'开奖结果'} key={'lotteryResults'} dataList={data.trendResult} horizontal={false} titles={['前三', '中三', '后三']} setRef={this.setRef}/>}
            {categoryId === '1' && selectedType === '基本走势' && <HotCold tabLabel={'冷热'} key={'hotCold'} dataSort={dataSort} displayPeriods={displayPeriods} lotteryId={lotteryId}/>}
            {categoryId === '1' && selectedType === '基本走势' && <AverageOmission tabLabel={'平均遗漏'} key={'averageOmission'} dataSort={dataSort} displayPeriods={displayPeriods} lotteryId={lotteryId}/>}
            {
              ['1', '3', '4', '5'].includes(categoryId) && ['定位胆','定位胆1~5','定位胆6~10'].includes(selectedType) &&
              tabLabels && tabLabels.map((item, index) => {
                return (
                  <GridView
                    categoryId={categoryId} key={index}
                    selectedType={'定位胆'} tabLabel={item} unitIndex={index}
                    dataList={data[item]} nums={this.nums} stat={this.statistical}
                    horizontal={false} showMisData={showMisData} showStatData={showStatData}
                    statWidth={85} showPolyline={showPolyline} balls={10}
                    showDelay={showDelay} titles={this.nums}
                    hidePrizeColumn={true} setRef={this.setRef}/>
                )
              })
            }
            {
              ['1'].includes(categoryId) && selectedType === '和值' &&
              tabLabels && tabLabels.map((item, index) => {
                const titles = index < 2 ? Array.from(new Array(19),(val,index)=>index) : this.nums
                const balls = index < 2 ? 19 : 28
                return (
                  <GridView categoryId={categoryId} selectedType={'和值'} tabLabel={item} key={index}
                            dataList={data[item]} nums={this.nums} stat={this.statistical}
                            horizontal={true} showMisData={showMisData} showStatData={showStatData}
                            statWidth={85} showPolyline={showPolyline} balls={balls} showDelay={showDelay}
                            titles={['和值', ...titles]}
                            hidePrizeColumn={true} setRef={this.setRef}/>
                )
              })
            }
            {
              ['4'].includes(categoryId) && selectedType === '和值' &&
              tabLabels && tabLabels.map((item, index) => {
                const nums = index === 0 ? Array.from(new Array(28),(val,index)=>index) : Array.from(new Array(19),(val,index)=>index)
                const balls = index === 0 ? 28 : 19
                return (
                  <GridView categoryId={categoryId} selectedType={'和值'} tabLabel={item} key={index}
                            dataList={data[item]} nums={nums} stat={this.statistical}
                            horizontal={true} showMisData={showMisData} showStatData={showStatData}
                            statWidth={85} showPolyline={showPolyline} balls={balls} showDelay={showDelay}
                            titles={['和值', ...nums]}
                            hidePrizeColumn={true} setRef={this.setRef}/>
                )
              })
            }
            {
              categoryId === '5' && selectedType === '冠亚和' &&
              <GridView
                categoryId={categoryId} selectedType={'冠亚和'} tabLabel={'冠亚和两面'}
                key={'pk10gy'} dataList={data['冠亚和两面']} nums={this.nums} stat={this.statistical}
                 horizontal={false} showMisData={showMisData} showStatData={showStatData}
                 statFlex={1.5+1.5} titles={['冠亚和值', '和大', '和小', '和单', '和双']} hidePrizeColumn={true} setRef={this.setRef}/>
            }
            {
              categoryId === '5' && selectedType === '冠亚和' &&
              <GridView categoryId={categoryId} selectedType={'冠亚和'} tabLabel={'和值号码分布'}
                key={'distribution'} dataList={data['和值号码分布']} nums={this.nums} stat={this.statistical}
                horizontal={true} showMisData={showMisData} showStatData={showStatData} statWidth={85}
                showPolyline={showPolyline} balls={17} showDelay={showDelay}
                titles={['和值', ...Array.from(new Array(17),(val,index)=>index+3)]}
                hidePrizeColumn={true} setRef={this.setRef}/>
            }
            {['7', '8'].includes(categoryId) && selectedType === '基本走势' && <GridView categoryId={categoryId} selectedType={'基本走势'} tabLabel={'总和'} key={'sum'} dataList={data['totalSum']} horizontal={false} titles={['总数', '单双', '大小', '七色波']} hidePrizeColumn={true} setRef={this.setRef}/>}
            {['7', '8'].includes(categoryId) && selectedType === '基本走势' && <GridView categoryId={categoryId} selectedType={'基本走势'} tabLabel={'特码'} key={'special'} dataList={data['speNum']} horizontal={false} titles={['特别号', '大小单双', '生肖', '色波', '五行']} hidePrizeColumn={true} setRef={this.setRef}/>}
          </ScrollableTabView>
        )
      }
    }
    else if (categoryId === '6') {
      if (selectedType === '基本走势') {
        return <GridView dataList={data} categoryId={categoryId} selectedType={'基本走势'} titles={['大小单双', '色波']} setRef={this.setRef}/>
      } else if (selectedType === '特码') {
        return <GridView categoryId={categoryId} selectedType={'特码'} tabLabel={'和值号码分布'} dataList={data['和值号码分布']} nums={this.nums} stat={this.statistical} horizontal={true} showMisData={showMisData} showStatData={showStatData} statWidth={85} showPolyline={showPolyline} balls={28} showDelay={showDelay} titles={['特码', ...Array.from(new Array(28),(val,index)=>index)]} hidePrizeColumn={true} setRef={this.setRef}/>
      }
    }
    else if (selectedType === '生肖') {
        return <GridView categoryId={categoryId} selectedType={'生肖'} dataList={data}
                  stat={this.SXstatistical} horizontal={true} showStatData={showStatData}
                  statWidth={85} titles={sx} setRef={this.setRef}/>
    }
    else if (selectedType === '色波') {
        return <GridView categoryId={categoryId} selectedType={'色波'} dataList={data}
                  stat={this.statistical} horizontal={true} showStatData={showStatData}
                  statWidth={85} titles={['波色比']} setRef={this.setRef}/>
    }
  }

  setRef = (selectedType, tabLabel, ref) => {
    this.scrollView[selectedType][tabLabel] = ref
  }

  onPressItem = (itemName, itemId) => {
    const { orderInfo } = this.state
    const names = Immutable.fromJS(orderInfo.names).toJS()
    const ids = Immutable.fromJS(orderInfo.ids).toJS()
    if (!names.includes(itemName)) {
      names.push(itemName)
      ids.push(itemId)
    } else {
      names.splice(names.indexOf(itemName), 1)
      ids.splice(ids.indexOf(itemId), 1)
    }
    this.updateOrder(names, ids, names.length)
  }

  updateOrder = (names, ids, betNum) => {
    const { orderInfo } = this.state
    const {  unit, unitPrice } = orderInfo
    const totalPrice = getTotal(unit, betNum, unitPrice)
    this.setState({
      orderInfo: {
        ...orderInfo,
        names,
        ids,
        betNum,
        totalPrice,
      },
    })
  }

  setWinShow = () => {
    this.setState({
      showOrderSettings: !this.state.showOrderSettings,
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

  betConfirm = (rebate) => {
    const { orderInfo, currentSubPlay } = this.state
    const { navigation, currentPlay, selectedType, categoryId } = this.props
    const subPlayName = categoryId === '6' ? currentSubPlay.groupName : currentSubPlay.label
    this.createOrder(rebate, selectedType, subPlayName)
    this.setState({
      showOrderSettings: false,
    }, () => {
      navigation.navigate('OrderList', {
        unit: orderInfo.unit,
        unitPrice: orderInfo.unitPrice,
        currentPlay,
        currentSubPlay,
        playName: selectedType,
      })
    })
  }

  createOrder = (rebate, playName, subPlayName) => {
    const { lotteryInfo, addOrder, categoryId } = this.props
    const { orderInfo, currentSubPlay } = this.state
    const orderList = []
    if (categoryId === '6') {
      for (let i = 0; i < orderInfo.names.length; i++) {
        const order = Immutable.fromJS(orderInfo)
          .set('select', [orderInfo.names[i]])
          .set('playId', orderInfo.ids[i])
          .set('odds', currentSubPlay.max_odds)
          .set('betNum', 1)
          .set('totalPrice', orderInfo.totalPrice / orderInfo.betNum)
          .set('issue', lotteryInfo.issue)
          .set('rebate', rebate)
          .set('playName', playName)
          .set('subPlayName', subPlayName).toJS()
        orderList.push(order)
      }
    } else {
      orderList.push({
        ...orderInfo,
        playName,
        subPlayName,
        issue: lotteryInfo.issue,
        playId: currentSubPlay.play_id,
        odds: currentSubPlay.max_odds,
      })
    }

    addOrder(orderList)
    this.setState({
      orderInfo: {
        ...orderInfo,
        ...resetOrderState,
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

  render() {
    const { navigation, lotteryId, lotteryInfo, playIndex, categoryId,
      removeCurrentIssue, countdownOver, takeBet, betWidth, selectedType, fromBet, lotteryMap } = this.props
    const { showOrderSettings, isFetching, orderInfo, currentSubPlay } = this.state
    if (isFetching) {
      return <LoadingView />
    }
    return (
      <View style={{flex: 1}}>
        { this.renderContent() }
        {
          takeBet
            ? (
              !fromBet
                ? (
                  <BetArea
                    tab={selectedType}
                    title={'选号'}
                    activeIndex={this.state.activeIndex}
                    setWinShow={this.setWinShow}
                    currentSubPlay={currentSubPlay}
                    navigation={navigation}
                    lotteryId={lotteryId}
                    categoryId={categoryId}
                    lotteryInfo={lotteryInfo}
                    removeCurrentIssue={removeCurrentIssue}
                    countdownOver={countdownOver}
                    positionIndex={0}
                    betWidth={betWidth}
                    playIndex={playIndex}
                    onPressItem={this.onPressItem}
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
                {
                  !fromBet && (
                    <TouchableOpacity
                      style={styles.btn}
                      activeOpacity={0.85}
                      onPressIn={()=>{
                        Sound.stop()
                        Sound.play()
                        goToLottery(navigation, categoryId, lotteryId, null, playIndex)
                      }}>
                      <Text style={styles.btnText}>来一注</Text>
                    </TouchableOpacity>
                  )
                }
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
              currentSubPlay={currentSubPlay}
              rebatePoint={lotteryMap[lotteryId].rebatePoint}/>
          ) : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btnText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  btn: {
    flexShrink: 0,
    width: 90,
    height: 28,
    backgroundColor: '#DD1414',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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

})

const mapStateToProps = ({ lotteryMap }) => ({
    lotteryMap,
  })

const mapDispatchToProps = (dispatch) => ({
    addOrder: (orderList) => {
      dispatch(addOrder(orderList))
    },
  })

export default connect(mapStateToProps, mapDispatchToProps)(CommonTrend)
