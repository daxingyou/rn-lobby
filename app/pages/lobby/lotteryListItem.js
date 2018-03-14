import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import Sound from '../../components/clickSound'
import { goToLottery } from '../../utils/navigation'

const defLotteryLogo = require('../../src/img/ic_def_lottery.png')
const screenWidth = Dimensions.get('window').width

export default class LotteryListItem extends Component {
  render() {
    const { data, navigation } = this.props
    let displayList = data.lottery_info
    if ((data.lottery_info.length) % 3 !== 0) {
      displayList = displayList.concat(Array.from({length: 3 - ((data.lottery_info.length) % 3)}))
    }
    return (
      <View style={styles.container}>
        <View style={styles.label}>
          <Text style={styles.labelText}>{data.category_name}</Text>
        </View>
        <View style={styles.list}>
        {
          displayList.map((item, index) => {
            if (item) {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.item, index !== 0 && (index + 1) % 3 === 0 && {marginRight: 0}]}
                  underlayColor='transparent'
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    goToLottery(navigation, item.category_id, item.lottery_id)
                  }}>
                  <Image source={item.lottery_image && item.lottery_image !== '' ? {uri: item.lottery_image} : defLotteryLogo} style={styles.logo}/>
                  <Text style={styles.itemText}>{item.lottery_name}</Text>
                </TouchableOpacity>
              )
            } else {
              return (
                <View style={[styles.item, index !== 0 && (index + 1) % 3 === 0 && {marginRight: 0}]} key={index} />
              )
            }

          })
        }
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F3',
  },
  label: {
    height: 30,
    backgroundColor: '#F2F2F3',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  labelText: {
    fontSize: 13,
    color: '#333333',
  },
  list: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width:(screenWidth - 2) / 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    marginRight: 1,
  },
  logo: {
    width:40,
    height: 40,
    resizeMode: 'contain',
  },
  itemText: {
    color: '#333333',
    fontSize: 15,
    paddingTop: 12,
  },
})
