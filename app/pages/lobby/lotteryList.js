import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ListView,
} from 'react-native'
import LotteryNavBar from '../../components/lotteryNavBar'
import LotteryListItem from './lotteryListItem'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class LotteryList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { navigation } = this.props
    const { lotteryList } = navigation.state.params
    return (
      <View style={styles.container}>
        <LotteryNavBar
          title='全部彩种'
          backFun={() => {
            navigation.goBack()
          }}/>
          <ListView
            enableEmptySections={true}
            removeClippedSubviews={false}
            style={{backgroundColor: '#FFF', flex: 1}}
            dataSource={ds.cloneWithRows(lotteryList.filter(n => n.category_name != '热门'))}
            renderRow={(rowData) => <LotteryListItem navigation={navigation} data={rowData}/>}/>
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
