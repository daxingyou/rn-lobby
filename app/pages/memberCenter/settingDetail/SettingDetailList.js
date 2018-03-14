import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { LoadingView, NoDataViewText } from '../../../components/common'

export default class SettingDetailList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      isLoading: false,
      isNetWorkOk: true,
    }
  }

  componentDidMount() {
    this.reFresh(this.props.id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.reFresh(nextProps.id)
    }
  }

  reFresh = (lotteryId) => {
    this.setState({ isLoading: true })
    const headers = { token: this.props.token }
    fetchWithOutStatus({
      act: 10018,
      lottery_id: lotteryId,
    }, headers).then((res) => {
      this.setState({ dataList: res, isLoading: false })
    }).catch((err) => {
      console.warn('ERR', err)
      this.setState({ isLoading: false, isNetWorkOk: false })
    })
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingView />
    } else if (!this.state.isNetWorkOk || this.state.dataList.length === 0) {
      return <NoDataViewText />
    }
    return (
      <View style={styles.container}>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { flex: 1.5 }]}>项目</Text>
          <Text style={styles.title}>单项(号)限额</Text>
          <Text style={[styles.title, { textAlign: 'right' }]}>单注限额</Text>
        </View>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}>
          <View style={{ backgroundColor: '#FFF' }}>
            {
              this.state.dataList.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={styles.itemWrap}>
                    <Text style={[styles.text, { flex: 1.5 }]}>{item.name}</Text>
                    <Text style={styles.text}>{item.item_bet_max}</Text>
                    <Text style={[styles.text, { textAlign: 'right' }]}>{item.stake_bet_max}</Text>
                  </View>
                )
              })
            }
          </View>
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
    padding: 10,
    backgroundColor: '#FFEEEE',
  },
  title: {
    flex: 1,
    fontSize: 14,
  },
  itemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  text: {
    flex: 1,
    fontSize: 13,
  },
})
