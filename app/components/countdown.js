import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native'
import { getLotteryRecord } from '../actions'
import Immutable from 'immutable'
import Config from '../config/global'
import ballStyle from '../utils/ballStyle'

import c0 from '../src/img/number/0.png'
import c1 from '../src/img/number/1.png'
import c2 from '../src/img/number/2.png'
import c3 from '../src/img/number/3.png'
import c4 from '../src/img/number/4.png'
import c5 from '../src/img/number/5.png'
import c6 from '../src/img/number/6.png'
import c7 from '../src/img/number/7.png'
import c8 from '../src/img/number/8.png'
import c9 from '../src/img/number/9.png'
import { toastShort } from '../utils/toastUtil'

const nums = [c0,c1,c2,c3,c4,c5,c6,c7,c8,c9]
const winWidth = Dimensions.get('window').width

class Countdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cd: '00:00:00',
      lastIssue: -1,
      fadeAnim: new Animated.Value(0),
      tips: '数据获取中...',
    }
    this.showDelay = false
    this.updateRecord = -1
    this.changedIssueTick = false
    this.intervalTick = null
    this.alreadyReset = false
  }

  componentDidMount() {
    const { data, lotteryId, simpleMode, getLotteryRecord } = this.props
    if (data && data.endTime > 0) {
      let currentTime = new Date().getTime() - data.timeDifference
      let closeTime = data.endTime - data.delay
      if (currentTime < closeTime) {
        clearInterval(this.intervalTick)
        this.intervalTick = setInterval(this.tick, 1000)
        this.changedIssueTick = true
      }
    }
    if (!simpleMode) {
      getLotteryRecord(lotteryId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps
    if (data.issue && this.props.data.issue && this.props.data.issue !== '00000000' //'00000000'是重置的默认期数
      && data.issue !== '00000000' && this.props.data.issue !== data.issue) {
      toastShort(`期次已变化，当前是${data.issue.slice(-4)}期`)
    }

    if (data.endTime > 0) {
      if (!this.changedIssueTick) {
        let currentTime = new Date().getTime() - data.timeDifference
        let closeTime = data.endTime - data.delay
        if (currentTime < closeTime || !Immutable.is(nextProps.data, this.props.data)) {
          clearInterval(this.intervalTick)
          this.intervalTick = setInterval(this.tick, 1000)
          this.changedIssueTick = true
        }
      }
    } else {
      clearInterval(this.intervalTick)
      this.changedIssueTick = false
    }

    let lotteryRecord = nextProps.lotteryRecord
    if (Array.isArray(lotteryRecord) && lotteryRecord.length > 0) {
      let lastIssue = this.state.lastIssue
      if (lotteryRecord[0].issue_no == lastIssue
        || (['7', '8'].includes(nextProps.categoryId) && lastIssue === lotteryRecord[0].issue_list[0].issue_no)) {
        clearInterval(this.updateRecord)
        this.updateRecord = -1
      }
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    return (!Immutable.is(nextProps.data, this.props.data) || this.state.cd !== nextState.cd)
  }

  componentWillUnmount() {
    clearInterval(this.intervalTick)
    clearInterval(this.updateRecord)
  }

  getCurrentRecord = (lotteryRecord, categoryId, lastIssue) => {
    let currentRecord = []
    if (Array.isArray(lotteryRecord) && lotteryRecord.length > 0
      && (lastIssue === -1 || lastIssue === lotteryRecord[0].issue_no ||
        (['7', '8'].includes(categoryId) && lastIssue === lotteryRecord[0].issue_list[0].issue_no))) {
      if(['7', '8'].includes(categoryId)){
        currentRecord = lotteryRecord[0].issue_list[0].data
      } else if(lotteryRecord[0].prize_num && lotteryRecord[0].prize_num.length > 0) {
        currentRecord = lotteryRecord[0].prize_num.split(',')
      }
    }

    return currentRecord
  }

  tick = () => {
    const { data, countdownOver, removeCurrentIssue } = this.props
    let currentTime = new Date().getTime() - data.timeDifference
    let closeTime = data.endTime - data.delay
    if (currentTime < closeTime) {
      let second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24
      let distance = closeTime - currentTime
      let days = Math.floor(distance / day)
      let hours = Math.floor((distance % day) / hour)
      let minutes = Math.floor((distance % hour) / minute)
      let seconds = Math.floor((distance % minute) / second)

      hours = days * 24 + hours
      if(hours < 10) {
        hours = '0' + hours
      }

      if(minutes < 10) {
        minutes = '0' + minutes
      }

      if(seconds < 10) {
        seconds = '0' + seconds
      }

      this.setState({
        cd: hours + ':' + minutes + ':' + seconds,
      })
    } else {
      this.changedIssueTick = false
      if (removeCurrentIssue) {
        removeCurrentIssue(data.issue)
      }
      countdownOver()
      clearInterval(this.intervalTick)
      this.changeIssue()
      this.setState({
        cd: '00:00:00',
        lastIssue: data.issue,
        tips: '正在开奖',
      })
      return false
    }
  }

  changeIssue = () => {
    if (this.updateRecord === -1) {
      const { lotteryId, getLotteryRecord } = this.props
      this.updateRecord = setInterval(() => {
        getLotteryRecord(lotteryId)
      }, 15000)
    }
  }

  triangletoup = () => {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 400,
      }
    ).start()
  }

  triangletodown = () => {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 2,
        duration: 400,
      }
    ).start()
  }

  render() {
    const { data, categoryId, simpleMode, lotteryRecord, fromTrend } = this.props
    if (typeof simpleMode !== 'undefined') {
      return (
        <View style={simpleMode === 'A' ? styles.simpleModeWrap : styles.simpleModeBWrap}>
        {
          data.issue ?
            <Text style={styles.cdText}>
              {fromTrend ? data.issue.slice(-4) : data.issue}期截止时间：
              <Text style={{color: Config.baseColor}}>{this.state.cd}</Text>
            </Text> :
           <Text style={styles.cdText}>未开盘</Text>
        }
        </View>
      )
    }

    const { lastIssue, fadeAnim, tips } = this.state
    const currentRecord = this.getCurrentRecord(lotteryRecord, categoryId, lastIssue)
    if (lotteryRecord && lotteryRecord.length === 0) {
      this.alreadyReset = true
    }

    return (
      <View style={styles.wrap}>
        <View style={styles.time}>
          {
            data.issue ?
              <View style={{alignItems:'center', justifyContent: 'space-around'}}>
                <Text style={{fontSize: 15, color: '#333'}}>
                  {data.issue.slice(-4)}期截止时间
                </Text>
                <View style={styles.numWarp}>
                {
                  this.state.cd.split(':').map((item, index) => {
                    if (index === 0) {
                      return (
                        <View key={index} style={{flexDirection: 'row'}}>
                        {
                          item.split('').map((cell, cellIndex) => {
                            return (
                              <Image key={cellIndex} style={styles.numImg} source={nums[cell]} resizeMode='contain' />
                            )
                          })
                        }
                        </View>
                      )
                    } else {
                      return (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.split}>{':'}</Text>
                          {
                            item.split('').map((cell, cellIndex) => {
                              return (
                                <Image key={cellIndex} style={styles.numImg} source={nums[cell]} resizeMode='contain' />
                              )
                            })
                          }
                        </View>
                      )
                    }
                  })
                }
                </View>
              </View> :
              <Text style={styles.cdText}>未开盘</Text>
          }
        </View>
        <View style={{justifyContent: 'center'}}>
          <Image style={{height: 50, resizeMode: 'contain'}} source={require('../src/img/count_down_divide.png')} />
        </View>
        <View style={[styles.result, {paddingTop: ['5', '7', '8'].includes(categoryId) ? 10 : 13}]}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{flex: 1, alignItems:'center'}}
            disabled={this.showDelay}
            onPress={() =>{
              if (Platform.OS !== 'ios') {
                this.showDelay = true
                setTimeout(() => {
                  this.showDelay = false
                }, 1000)
              }
              this.props.recordOnPress()
              if (fadeAnim._value === 0) {
               this.triangletoup()
               } else if(fadeAnim._value === 1) {
                 this.triangletodown()
               } else if(fadeAnim._value === 2) {
                 this.setState({fadeAnim:new Animated.Value(0)}, this.triangletoup)
               }
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 15, color: '#333'}}>
                近期开奖
              </Text>
              <Animated.Image
                resizeMode='contain'
                source={require('../src/img/menu_down2.png')}
                style={{width: 13, height: 13, marginLeft: 5,transform: [
                  //使用interpolate插值函数,实现了从数值单位的映
                  //射转换,上面角度从0到1，这里把它变成0-360的变化
                  {rotateZ: fadeAnim.interpolate({
                    inputRange: [0,1,2],
                    outputRange: ['0deg', '180deg', '360deg'],
                  })},
                ]}} />
            </View>
            {
              currentRecord.length > 0 && this.alreadyReset ? (
                <View style={[
                    styles.ballWrap,
                    categoryId === '5' ? {flexWrap:'wrap', alignItems: 'center', justifyContent: 'center', paddingTop: 10} :
                    currentRecord.length === 3 && {maxWidth: 110, justifyContent: 'space-between'},
                  ]}>
                  {
                    currentRecord.map((item,index)=>{
                      if(['7', '8'].includes(categoryId) && index === currentRecord.length-1){
                        return([
                          <Text key={index*10} style={{ fontSize: 18, marginHorizontal: 3, marginTop: -18 }}>+</Text>,
                          ballStyle(item,index,categoryId),
                        ])
                      }
                      return ballStyle(item,index,categoryId)
                    })
                  }
                </View>
              ) : (
                <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
                  <Text style={{alignItems:'center', fontSize: 15, color: '#333'}}>{tips}</Text>
                </View>
              )
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrap:{
    flexDirection: 'row',
    height: 80,
    backgroundColor: 'white',
  },
  simpleModeWrap: {
    height: 39,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleModeBWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    flex: 2,
    alignItems: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#E1E6EE',
    paddingTop: 13,
    paddingBottom: 5,
  },
  result: {
    flex: 3,
  },
  numWarp : {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  numImg : {
    height: 19,
    width: 15,
    flexShrink: 0,
  },
  split: {
    color: 'red',
    fontSize: 19,
    fontWeight: '600',
    lineHeight: 19,
    marginHorizontal: 1,
  },
  ballWrap: {
    flex: 1,
    width: winWidth/3*1.6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cdText: {
    fontSize: 12,
    color: '#666666',
  },
})

const mapStateToProps = ({ lotteryInfo }) => (
  {
    lotteryRecord: lotteryInfo.lotteryRecord,
  }
)

const mapDispatchToProps = (dispatch) => (
  {
    getLotteryRecord: (lotteryId) => {
      dispatch(getLotteryRecord(lotteryId))
    },
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(Countdown)
