import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { formatMoney } from '../../../utils/formatUtil'
import { LoadingView, NoDataViewText } from '../../../components/common'

const winWidth = Dimensions.get('window').width

export default class BonusList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      isLoading: true,
      isNetWorkOk: true,
    }
  }

  componentDidMount() {
    this.getBonusList(this.props.id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.getBonusList(nextProps.id)
    }
  }

  getBonusList = (lotteryId) => {
    fetchWithOutStatus({
      act: 10010,
      lottery_id: lotteryId,
    }).then((res) => {
      this.setState({ dataList: res, isLoading: false })
    }).catch(() => {
      this.setState({ isLoading: false, isNetWorkOk: false })
    })
  }

  _renderItem(item, index) {
    if (item.play_info) {
      return (
        <View key={index}>
          <View style={[styles.itemWrap, { backgroundColor: '#FFF' }]}>
            <Text>{item.play_info.play_name}</Text>
            <Text>{`奖金${formatMoney(item.play_info.play_odds)}`}</Text>
          </View>
        </View>
      )
    }
    return null
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingView />
    } else if (!this.state.isNetWorkOk || this.state.dataList.length === 0) {
      return <NoDataViewText />
    }
    return (
      <View style={styles.container}>

        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}>
          {
            this.state.dataList.map((item, index) => {
              return (
                <View key={`bonus${index}`}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.title}>{item.type_name}</Text>
                    <Text style={styles.title}>{item.type_rebate === null ? `返点0.00%` :`返点${item.type_rebate}%`}</Text>
                  </View>
                  {
                    item.play_info.map((playItem, i) => {
                      return (
                        <View key={`play${i}`} style={[styles.itemWrap, { backgroundColor: '#FFF' }]}>
                          <Text style={{width: 80}}>{playItem.play_name}</Text>
                          {
                            i === 0
                              ? <Text style={{width: winWidth - 80 - 20, textAlign: 'right'}}>{`赔率 ${playItem.play_odds.replace(/,/g, ', ')}`}</Text>
                              : <Text style={{width: winWidth - 80 - 20, textAlign: 'right'}}>{`${playItem.play_odds.replace(/,/g, ', ')}`}</Text>
                          }
                        </View>
                      )
                    })
                  }
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  title: {
    color: '#F2490C',
    fontSize: 12,
  },
  itemWrap: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
})
