import React, { Component } from 'react'
import {
  View, Image, StyleSheet, Text, TouchableOpacity,
  ScrollView, Alert, InteractionManager,
} from 'react-native'
import Immutable from 'immutable'
import HeaderToolBar from '../../../components/HeadToolBar'
import Sound from '../../../components/clickSound'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { formatDay } from '../../../utils/formatUtil'
import Config from '../../../config/global'
import { yesterday, replaceWithDot } from '../../../utils'

const yesteday = new Date().setTime( new Date().getTime() - 24*60*60*1000)

export default class Report extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statisticalData: {},
      startDate: '2016-01-01',
      endDate: formatDay(new Date(yesteday)),
      curStatData: {},
      curStatDetail: [],
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      fetchWithOutStatus({
        act: 10310,
      }, { token: this.props.navigation.state.params.userInfo.token }).then(res => {
        if (res.status === 0) {
          this.setState({
            statisticalData: res.data,
          })
        } else {
          Alert.alert('', res.message, [
            {text: '确认', onPress: () => { }},
          ], { cancelable: false })
        }
      }).catch(err => {
        console.warn(err)
      })
      this.getCurStatData()
    })
  }
  formatData = (data) => {
    const arr = data.split('-')
    arr.forEach((item, index) => {
      if (item.length < 2) {
        arr[index] = '0' + item
      }
    })
    return arr.join('')
  }
  getCurStatData = () => {
    const {startDate, endDate} = Immutable.fromJS(this.state).toJS()
    fetchWithOutStatus({
      act: 10311,
      startDate: this.formatData(startDate),
      endDate: this.formatData(endDate),
    }, {token: this.props.navigation.state.params.userInfo.token}).then(res => {
      if (res.status === 0) {
        this.setState({
          curStatData: res.data,
          curStatDetail: res.list || [],
        })
      } else {
        Alert.alert('', res.message, [
          {text: '确认', onPress: () => {}},
        ], {cancelable: false})
      }
    }).catch(err => {
      console.warn(err)
    })

  }

  handleDateChange = (date) => {
    this.setState({
      startDate: date[0],
      endDate: date[1],
    })
    this.getCurStatData()
  }

  render() {
    const { navigation } = this.props
    const { statisticalData, startDate, endDate, curStatData, curStatDetail } = this.state
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'报表'}
          leftIcon={'back'}
          leftIconAction={() => {
            Sound.stop()
            Sound.play()
            navigation.goBack()
          }}/>
        <ScrollView style={{flex: 1}}>
          <View style={styles.statistics}>
            <View style={styles.statisticsRow}>
              <View style={styles.statisticsRowLeft}>
                <View style={[styles.emt, {backgroundColor: '#FF9F00'}]}/>
                <Text style={styles.labelText}>团队人数</Text>
              </View>
              <View style={styles.statisticsRowRight}>
                <Text style={styles.contentText}>
                  {
                    statisticalData.people ?
                    `${statisticalData.people}人（代理${statisticalData.agent_people}人，玩家${statisticalData.user_people}人）`
                    : `0人`
                  }
                </Text>
              </View>
            </View>
            <View style={styles.statisticsRow}>
              <View style={styles.statisticsRowLeft}>
                <View style={[styles.emt, {backgroundColor: '#EC0909'}]}/>
                <Text style={styles.labelText}>团队总余额</Text>
              </View>
              <View style={styles.statisticsRowRight}>
                <Text style={styles.contentText}>{statisticalData.totalBalance || 0}</Text>
              </View>
            </View>
            <View style={styles.statisticsRow}>
              <View style={styles.statisticsRowLeft}>
                <View style={[styles.emt, {backgroundColor: '#4A90E2'}]}/>
                <Text style={styles.labelText}>昨日佣金</Text>
              </View>
              <View style={styles.statisticsRowRight}>
                <Text style={styles.contentText}>{statisticalData.ydayIncome || 0}</Text>
              </View>
            </View>
            <View style={styles.statisticsRow}>
              <View style={styles.statisticsRowLeft}>
                <View style={[styles.emt, {backgroundColor: '#7ED321'}]}/>
                <Text style={styles.labelText}>累计佣金</Text>
              </View>
              <View style={styles.statisticsRowRight}>
                <Text style={styles.contentText}>{statisticalData.totalIncome || 0}</Text>
              </View>
            </View>
          </View>
          <View style={styles.curStat}>
            <View style={styles.curStatLabel}>
              <View style={styles.labelEmt}/>
              <Text style={styles.curStatLabelText}>当前统计</Text>
            </View>
            <View style={styles.calendarWrap}>
              <View style={styles.calTips}>
                <Image style={styles.calIcon} source={require('../../../src/img/agent_calendar.png')} />
                <Text style={styles.calTipsText}>日期</Text>
              </View>
              <View style={styles.calArea}>
                <TouchableOpacity style={styles.cal}
                  onPress={() =>
                    navigation.navigate('CalendarPage', { onDateChange: this.handleDateChange })}>
                    {startDate === '2016-01-01'
                      ? <Text>-</Text>
                      : <Text>{replaceWithDot(startDate)}</Text>}
                </TouchableOpacity>
                <View style={styles.calToCal} />
                <TouchableOpacity style={styles.cal}
                  onPress={() => navigation.navigate('CalendarPage', { onDateChange: this.handleDateChange })}>
                    {startDate === '2016-01-01'
                      ? <Text>{replaceWithDot(yesterday())}</Text>
                      : <Text>{replaceWithDot(endDate)}</Text>}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.curStatData}>
              <View style={styles.curStatDataRow}>
                <Text style={styles.curStatDataText}>{`充值：${curStatData.recharge || 0}`}</Text>
                <Text style={[styles.curStatDataText, styles.curStatDataRowRight]}>{`投注：${curStatData.bet || 0}`}</Text>
              </View>
              <View style={styles.curStatDataRow}>
                <Text style={styles.curStatDataText}>{`提现：${curStatData.withdraw || 0}`}</Text>
                <Text style={[styles.curStatDataText, styles.curStatDataRowRight]}>{`派彩：${curStatData.bonus || 0}`}</Text>
              </View>
              <View style={styles.curStatDataRow}>
                <Text style={styles.curStatDataText}>{`实际盈亏：${curStatData.teamProfit || 0}`}</Text>
                <Text style={[styles.curStatDataText, styles.curStatDataRowRight]}>{`派彩盈亏：${curStatData.bonusProfit || 0}`}</Text>
              </View>
              <View style={styles.curStatDataRow}>
                <Text style={[styles.curStatDataText, styles.curStatDataRowRight]}>{`代理佣金：${curStatData.income || 0}`}</Text>
              </View>
            </View>
            <View style={styles.curStatDataBtnWrap}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.curStatDataBtn}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  navigation.navigate('CurStatDetail', { dataList: curStatDetail })
                }}>
                <Text style={styles.curStatDataBtnText}>详情</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  curStatDataBtnWrap: {
    marginTop: 15,
    marginBottom: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  curStatDataBtn: {
    width: 95.5,
    height: 23,
    backgroundColor: '#8BC0FF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  curStatDataBtnText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  curStatData: {
    height: 149,
    paddingTop: 6,
  },
  curStatDataRow: {
    height: 35,
    paddingHorizontal: 19,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  curStatDataText: {
    flex: 1,
    color: '#333333',
    fontSize: 14,
  },
  curStatDataRowRight: {
    flex: 0.7,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  statistics: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
  },
  statisticsRow: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statisticsRowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emt: {
    width: 7,
    height: 7,
    marginLeft: 10,
    marginRight: 7,
  },
  labelText: {
    color: '#999999',
    fontSize: 12,
  },
  statisticsRowRight: {
    flex: 2.5,
  },
  contentText: {
    color: '#333333',
    fontSize: 14,
  },
  curStat: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  curStatLabel: {
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelEmt: {
    width: 3,
    height: 15,
    backgroundColor: Config.baseColor,
  },
  curStatLabelText: {
    fontSize: 14,
    color: '#333333',
    paddingLeft: 11,
  },
  calendarWrap: {
    height: 40,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  calTips: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calIcon: {
    width: 16.61,
    height: 14.85,
  },
  calTipsText: {
    marginLeft: 5,
    color: '#333333',
    fontSize: 14,
  },
  calArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cal: {
    width: 85,
    height: 25,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  calToCal: {
    backgroundColor: '#333333',
    width: 14,
    height: 1,
    marginHorizontal: 8.5,
  },
})
