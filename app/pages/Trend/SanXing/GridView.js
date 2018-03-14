import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native'

export default class GridView extends Component {
  render() {
    const { positon, data, index, setRef, showMisData } = this.props
    let positonIndex = [0, 1, 2]
    if (positon === 'frontThree') {
      positonIndex = [0, 1, 2]
    } else if (positon === 'middleThree') {
      positonIndex = [1, 2, 3]
    } else if (positon === 'backThree') {
      positonIndex = [2, 3, 4]
    }
    return (
      <View style={{flex: 1}}>
        <View style={styles.title}>
          <View style={styles.issue}>
            <Text style={styles.titleText}>期号</Text>
          </View>
          <View style={styles.num}>
            <Text style={styles.titleText}>开奖号码</Text>
          </View>
          <View style={styles.baozi}>
            <Text style={styles.titleText}>豹子</Text>
          </View>
          <View style={styles.zusan}>
            <Text style={styles.titleText}>组三</Text>
          </View>
          <View style={styles.zuliu}>
            <Text style={styles.titleText}>组六</Text>
          </View>
        </View>
        <ScrollView style={{flex: 1}} ref={r => { setRef && setRef(r, index) }}>
          {
            data.map((item, index) => {
              return (
                <View key={index} style={[styles.row, index % 2 != 0 ? {backgroundColor: '#F8F8F8'} : null]}>
                  <View style={styles.issue}>
                    <Text style={styles.ctText}>{item.issueNo.slice(-4)}期</Text>
                  </View>
                  <View style={styles.num}>
                  {
                    item.prizeNum && item.prizeNum.split(',').map((num, index) => {
                      return (
                        <Text key={index} style={[styles.ctText, {letterSpacing: 4}, positonIndex.includes(index) ? {color: '#DD1414'} : null]}>{num}</Text>
                      )
                    })
                  }
                  </View>
                  <View style={styles.baozi}>
                    <Text style={styles.ctText}>{item[positon]['1'] == 0 ? '豹子' : showMisData ? item[positon]['1'] : ''}</Text>
                  </View>
                  <View style={styles.zusan}>
                    <Text style={styles.ctText}>{item[positon]['2'] == 0 ? '组三' : showMisData ? item[positon]['2'] : ''}</Text>
                  </View>
                  <View style={styles.zuliu}>
                    <Text style={styles.ctText}>{item[positon]['3'] == 0 ? '组六' : showMisData ? item[positon]['3'] : ''}</Text>
                  </View>
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
  ctText: {
    color: '#9198AB',
    fontSize: 14,
  },
  row: {
    height: 30,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  titleText: {
    color: '#9198AB',
    fontSize: 12,
  },
  zuliu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  zusan: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  baozi: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  num: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  issue: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    height: 30,
    backgroundColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'stretch',
  },

})
