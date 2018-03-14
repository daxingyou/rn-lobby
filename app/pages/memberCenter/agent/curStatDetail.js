import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import Sound from '../../../components/clickSound'


export default class CurStatDetail extends Component {

  render() {
    const { dataList } = this.props.navigation.state.params
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'详情'}
          leftIcon={'back'}
          leftIconAction={() => {
            Sound.stop()
            Sound.play()
            this.props.navigation.goBack()
          }}/>
        <ScrollView style={{flex: 1}}>
          <View style={styles.table}>
            <View style={[styles.columns, styles.fixedCol]}>
              <View style={[styles.cell, styles.label]}>
                <Text style={styles.cellText}>账号</Text>
              </View>
              {
                Array.isArray(dataList) && dataList.map((item, index) => {
                  return (
                    <View style={styles.row} key={index}>
                      <View style={styles.cell}>
                        <Text style={styles.cellText}>{item.userName}</Text>
                      </View>
                    </View>
                  )
                })
              }
            </View>
            <ScrollView style={{flex: 1}} horizontal={true}>
              <View style={styles.columns}>
                <View style={styles.row}>
                  <View style={[styles.cell, styles.label]}>
                    <Text style={styles.cellText}>充值</Text>
                  </View>
                  <View style={[styles.cell, styles.label]}>
                    <Text style={styles.cellText}>提现</Text>
                  </View>
                  <View style={[styles.cell, styles.label]}>
                    <Text style={styles.cellText}>投注</Text>
                  </View>
                  <View style={[styles.cell, styles.label]}>
                    <Text style={styles.cellText}>派彩</Text>
                  </View>
                  <View style={[styles.cell, styles.label]}>
                    <Text style={styles.cellText}>佣金</Text>
                  </View>
                </View>
                {
                  Array.isArray(dataList) && dataList.map((item, index) => {
                    return (
                      <View style={styles.row} key={index}>
                        <View style={styles.cell}>
                          <Text style={styles.cellText}>{item.recharge}</Text>
                        </View>
                        <View style={styles.cell}>
                          <Text style={styles.cellText}>{item.withdraw}</Text>
                        </View>
                        <View style={styles.cell}>
                          <Text style={styles.cellText}>{item.bet}</Text>
                        </View>
                        <View style={styles.cell}>
                          <Text style={styles.cellText}>{item.bonus}</Text>
                        </View>
                        <View style={styles.cell}>
                          <Text style={styles.cellText}>{item.income || 0}</Text>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  columns: {
    flexDirection: 'column',
  },
  fixedCol: {
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowColor: '#9F9F9F',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  table: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#E5E5E5',
  },
  row: {
    height: 40,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  cell: {
    width: 125,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    backgroundColor: '#F4F4F4',
    height: 40,
  },
})
