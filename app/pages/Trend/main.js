import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  View,
  Dimensions,
} from 'react-native'
import {
  getPlayList,
  getNewPlayList,
  removeCurrentIssue,
  getBetCountdown,
  clearOrderList,
  cleanIssueList,
  resetCountdown,
  delOrderInfo,
} from '../../actions/index'
import HeadToolBar from '../../components/HeadToolBar'
import Types from '../../components/Types'
import CommonTrend from './CommonTrend/CommonTrend'
import SanXing from './SanXing/SanXing'
import Filter from './common/Filter'
import LoadingView from '../../components/LoadingView'
import { backFun } from '../../utils/navigation'

const { width } = Dimensions.get('window')

class Trend extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTypes: false,
      selectedType: props.navigation.state.params.typesList[1],
      displayPeriods: 30,
      totalPeriods: 100,
      showFilterWin: false,
      dataSort: 'desc', //默认desc降序，asc升序
      showMisData: true,
      showStatData: true,
      showPolyline: true,
      type: null,
    }
  }

  componentDidMount() {
    const { getPlayList, getNewPlayList, resetCountdown, countdownOver, delOrderInfo } = this.props
    const { categoryId, lotteryId, fromBet } = this.props.navigation.state.params

    // 跳转卡顿
    setTimeout(() => {
      if (!fromBet) {
        if (!['7', '8'].includes(categoryId)) {
          if (categoryId === '6') {
            getNewPlayList(lotteryId)
          } else {
            getPlayList(lotteryId)
          }
        } else {
          resetCountdown()
          countdownOver(lotteryId)
        }
        delOrderInfo()
      }
    }, 300)
  }

  filterPlay = (playList, playName, lotteryNew) => {
    return lotteryNew
      ? playList.playInfo.filter(play => play.name === playName)[0]
      : playList.filter(play => play.label === playName)[0]['detail'][0]
  }

  setFilter = (data) => {
    this.setState({
      displayPeriods: data.displayPeriods,
      dataSort: data.dataSort,
      showMisData: data.showMisData,
      showStatData: data.showStatData,
      showPolyline: data.showPolyline,
      showFilterWin: false,
    })
  }

  renderContent = () => {
    const {
      lotteryMap, removeCurrentIssue,
      countdownOver, lotteryInfo,
    } = this.props
    const { navigation } = this.props
    const { categoryId, lotteryId, fromBet } = navigation.state.params
    const {
      selectedType, displayPeriods, totalPeriods,
      dataSort, showMisData, showStatData, showPolyline,
    } = this.state
    if ((typeof lotteryMap[lotteryId]) !== 'undefined' || ['7', '8'].includes(categoryId) || fromBet) {
      let playList = lotteryMap[lotteryId]
      let currentPlay = -1, currentSubPlay = -1
      let layoutId = lotteryId
      let Trend = CommonTrend
      let type, playIndex, tabs, takeBet, betWidth, tabLabels
      if (['定位胆', '定位胆1~5', '定位胆6~10'].includes(selectedType)) {
        takeBet = true
        type = 'position'
        const dingWeiDanPlay = this.filterPlay(playList, '定位胆')
        if (selectedType === '定位胆6~10') {
          categoryId === '5' && (layoutId = layoutId * 10 + 1)
          currentPlay = {
            ...dingWeiDanPlay,
            ['method']: [dingWeiDanPlay['method'][1]],
          }
        } else {
          categoryId === '3' && (betWidth = width+(width)/10)
          categoryId === '5' && (layoutId = layoutId * 10)
          currentPlay = dingWeiDanPlay
        }
        if (categoryId === '4') {
          tabLabels = ['百位', '十位', '个位']
        } else if (categoryId === '5') {
          if (selectedType === '定位胆6~10') {
            tabLabels = ['第六名', '第七名', '第八名', '第九名', '第十名']
          } else if (selectedType === '定位胆1~5') {
            tabLabels = ['第一名', '第二名', '第三名', '第四名', '第五名']
          }
        } else {
          tabLabels = ['万位', '千位', '百位', '十位', '个位']
        }
        currentSubPlay = currentPlay.method[0]
      }
      else if (['三星组三', '三星组六'].includes(selectedType)) {
        Trend = SanXing
        currentPlay = playList
      }
      else if (['1'].includes(categoryId) && selectedType === '和值') {
        type = 'sumTrend'
        tabLabels = ['前二', '后二', '前三', '中三', '后三']
        takeBet = true
        betWidth = width+(width)/10*6
        currentPlay = playList
        currentSubPlay = playList.filter(n=>n.name==='erxing')[0].detail.filter(n=>n.label==='前二直选')[0].method.filter(n=>n.label==='直选和值')[0]
      }
      else if (['4'].includes(categoryId) && selectedType === '和值') {
        type = 'sumTrend'
        tabLabels = ['三码', '前二码', '后二码']
        takeBet = true
        betWidth = width+(width)/10*6
        currentPlay = playList
        currentSubPlay = currentPlay.filter(n=>n.name==='sanma')[0].detail.filter(n=>n.label==='直选')[0].method.filter(n=>n.label==='直选和值')[0]
      }
      else {
        if (['2'].includes(categoryId) && selectedType === '和值') {
          const heZhiPlay = this.filterPlay(playList, '和值')
          type = 'sumTrend'
          tabLabels = ['和值号码分布']
          takeBet = true
          betWidth = width+(width)/10*6
          currentSubPlay = heZhiPlay['method'][0]
        } else if (categoryId === '5' && selectedType === '冠亚和') {
          const guanYaHePlay = this.filterPlay(playList, '冠亚和')
          type = 'pk10gy'
          tabs = 2
          tabLabels = ['冠亚和两面', '和值号码分布']
          takeBet = true
          betWidth = width+(width)/10*7
          currentSubPlay = guanYaHePlay['method'][0]
        } else if (categoryId === '6' && selectedType === '特码') {
          const teMaPlay = this.filterPlay(playList, '特码', true)
          type = 'speNum'
          tabLabels = ['和值号码分布']
          takeBet = true
          betWidth = width+(width)/10*18
          playIndex = 4
          currentPlay = teMaPlay
          currentSubPlay = teMaPlay.play[0]
        } else if (['7', '8'].includes(categoryId) && selectedType === '生肖') {
          type = 'sx'
          playIndex = '生肖'
        } else if (['7', '8'].includes(categoryId) && selectedType === '色波') {
          type = 'color'
          playIndex = '色波'
        }
      }

      return (
        <Trend
          navigation={navigation}
          categoryId={categoryId}
          selectedType={selectedType}
          layoutId={layoutId}
          currentPlay={currentPlay}
          showMisData={showMisData}
          showStatData={showStatData}
          showPolyline={showPolyline}
          lotteryId={lotteryId}
          displayPeriods={displayPeriods}
          totalPeriods={totalPeriods}
          dataSort={dataSort}
          type={type || this.state.type}
          tabs={tabs}
          tabLabels={tabLabels}
          takeBet={takeBet}
          betWidth={betWidth}
          playIndex={playIndex}
          currentSubPlay={currentSubPlay}
          lotteryInfo={lotteryInfo}
          removeCurrentIssue={removeCurrentIssue}
          countdownOver={countdownOver}
          fromBet={fromBet}/>
      )
    } else {
      return <LoadingView />
    }
  }

  render() {
    const { navigation, orderList, clearOrderList, cleanIssueList } = this.props
    const { typesList, fromBet } = navigation.state.params
    const {
      showTypes, selectedType, displayPeriods, showFilterWin,
      dataSort, showMisData, showStatData, showPolyline,
    } = this.state

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <HeadToolBar
          hideWin={this.state.showTypes}
          title={selectedType}
          titleAction={() => {
            this.setState({showTypes: !showTypes})
          }}
          leftIcon={'back'}
          leftIconAction={() => backFun(navigation, orderList, clearOrderList, cleanIssueList, fromBet)}
          rightIcon2={'set'}
          rightIconAction2={() => { this.setState({ showFilterWin: true }) }}/>
        { this.renderContent() }
        {
          showTypes && (
            <Types
              selectedType={selectedType}
              selectAction={(type) => {
                this.setState(() => ({
                  selectedType: type,
                  showTypes: false,
                }))
              }}
              hideWin={() => {
                this.setState({
                  showTypes: false,
                })
              }}
              types={typesList}/>
          )
        }
        {
          showFilterWin && (
            <Filter
              closeFilterWin={() => { this.setState({showFilterWin: false}) }}
              displayPeriods={displayPeriods}
              dataSort={dataSort}
              showMisData={showMisData}
              showStatData={showStatData}
              showPolyline={showPolyline}
              handleConfirm={(data) => {this.setFilter(data)}}
              navigation={navigation}
              selectedType={selectedType}/>
          )
        }
      </View>
    )
  }
}

const mapStateToProps = ({ lotteryInfo, orderList, issueList, nav, lotteryMap }) => (
  {
    lotteryInfo,
    orderList,
    issueList,
    nav,
    lotteryMap,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    getPlayList: (lotteryId) => {
      dispatch(getPlayList(lotteryId))
    },
    removeCurrentIssue: (currentIssue) => {
      dispatch(removeCurrentIssue(currentIssue))
    },
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
    clearOrderList: () => {
      dispatch(clearOrderList())
    },
    cleanIssueList: () => {
      dispatch(cleanIssueList())
    },
    resetCountdown: () => {
      dispatch(resetCountdown())
    },
    getNewPlayList: (lotteryId) => {
      dispatch(getNewPlayList(lotteryId))
    },
    delOrderInfo: () => {
      dispatch(delOrderInfo())
    },
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(Trend)
