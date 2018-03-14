import React, { Component } from 'react'
import {
  StyleSheet, View, Image,
  Alert, Dimensions,
} from 'react-native'
import LotteryNavBar from '../../components/lotteryNavBar'
import ModalView from './../../components/LHCModalView'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import { LoadingView } from '../../components/common'
import { connect } from "react-redux"
import CountDown from "../../components/countdown"
import SubPlayGuide from '../../components/subPlayGuide'
import LHCRecentRecord from '../../components/LHCRecentRecord'
import Sound from '../../components/clickSound'
import {
  ClearLHClistItem,
  getBetCountdown,
  resetCountdown,
  setLHCId,
} from '../../actions'
import LiangMianPage from './LiangMianPage'
import TeShuHaoPage from './TeShuHaoPage'
import ZhengMaPage from './ZhengMaPage'
import ZhengMaTePage from './ZhengMaTePage'
import ZhengMa1To6Page from './ZhengMa1To6Page'
import ZhengMaGuoGuanPage from './ZhengMaGuoGuanPage'
import LianMaPage from './LianMaPage'
import LianXiaoPage from './LianXiaoPage'
import LianWeiPage from './LianWeiPage'
import ZiXuanBuZhongPage from './ZiXuanBuZhongPage'
import ShengXiaoPage from './ShengXiaoPage'
import HexiaoPage from './HexiaoPage'
import SeBoPage from './SeBoPage'
import WeiShuPage from './WeiShuPage'
import QiMaWuHangPage from './QiMaWuHangPage'
import ZhongYiPage from './ZhongYiPage'
import helpTips from './config'

const { screenWidth } = Dimensions.get('window')
const ComponentPages = { // 通过id匹配组件
  1: LiangMianPage,
  2: TeShuHaoPage,
  3: ZhengMaPage,
  4: ZhengMaTePage,
  5: ZhengMa1To6Page,
  6: ZhengMaGuoGuanPage,
  7: LianMaPage,
  8: LianXiaoPage,
  9: LianWeiPage,
  10: ZiXuanBuZhongPage,
  11: ShengXiaoPage,
  14: HexiaoPage,
  16: SeBoPage,
  20: WeiShuPage,
  22: QiMaWuHangPage,
  23: ZhongYiPage,
}

class LhcMainPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      dataArr: {},
      selectedMenu: {},
      resData: {},
      RecentRecord: {},
      RecentRecordState: false,
      onPressRandom: ()=>{},
    }
    this.selectedComponentPagesTabIndex = 0
  }

  componentDidMount() {
    const { lotteryId, playIndex } = this.props.navigation.state.params
    const { setLHCId, resetCountdown, countdownOver } = this.props
    setLHCId(lotteryId)
    resetCountdown()
    fetchWithOutStatus({ act: 10002, lottery_id: lotteryId }).then((res) => {
      let selectedMenu = res.type_list[2]
      if (playIndex) {
        selectedMenu = Object.values(res.type_list).filter(play => play.lhc_type_name === playIndex)[0]
      }
      this.setState({ resData: res, dataArr: res.type_list, selectedMenu })
      this.getRecentRecord() //近期开奖信息
      countdownOver(lotteryId) //截止时间
    })
  }
  
  getRecentRecord = () => {
    const { lotteryId } = this.props.navigation.state.params
    fetchWithOutStatus({
      act: 10005,
      lottery_id: lotteryId ? lotteryId : 20,
    }).then((res)=>{
      this.setState({
        RecentRecord: res,
      })
    })
  }

  onPressMenuItemCallBack = (item) => {
    if(item !== this.state.selectedMenu) {
      this.selectedComponentPagesTabIndex=0
    }
    this.setState({
      isModalVisible:false,
      selectedMenu: item,
    })

  }
  _centerIconAction = () => {
    this.setState({ RecentRecordState:false,isModalVisible: true})
  }

  renderContent = () => {
    let SelectedComponent = ComponentPages['1'] // 默认显示组件(特码)
    const type_id = Number(this.state.selectedMenu.lhc_type_id), dataArr = this.state.dataArr
    if (!this.state.dataArr[1]) {
      return <LoadingView />
    } else {
      SelectedComponent = ComponentPages[this.state.selectedMenu.lhc_type_id]
    }
    return (
      <View style={{ flex: 1, marginTop: -12 }}>
        <SelectedComponent
          navigation={this.props.navigation}
          onChangeTab = {(activeTab) => {this.selectedComponentPagesTabIndex = activeTab}}
          callBack={this._recentRecordCallBack}
          sysInfo={this.props.sysInfo}
          shopState = {Boolean(Object.keys(this.props.LHCbetDetails.order_list).length)}
          sx_list={this.state.resData.sx_list||{}}
          RecentRecord={this.state.RecentRecord||{}}
          category_id={this.state.resData.category_id}
          lottery_id={this.props.navigation.state.params.lotteryId}
          randomOrder={this.state.onPressRandom}
          resData={(()=>{
            switch(Number(this.state.selectedMenu.lhc_type_id)){
              case 11:
                return [
                  dataArr[type_id].odds,
                  dataArr[type_id+1].odds,
                  dataArr[type_id+2].odds,
                  dataArr[type_id+4].odds,
                ]
                case 16:
                return [
                  dataArr[type_id].odds,
                  dataArr[type_id+1].odds,
                  dataArr[type_id+2].odds,
                  dataArr[type_id+3].odds,
                ]
                case 20:
                return [
                  dataArr[type_id].odds,
                  dataArr[type_id+1].odds,
                ]
              default:
                return this.state.selectedMenu.odds
            }
          })()}/>
      </View>
    )
  }

  backFun = () => {
    const { navigation, LHCbetDetails } = this.props
    if (Object.keys(LHCbetDetails.order_list).length > 0) {
      Alert.alert('', '是否放弃所选的号码?', [
        {text: '取消', onPress: () => {return false}},
        {text: '确定', onPress: () => {
          this.props.ClearLHClistItem()
          navigation.goBack()
        }},
      ])
    } else {
      this.props.ClearLHClistItem()
      navigation.goBack()
    }
  }
  changeRecentRecordState = () => {
    this.setState({
      RecentRecordState: !this.state.RecentRecordState,
      isModalVisible: false,
    })
  }
  _recentRecordCallBack = (callback) => {
    this.setState({
      onPressRandom: callback,
    })
  }
  _onPressGoToBetDetails = () => {
    this.props.navigation.navigate('BetDetailsPage')
  }
  render() {
    const lotteryInfo = this.props.lotteryInfo,
          orderList = this.props.LHCbetDetails.order_list,
          countdownOver = this.props.countdownOver,
          shopState = Boolean(Object.keys(this.props.LHCbetDetails.order_list).length),
          sx_list = this.state.resData.sx_list||{}
    let tips
    if(this.state.showTips && !!helpTips[this.state.selectedMenu.lhc_type_id]) {
      tips = helpTips[this.state.selectedMenu.lhc_type_id][this.selectedComponentPagesTabIndex] ?
          helpTips[this.state.selectedMenu.lhc_type_id][this.selectedComponentPagesTabIndex] :
          helpTips[this.state.selectedMenu.lhc_type_id][0]
    }

    let navTitle = '六合彩'
    const { selectedMenu, resData, dataArr } = this.state
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <LotteryNavBar
          navigation={navigation}
          title={selectedMenu.lhc_type_name || navTitle}
          titleOnPress={()=>{
            Sound.stop()
            Sound.play()
            this._centerIconAction()
          }}
          leftIcon={'back'}
          backFun={()=>{
            Sound.stop()
            Sound.play()
            this.backFun()
          }}
          rightIcon={shopState?require('../../src/img/ic_lhc_shopCart.png'):undefined}
          rightOnPress={()=>{
            Sound.stop()
            Sound.play()
            this._onPressGoToBetDetails()
          }}
          lotteryId={resData.lottery_id}
          lotteryName={resData.lottery_name}
          menu={true}
          extendIsOpen={this.state.isModalVisible}
          categoryId={resData.category_id}/>
        {
          !!dataArr[1] && (
            <View>
              <CountDown
                data={lotteryInfo}
                needClear={orderList.length > 0}
                clearBet={() => this.props.ClearLHClistItem()}
                countdownOver={() => countdownOver(resData.lottery_id)}
                lotteryId={resData.lottery_id}
                categoryId={resData.category_id}
                recordOnPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.changeRecentRecordState()
                }}/>
              <LHCRecentRecord visibleState={this.state.RecentRecordState} shopState={shopState} sx_list={sx_list}
RecentRecord={this.state.RecentRecord} />
              <Image style={{width: screenWidth, marginTop: -7, resizeMode: 'contain'}} source={require('../../src/img/count_down_shade.png')} />
            </View>
          )
        }
        {
          this.renderContent()
        }
        {
          Object.keys(this.state.selectedMenu).length > 0 &&
            <ModalView dataArr={this.state.dataArr}
             selectedMenu={this.state.selectedMenu}
             isModalVisible={this.state.isModalVisible}
             onPressMenuItemCallBack={this.onPressMenuItemCallBack}/>
        }

        {
          this.state.showTips && (
            <SubPlayGuide
              title={this.state.selectedMenu.lhc_type_name}
              help={tips ? tips.help : ''}
              tips={tips ? tips.tips : ''}
              example={tips ? tips.example : ''}
              closeTips={() => {
                this.setState({showTips: false})
              }}/>
            )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
})

const mapStateToProps = (state) => {
  const { LHCbetDetails, lotteryInfo, sysInfo, phone } = state
  const { phoneSettings } = phone
  return {
    LHCbetDetails,
    lotteryInfo,
    sysInfo,
    phoneSettings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ClearLHClistItem: () => {
      dispatch(ClearLHClistItem())
    },
    countdownOver: (lotteryId) => {
      dispatch(getBetCountdown(lotteryId))
    },
    resetCountdown: () => {
      dispatch(resetCountdown())
    },
    setLHCId: (lotteryId) => {
      dispatch(setLHCId(lotteryId))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LhcMainPage)
