import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import Sound from '../../components/clickSound'
import Immutable from 'immutable'
import Config from '../../config/global'
import { goToTrend, goToLottery } from '../../utils/navigation'

const defLotteryLogo = require('../../src/img/ic_def_lottery.png')

export default class LobbyItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      remainingTime: '00:00:00',
    }
    this.isSpollingTick = false
    this.isSpollingLR = false
    this.doubleClick = false
    this.firstGetTime = true
    this.incrementTime = 5000
    this.timeoutLobbyItem = -1
    this.cut = false
    this.isFocus = true
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('focusChange', (eventMsg) => {
      eventMsg !== "lottery" ? this.isFocus = false : this.isFocus = true
    })
    const { data } = this.props
    if (data.end_time) {
      this.intervalTick = setInterval(() => this.tick(), 1000)
      this.isSpollingTick = true
    }

    if (!data.last_prize_num) {
      this.isSpollingLR = true
      this.intervalLotteryRecord = setInterval(() => this.getLotteryItem(data.lottery_id), 15000)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextProps.isFocus) { //失去焦点时
      clearInterval(this.intervalTick)
      clearInterval(this.intervalLotteryRecord)
      clearTimeout(this.timeoutLobbyItem)
      this.isSpollingLR = false
      this.cut = true
    } else {
      if (this.cut) {  //重新获取焦点时
        this.cut = false
        this.isSpollingTick = true
        this.intervalTick = setInterval(() => this.tick(), 1000)
        let data = this.state.data || this.props.data
        if (!this.isSpollingLR && data && !data.last_prize_num) {
          this.isSpollingLR = true
          this.intervalLotteryRecord = setInterval(() => this.getLotteryItem(data.lottery_id), 15000)
        }
      }
      if (!this.isSpollingTick && (nextState.data && !Immutable.is(nextState.data, this.state.data))) {
        clearInterval(this.intervalTick)
        this.intervalTick = setInterval(() => this.tick(), 1000)
        this.isSpollingTick = true
      }

      if (!this.isSpollingLR && (nextState.data && !nextState.data.last_prize_num)) {
        this.isSpollingLR = true
        this.intervalLotteryRecord = setInterval(() => this.getLotteryItem(nextState.data.lottery_id), 15000)
      }

      if (nextState.data && nextState.data.last_prize_num) {
        this.isSpollingLR = false
        clearInterval(this.intervalLotteryRecord)
      }
    }
  }

  getLotteryItem = (lotteryId) => {
    if(!this.isFocus) {
      return false
    }

    let startTime = new Date().getTime()
    fetchWithOutStatus({act: 10001, lottery_id: lotteryId}).then((res) => {
      if (res) {
        let endTime = new Date().getTime()
        let delay = endTime - startTime
        let timeDifference = endTime - res.now_time * 1000
        this.setState({
          data: res,
          delay,
          timeDifference,
        })
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  tick = () => {
    let data = this.state.data || this.props.data
    let delay = this.state.delay || this.props.delay
    let timeDifference = this.state.timeDifference || this.props.timeDifference
    let currentTime = new Date().getTime() - timeDifference
    let closeTime = data.end_time * 1000 - delay
    if (currentTime < closeTime) {
      this.firstGetTime = true
      this.incrementTime = 5000
      let second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24
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
        remainingTime: `${hours}:${minutes}:${seconds}`,
      })
    } else {
      this.isSpollingLR = false
      clearInterval(this.intervalLotteryRecord)
      this.isSpollingTick = false
      clearInterval(this.intervalTick)
      if (this.firstGetTime) {
        this.firstGetTime = false
        this.getLotteryItem(data.lottery_id)
      } else {
        let delay = this.incrementTime + Math.random() * 3000
        this.timeoutLobbyItem = setTimeout(() => {
          this.incrementTime += 5000
          this.getLotteryItem(data.lottery_id)
        }, delay)
      }

      this.setState({
        remainingTime: '00:00:00',
      })
      return false
    }

  }

  keep = () => {
    const { data, setKeep, navigation, isLogin } = this.props
    let lotteryId = data.lottery_id
    let type = data.is_keep === 1 ? 0 : 1
    if (!this.doubleClick) {
      if (isLogin) {
        this.doubleClick = true
        setKeep(lotteryId, type, this.callBack)
      } else {
        navigation.navigate('LoginPage')
      }
    }
  }

  callBack = (status) => {
    this.doubleClick = false
    if (status === '9000003') {
      this.props.navigation.navigate('LoginPage')
    }
  }

  render() {
    const { navigation, isLogin } = this.props
    let data = this.state.data || this.props.data
    return (
      <View style={styles.item} key={data.lottery_id}>
        <TouchableOpacity
          underlayColor='transparent'
          onPress={() => {
            Sound.stop()
            Sound.play()
            goToLottery(navigation, data.category_id, data.lottery_id)
          }}>
          <View style={styles.content}>
            <View>
              {data.lottery_image !== '' && <Image source={data.lottery_image ? {uri: data.lottery_image} : defLotteryLogo} style={{width: 60, height: 60}}/>}
            </View>
            <View style={styles.info}>
              <View style={styles.row}>
                <Text style={styles.lotteryName}>{data.lottery_name}</Text>
                <Image source={require('../../src/img/arrow_right.png')} style={{width: 9, height: 15}}/>
              </View>
              <View style={styles.row}>
                <View style={styles.lotteryRecord}>
                  {
                    data.last_prize_num && data.last_prize_num.split(',').length > 0 ? data.last_prize_num.split(',').map((num, index) => {
                      let numStyle = data.last_prize_num.split(',').length < 7 && {paddingRight: 5}
                      if (data.category_id === '6') {
                        if (index === 0 || index === 1) {
                          return (
                            <Text key={index} style={[styles.recordNum, numStyle]}>{num} +</Text>
                          )
                        } else if (index === 2) {
                          return (
                            <Text key={index} style={[styles.recordNum, numStyle]}>{num} =</Text>
                          )
                        } else {
                          return (
                            <Text key={index} style={[styles.recordNum, numStyle]}>{num}</Text>
                          )
                        }
                      } else {
                        return (
                          <Text key={index} style={[styles.recordNum, numStyle]}>{num}</Text>
                        )
                      }

                    }) : <Text style={styles.recordNum}>正在开奖</Text>
                  }
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.issue}>{data.curr_issue_no ? `${data.curr_issue_no}期截止时间：` : '未开盘'}</Text>
                <View style={styles.issueWrap}>
                  {
                    data.curr_issue_no && this.state.remainingTime.split(':').map((item, index) => {
                      if (index === 0) {
                        return (
                          <View key={index}>
                            <View style={[styles.timeWrap, item.length > 2 ? { width: 22} : null]}>
                              <Text style={styles.time}>{item}</Text>
                            </View>
                          </View>
                        )
                      } else {
                        return (
                          <View style={{flexDirection: 'row', alignItems: 'center'}} key={index}>
                            <Text style={{paddingHorizontal: 3}}>:</Text>
                            <View style={styles.timeWrap}>
                              <Text style={styles.time}>{item}</Text>
                            </View>
                          </View>
                        )
                      }
                    })
                  }
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.funsWrap}>
          <View style={styles.funs}>
            <TouchableOpacity
              style={styles.fun}
              underlayColor='transparent'
              onPress={() => {
                Sound.stop()
                Sound.play()
                goToTrend(navigation, data.category_id, data.lottery_id)
              }}>
              <Image source={require('../../src/img/trend.png')} style={{width: 15, height: 15}} resizeMode='contain'/>
              <Text style={styles.funText}>走势</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fun, styles.funBorder]}
              underlayColor='transparent'
              onPress={() => {
                Sound.stop()
                Sound.play()
                navigation.navigate('Rules', { lotteryId: data.lottery_id, navigation })
              }}>
              <Image source={require('../../src/img/rule.png')} style={{width: 15, height: 15}} resizeMode='contain'/>
              <Text style={styles.funText}>玩法</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fun, styles.funBorder]}
              underlayColor='transparent'
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.keep()
              }}>
              <Image
                source={isLogin && this.props.data.is_keep === 1 ? require('../../src/img/favourite.png') : require('../../src/img/unFavourite.png')}
                style={{width: 15, height: 15}}
                resizeMode='contain'/>
              <Text style={styles.funText}>{isLogin && this.props.data.is_keep === 1 ? '已收藏' : '收藏'}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  issueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  content: {
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
    paddingLeft: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lotteryName: {
    fontSize: 15,
    color: '#000000',
  },
  issue: {
    fontSize: 11,
    color: '#666666',
  },
  timeWrap: {
    width: 15.5,
    height: 15.5,
    backgroundColor: '#454545',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  lotteryRecord: {
    flexDirection: 'row',
  },
  recordNum: {
    fontSize: 14,
    fontWeight: '600',
    color: Config.baseColor,
    paddingRight: 3,
  },
  funsWrap: {
    height: 35,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  funs: {
    flexDirection: 'row',
  },
  fun: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  funText: {
    paddingLeft: 8,
    color: '#333333',
    fontSize: 12,
  },
  funBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#eaeaea',
  },
})
