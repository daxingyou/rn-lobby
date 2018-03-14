import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import { connect } from 'react-redux'
import { toastShort } from '../../utils/toastUtil'
import HeaderToolBar from '../../components/HeadToolBar'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import { formatMoney } from '../../utils/formatUtil'
import { LoadingView } from '../../components/common'
import ModalPopup from '../../components/modal/ModalPopup'
import { getUserInfo } from '../../actions'
import Sound from '../../components/clickSound'
import { goToLottery } from '../../utils/navigation'

const winWidth = Dimensions.get('window').width
const defLotteryLogo = require('../../src/img/ic_def_lottery.png')
const rowContainer = {
  flexDirection:'row',
  alignItems:'center',
  marginVertical:winWidth<350?3:8,
}

class RecordDetailPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      details: {},
      isFirstLoading: true,
      isDelPopup: false,
    }
  }

  componentDidMount() {
    this._fetchDetailData()
  }

  _fetchDetailData = () => {
    const headers = { 'token': this.props.navigation.state.params.token }
    return fetchWithOutStatus({
      act: 10014,
      order_id: this.props.navigation.state.params.itemId,
    }, headers).then(result => {
      console.log('result: ', result);
      this.setState({ details: result, isFirstLoading: false })
      return result
    })
  }

  _handleDel = () => {
    this.setState({ isDelPopup: true })
  }

  _toDel = () => {
    this.setState({ isDelPopup: false })
    const headers = { 'token': this.props.navigation.state.params.token }
    return fetchWithOutStatus({
      act: 10015,
      order_id: this.state.details.order_id,
    }, headers).then(result => {
      if (result.status === 1001401) {
        toastShort((result.message || '该订单不能撤销'))
      } else {
        this.props.navigation.state.params._fetchLatestData()
        this.props.getUserInfo(this.props.navigation.state.params.token) // 更新redux中的用户信息
        this.props.navigation.goBack()
      }
    })
  }

  _renderOrderState(state, bonus) {
    let stateStr = '未知'
    if (state === '2') {
      return (
        <View style={[rowContainer, {marginTop:40,marginLeft:30,marginHorizontal:10}]}>
          <Text style={[styles.cTitle,{fontWeight:'bold',color:'#EC0909'}]}>中奖金额</Text>
          <Text style={[styles.cText,{color:'#EC0909',marginLeft:10,fontSize:40}]}>{formatMoney(bonus)}</Text>
          <Text>元</Text>
        </View>
      )
    } else {
      let color = '#999'
      let width = winWidth - 50
      if (state === '1') {
        stateStr = '待开奖......'
        color = '#F11717'
        width = winWidth-60
      } else if (state === '3') {
        stateStr = '没有中奖，再接再厉'
      } else if (state === '4') {
        stateStr = '该注单已撤销'
      }
      return (
        <View style={{marginTop:40,marginLeft:30,flexDirection:'row',marginHorizontal:10,alignItems:'center',marginVertical:winWidth<350?3:8}}>
          <Text style={{fontWeight:'bold',color: color,flexWrap:'nowrap',fontSize:18,textAlign:'center',width:width}}>{stateStr}</Text>
        </View>
      )
    }
  }

  _renderContent = () => {
    const { details } = this.state
    if (this.state.isFirstLoading) {
      return <LoadingView />
    }
    return (
      <ScrollView
        style={{marginBottom: 50,backgroundColor:'#fff'}}
        automaticallyAdjustContentInsets={false}
        horizontal={false}
        showsVerticalScrollIndicator={true}>
        <View>
          <Image style={{width:winWidth,height:125,position:'relative',top:-65}} source={require('../../src/img/Oval.png')}/>
        </View>
        <View style={{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:1,top:15,left:0,right:0}}>
          <View style={{padding:5,borderRadius:50}}>
            <Image
              style={{width:65,height:65}}
              source={details.lottery_image && details.lottery_image !== '' ? {uri: details.lottery_image} : defLotteryLogo}/>
              <Image
                style={{width:88,height:88,zIndex:-10,position:'absolute',top:-6,left:-6}}
                source={require('../../src/img/betShadow.png')}/>
          </View>
          <Text style={{textAlign:'center',fontWeight:'bold',fontSize:18,backgroundColor:'transparent',paddingTop:10,paddingBottom:10}}>{details.lottery_name}</Text>
          <Text style={{fontSize:13,color:'#999',backgroundColor:'#fff',flexWrap:'nowrap',textAlign:'center'}}>第{details.issue_no}期</Text>
        </View>
        {
          this._renderOrderState(String(details.status), details.bonus)
        }
        <View style={{marginLeft:29}}>
          <View style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: '#CFCFCF',
            paddingBottom: 14,
            marginRight: 21,
          }}>
            {
              String(details.status) === '1' ? null : (
                <View style={rowContainer}>

                  <Text style={styles.cTitle}>开奖号码</Text>

                  <View style={{flexDirection:'row',width:winWidth-120,flexWrap:'wrap'}}>
                  {
                    details.prize_num.split(',').length>1?
                    details.prize_num.split(',').map((v,i)=>
                      <View key={i} style={{backgroundColor:'#EC0909',borderRadius:50,width:25,height:25,marginLeft:3,marginBottom:5,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{backgroundColor:'transparent',color:'#fff',textAlign:'center',fontSize:15}}>{v}</Text>
                      </View>
                    )
                    :
                    <Text style={{backgroundColor:'transparent',color:'#000',textAlign:'center',fontSize:15}}>{details.prize_num}</Text>
                  }
                  </View>
                </View>
              )
            }
            <View style={{paddingBottom:10}}>
              {
                [
                  { title: '投注号码', text: details.bet_num },
                  { title: '注单单号', text: details.order_no },
                  { title: '投注时间', text: details.bet_time },
                  { title: '玩法名称', text: details.play_name },
                  { title: '投注金额', text: `${details.stake_count}注  ${formatMoney(details.bet_amount)}元` },
                  { title: '投注返点', text: `${formatMoney(details.bet_rebate || 0)}%` },
                  { title: '投注赔率', text: details.bet_odds.toString().replace(/,/g, ', ') },
                ].map((row, index) => (
                  <View key={index} style={[rowContainer, index === 4 && {paddingTop:10}]}>
                    <Text style={styles.cTitle}>{row.title}</Text>
                    <Text style={[styles.cText, index === 0 && {color:'#000',width: winWidth-120}]}>{row.text}</Text>
                  </View>
                ))
              }
            </View>
          </View>
          {
            String(details.status) === '1'?
            <TouchableOpacity
              style={{position:'absolute',bottom: 0, right:20}}
              activeOpacity={0.8}
              onPress={()=>{
                Sound.stop()
                Sound.play()
                this._handleDel.bind(this)()}}>
              <Image style={{width:30,height:30}} source={require('../../src/img/backTo.png')}/>
            </TouchableOpacity>
            :null
          }
          {
            String(details.status) === '2' ?
              <Image style={styles.awardpng} source={require('../../src/img/awarded.png')}/> :
              String(details.status) === '3' ?
              <Image style={styles.awardpng} source={require('../../src/img/unawarded.png')}/> :
              null
          }
        </View>
      </ScrollView>
    )
  }

  render() {
    const { details, isDelPopup } = this.state
    const { lottery_id, category_id } = details
    const { navigation, nav } = this.props
    const { fromLotteryNavBar } = navigation.state.params
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'投注详情'}
          leftIcon={'back'}
          leftIconAction={() => navigation.goBack()}/>
        <ModalPopup
          visible={isDelPopup}
          onPressCancel={() => this.setState({ isDelPopup: false })}
          onPressConfirm={this._toDel.bind(this)}>
          {'您确定要取消当前的注单？'}
        </ModalPopup>
        {
          this._renderContent()
        }
        <TouchableOpacity style={styles.btn}
          onPress={() => {
            if (lottery_id) {
              Sound.stop()
              Sound.play()
              goToLottery(navigation, category_id, lottery_id, null, null, null, fromLotteryNavBar, nav)
            }
          }}>
          <Text style={styles.btnText}>再来一注</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
    alignItems: 'center',
  },
  btn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: winWidth,
    height: 50,
    backgroundColor: '#EC0909',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color:'#fff',
    fontSize: 18,
  },
  cTitle: {
    fontSize: 12,
    color:'#999',
    width: 70,
  },
  cText: {
    fontSize: 16,
    color:'#999',
    backgroundColor: 'transparent',
    flexShrink: 1,
  },
  awardpng: {
    width:121,
    height:105,
    position:'absolute',
    top:75,
    left:winWidth-130,
    zIndex: -10,
  },
})

const mapStateToProps = ({ nav }) => (
  {
    nav,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    getUserInfo: (token, isCheckLogin) => dispatch(getUserInfo(token, isCheckLogin)),
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(RecordDetailPage)
