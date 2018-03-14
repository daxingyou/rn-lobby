import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text,
    TouchableOpacity, ListView, Animated } from 'react-native'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import GiftedListView from '../../components/github/GiftedListView'
import ResultHeadlBar from '../../components/resultHeadBar'
import { LoadingView, NoDataView, NoNetworkView } from '../../components/common'
import { ballWrapMatch, lucky28BallWrapMatch } from '../../utils/imgMatchUtil'
import Button from '../../components/ButtonIos'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import BallStyle from '../../utils/ballStyle'
import { yesterday } from '../../utils'
import { goToLottery } from '../../utils/navigation'

const windowWidth = Dimensions.get('window').width
const today = (new Date()).toISOString().slice(0,10)
const lastDay = yesterday()

export default class LotteryListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      dataList: [],
      nowData: null,
      time: 0,
      issue_no: 0,
      lotteryName: '',
      lotteryImage:'',
      refreshing: false,
      isFirstLoading: true,
      isNetWorkOk: true,
      cd:'00:00',
      pullToRefresh: false,
    }
  }
  componentDidMount() {
    this._fetchLatestData()
    this.timInterval = setInterval(()=>{
      if(parseInt(this.state.time) < 1) {
        this._fethNowData()
      } else {
        this.setState({time:this.state.time - 1},()=>{
          this.cdFormat(this.state.time)
        })
      }
    },1000)

    this.animatedValue = new Animated.Value(0)
  }

  componentWillUnmount() {
    clearInterval(this.timInterval)
  }

  _fethNowData = () => {
    fetchWithOutStatus({
      act: 10003,
      lottery_id: this.props.navigation.state.params.lotteryId,
    }).then(res => {
      const time = res.end_time - res.now_time
      this.setState({
        time: time,
        issue_no: res.issue_no,
        lotteryImage: res.lottery_image,
        lotteryName: res.lottery_name,
      })
      this.cdFormat(time)
    })
  }
  cdFormat = (time) => {
    let sec = time % 60 < 10 ? '0' + time % 60 : time % 60
    let min = Math.floor(time / 60) % 60 < 10
      ? '0' + Math.floor(time / 60) % 60 : Math.floor(time / 60) % 60

    let hour = Math.floor(time / 3600) % 60 < 10
      ? '0'+ Math.floor(time / 3600) % 60 : Math.floor(time / 3600) % 60

    let cd = hour === '00' ? min + ':' + sec : hour + ":" + min + ':' + sec
    this.setState({cd})
  }

  _fetchLatestData = (pullToRefresh) => {
    if (pullToRefresh){
      this.setState({ pullToRefresh: true })
    }
    this.setState({ refreshing: true })
    this._fetchData().then(result => {
      if (pullToRefresh) {
        const oldResult = this.state.dataList.reduce((pre, current) => {
          pre.push(current.issue_no)
          return pre
        }, [])
        const newResult = result.map(item => {
          if (oldResult.includes(item.issue_no)) {
            return item
          } else {
            return {
              ...item,
              changed: true,
            }
          }
        })
        this.setState({ dataList: newResult })
        this.animatedValue = new Animated.Value(0)
      } else {
        this.setState({ dataList: result })
      }
      this.setState({
        refreshing: false,
        isFirstLoading: false,
        pullToRefresh: false,
      })
    }).catch(() => {
      this.setState({ isLoading: false, isFirstLoading: false, isNetWorkOk: false, pullToRefresh: false  })
    })
  }

  _fetchData = () => {
    return fetchWithOutStatus({
      act: 10005,
      lottery_id: this.props.navigation.state.params.lotteryId,
    }).then(result => {
      return result
    })
  }

  _renderRow = (itemData, sectionID, rowID) => { // 显示的每一行row
    const nums = itemData && itemData.prize_num ? itemData.prize_num.split(',') : []
    const { categoryId } = this.props.navigation.state.params

    if (itemData.changed) {
      Animated.timing(this.animatedValue, {
        toValue: 100,
        duration: 1000,
      }).start()
    }
    const interpolateColor = this.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['#DAEFFF', 'white'],
    })
    const animatedStyle = {
      backgroundColor: interpolateColor,
    }

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.itemContainer}>
        <Animated.View style={[{width: windowWidth, alignItems: 'center', padding: 10, paddingBottom: 8}, itemData.changed && animatedStyle]}>
          <View style={{
            width: windowWidth - 20, flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#999' }}>{'第'}{itemData.issue_no}{'期'}</Text>
            <Text style={{ fontSize: 12, color: '#999' }}>
              {
                itemData.prize_time ? (itemData.prize_time.slice(0,10) === today ? '今天 '+itemData.prize_time.slice(11,19) : (itemData.prize_time.slice(0,10) === lastDay ? '昨天 '+itemData.prize_time.slice(11,19) : itemData.prize_time.split(/\d{4}-/)[1])) : '00-00 00:00:00'
              }
            </Text>
          </View>
          <View style={{ width: windowWidth - 20, flexDirection: 'row', marginTop: 8 }}>
            {
              (()=>{
                if(['7', '8'].includes(categoryId)){
                  return nums.map((item, index) => {
                    if (index === 6) {
                      return (
                        <View style={{ flexDirection: 'row' }} key={index}>
                          <Text style={{ fontSize: 18, marginHorizontal: 3 }}>+</Text>
                          <View key={index}
                            style={[styles.ballWrap,
                            { backgroundColor: ballWrapMatch[item], marginLeft: 2 }]}>
                            <Text style={styles.ballText}>{item}</Text>
                          </View>
                        </View>
                      )
                    }
                    return (
                      <View style={[styles.ballWrap, { backgroundColor: ballWrapMatch[item] }]} key={index}>
                        <Text style={styles.ballText}>{item}</Text>
                      </View>
                    )
                  })
                } else if (categoryId === '6'){
                    return nums.map((item, index)=>{
                      if (index === 3) {
                      return (
                        <View style={{ flexDirection: 'row' }} key={index}>
                          <Text style={{ fontSize: 18, marginHorizontal: 3 }}>=</Text>
                          <View style={{ alignItems: 'center' }}>
                            <View style={[styles.ballWrap,  { backgroundColor: lucky28BallWrapMatch[item] }]}>
                              <Text style={styles.ballText}>{item}</Text>
                            </View>
                          </View>
                        </View>
                      )
                    }else if(index === 2){
                      return (
                        <View style={{ flexDirection: 'row' }} key={index}>
                          <View style={{ alignItems: 'center' }}>
                            <View style={[styles.ballWrap]}>
                              <Text style={styles.ballText}>{item}</Text>
                            </View>
                          </View>
                        </View>
                      )
                    }
                    return (
                      <View style={{ flexDirection: 'row' }} key={index}>
                        <View style={{ alignItems: 'center' }}>
                          <View style={[styles.ballWrap]}>
                            <Text style={styles.ballText}>{item}</Text>
                          </View>
                        </View>
                        <Text style={{ fontSize: 18, marginHorizontal: 3 }}>+</Text>
                      </View>
                    )
                    })
                  } else if(categoryId === '2'){
                    let n = 0
                    return (
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={styles.k3Wrap}>
                          {
                            nums.map((item, index)=>{
                              n += Number(item)
                              return BallStyle(item,index,'2')
                            })
                          }
                        </View>
                        <Text style={{marginLeft: 13.5, fontSize: 12, letterSpacing: 1.2, color: '#999999'}}>
                          和值:
                          <Text style={{fontSize: 14, letterSpacing: 1.2, color: '#000000'}}>{n}</Text>
                        </Text>
                      </View>
                    )
                   } else {
                    return nums.map((item,index)=>{
                      return (
                        <View style={[styles.ballWrap, rowID !== '0' ? {backgroundColor: 'transparent'} : null]} key={index}>
                          <Text style={[styles.ballText, rowID !== '0' ? {color: Config.baseColor} : null]}>{item}</Text>
                        </View>
                      )
                    })
                  }
              })()
            }
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  renderContent = () => {
    const dataSource = this.state.dataSource.cloneWithRows(this.state.dataList)

    if (this.state.isFirstLoading) {
      return (
        <LoadingView />
      )
    } else if (!this.state.isNetWorkOk) {
      return <NoNetworkView />
    } else if (!this.state.isLoading && !this.state.isFirstLoading && this.state.dataList.length === 0) {
      return (
        <NoDataView
          text={'暂时没有该彩票详情'}/>
      )
    }
    return (
      <GiftedListView
        refreshing={this.state.refreshing}
        fetchLatestData={this._fetchLatestData}
        dataSource={dataSource}
        notRenderFooter={true}
        renderRow={this._renderRow}
        pullToRefresh={this.state.pullToRefresh}/>
    )
  }

  render() {
    const { lotteryImage, lotteryName, issue_no, cd, dataList } = this.state
    const { navigation } = this.props
    const { lotteryId, fromBetPage, categoryId } = navigation.state.params
    const title = lotteryName || '彩票详情'

    return (
      <View style={styles.container}>
        <ResultHeadlBar
          title={title}
          leftIcon={'back'}
          issue_no={issue_no}
          lotteryImage={lotteryImage}
          cd={cd}
          leftIconAction={() => navigation.goBack()}/>
        {
          this.renderContent()
        }
        {
          dataList.length > 0 && (
            <Button
              text='去购彩'
              styleTextLeft={{ color: 'white', fontSize: 18 }}
              containerStyle={{ backgroundColor: Config.baseColor,
                height:49,justifyContent:'center', alignItems: 'center' }}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  goToLottery(navigation, categoryId, lotteryId, null, null, fromBetPage)
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
    backgroundColor: '#F7F9FC',
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  ballWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    backgroundColor: Config.baseColor,
  },
  ballText: {
    fontSize: 15,
    color: 'white',
    backgroundColor: 'transparent',
  },
  k3Wrap: {
    width: 126,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#38BE4F',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
})
