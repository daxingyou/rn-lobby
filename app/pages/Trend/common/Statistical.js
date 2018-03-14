import React from 'react'
import {
  StyleSheet,
  View,
  Text, ScrollView,
} from 'react-native'
import { ballColor } from '../CommonTrend/GridView'

const Statistical = ({ stat, label, width, flex, horizontal, selectedType }) => {
  const ballWithText = ['生肖', '色波'].includes(selectedType)
  const borderLeft = {borderLeftWidth: StyleSheet.hairlineWidth}
  const borderRight = {borderRightWidth: StyleSheet.hairlineWidth}
  const borderBottom = {borderBottomWidth: StyleSheet.hairlineWidth}
  let columnStyle
  let numStyle
  if (typeof width !== 'undefined') {
    columnStyle = { width }
  } else {
    columnStyle = { flex }
  }
  if (horizontal) {
    numStyle = {width: 30}
  } else {
    numStyle = null
  }

  return (
    <ScrollView
      ref={ref => this._scrollView = ref}
      style={styles.statistical}
      onLayout={() => {
        this._scrollView.scrollTo({x: 0, y: 0, animated: false})
      }}>
      {
        ballWithText
          ? (
            selectedType === '色波'
              ? (
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.sRow}>
                    <View style={[styles.label, {width: 55}]}>
                      <Text style={styles.totalText}>统计</Text>
                    </View>
                  </View>
                  <View style={styles.sRow}>
                    {
                      stat.map((num, index) => {
                        return (
                          <View style={[styles.numWrap, {width: index === 7 ? 90 : 65, height: 40}, borderLeft]} key={index}>
                            <Text style={styles.gText}>
                              <Text style={{color: ballColor['lhc_ball_red']}}>{num.lhc_ball_red || 0}</Text>
                              <Text>:</Text>
                              <Text style={{color: ballColor['lhc_ball_blue']}}>{num.lhc_ball_blue || 0}</Text>
                              <Text>:</Text>
                              <Text style={{color: ballColor['lhc_ball_green']}}>{num.lhc_ball_green || 0}</Text>
                            </Text>
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              )
              : (
                stat.map((rowData, rowID) => {
                  return (
                    <View style={{flexDirection: 'row'}} key={rowID}>
                      <View style={[styles.sRow, borderBottom]}>
                        <View style={[styles.label, {width: 55}]}>
                          <Text style={styles.totalText}>{rowData.label}</Text>
                        </View>
                        {
                          Object.keys(rowData).includes('countY') &&
                          rowData['countY'].map((num, index) =>
                          {
                            return (
                              <View style={[styles.numWrap, {width: 40}, borderLeft]} key={index}>
                                <Text style={styles.gText}>{num}</Text>
                              </View>
                            )
                          })
                        }
                      </View>
                      <View style={styles.sRow}>
                        {
                          Object.keys(rowData).includes('countY') &&
                          rowData['all'].map((num, index) =>
                          {
                            const  filledIndex = rowID
                            return (
                              <View style={[styles.numWrap, {width: 30}, index === 0 && borderLeft, index <= filledIndex && borderBottom, index >= filledIndex && borderRight ]} key={index}>
                                <Text style={styles.gText}>{num}</Text>
                              </View>
                            )
                          })
                        }
                      </View>
                    </View>
                  )
                })
              )
          )
          : (
            stat.map((rowData, rowID) => {
              let data = rowData.data
              let ArrayData = []
              if (Array.isArray(data[label])) {
                ArrayData = data[label]
              } else {
                Object.keys(data[label]).sort((a, b) => a - b).map((item) => ArrayData.push(data[label][item]))
              }
              return (
                <View style={[styles.sRow, borderBottom]} key={rowID}>
                  <View style={[styles.label, columnStyle]}>
                    <Text style={styles.totalText}>{rowData.label}</Text>
                  </View>
                  {
                      ArrayData.map((num, index) =>
                       {
                         return (
                           <View style={[styles.numWrap, {flex: 1}, borderLeft, numStyle]} key={index}>
                             <Text style={styles.gText}>{Math.round(num)}</Text>
                           </View>
                         )
                       })
                  }
                </View>
              )
            })
          )
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  statistical: {
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sRow: {
    backgroundColor: '#EDFFD1',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
  },
  label: {
    alignItems: 'center',
  },
  totalText: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: 'transparent',
  },
  numWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DCDCDC',
    height: 30,
  },
  gText: {
    fontSize: 14,
    color: '#B6BDCF',
    backgroundColor: 'transparent',
  },
})

export default Statistical
