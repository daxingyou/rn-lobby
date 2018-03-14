import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'

import LoadingView from '../../../components/LoadingView'
import Immutable from 'immutable'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import Sound from '../../../components/clickSound'

let sortIcon = require('../../../src/img/trend_sort.png')
let sortActIcon = require('../../../src/img/trend_sort_act.png')

export default class HotCold extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: -1,
      sortType: 'asc',
      sortItem: 'num',
      sortList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      units: [
        {label: '万位', code: 'myriabit'},
        {label: '千位', code: 'thousands'},
        {label: '百位', code: 'hundreds'},
        {label: '十位', code: 'tens'},
        {label: '个位', code: 'units'},
      ],
    }
    this.sort = this.sort.bind(this)
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getData(this.props.displayPeriods)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.displayPeriods !== nextProps.displayPeriods) {
      this.getData(nextProps.displayPeriods)
    }
  }

  getData(displayPeriods) {
    fetchWithOutStatus({
      act: 10055,
      lotteryId: this.props.lotteryId,
      count: displayPeriods,
    }).then((res) => {
      if (res) {
        this.setState({
          data: res,
        })
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  sort(item) {
    const { sortType, sortItem, sortList, data } = this.state
    let type = 'asc'
    let sortFun = (a, b) => a - b
    let newList = []

    if (item == sortItem) {
      if (sortType == 'asc') {
        type = 'desc'
        sortFun = (a, b) => b - a
      } else {
        sortType == 'asc'
      }
    }

    if (item == 'num') {
      newList = sortList.sort(sortFun)
    } else {
      let sourceObj = Immutable.fromJS(data[item]).toJS()
      delete sourceObj['hotCount']
      delete sourceObj['coldCount']
      let newData = Object.values(sourceObj).sort(sortFun)
      for (let cell of newData) {
        for (let [k, v] of Object.entries(sourceObj)) {
          if (cell == v) {
            newList.push(k)
            delete sourceObj[k]
          }
        }
      }
    }
    this.setState({
      sortType: type,
      sortItem: item,
      sortList: newList,
    })
  }


  render() {
    const { displayPeriods } = this.props
    const { data, sortType, sortItem, sortList, units } = this.state
    if (data == -1) {
      return <LoadingView/>
    }
    return (
      <View style={{flex: 1}}>
        <View style={[styles.title]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.num}
            onPress={() => {
              Sound.stop()
              Sound.play()
              this.sort('num')
            }}>
            <Text style={styles.titleText}>号码</Text>
            <View style={styles.sortWrap}>
              <Image
                source={sortItem == 'num' && sortType == 'asc' ? sortActIcon : sortIcon}
                style={[styles.sortIcon]}/>
              <Image
                source={sortItem == 'num' && sortType == 'desc' ? sortActIcon : sortIcon}
                style={[
                  styles.sortIcon,
                  styles.sortIconMirror,
                ]}/>
            </View>
          </TouchableOpacity>
          {
            units.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.cell}
                  activeOpacity={0.85}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.sort(item.code)
                  }}>
                  <Text style={styles.titleText}>{item.label}</Text>
                  <View style={styles.sortWrap}>
                    <Image
                      source={sortItem == item.code && sortType == 'asc' ? sortActIcon : sortIcon}
                      style={[styles.sortIcon]}/>
                    <Image
                      source={sortItem == item.code && sortType == 'desc' ? sortActIcon : sortIcon}
                      style={[
                        styles.sortIcon,
                        styles.sortIconMirror,
                      ]}/>
                  </View>
                </TouchableOpacity>
              )
            })
          }
        </View>
        <ScrollView style={{flex: 1}}>
        {
          data != -1 && (
            <View style={styles.content}>
              <View style={styles.col}>
              {
                sortList.map((item, index) => {
                  return (
                    <View key={index} style={[styles.ctNum, index % 2 != 0 ? {backgroundColor: '#F8F8F8'} : null]}>
                      <View style={styles.numWrap}>
                        <Text style={styles.NumText}>{item}</Text>
                      </View>
                    </View>
                  )
                })
              }
              </View>
              {
                units.map((unit, index) => {
                  return (
                    <View key={index} style={styles.col}>
                    {
                      sortList.map((item, index) => {
                        let val = data[unit.code][item]
                        return (
                          <View key={index} style={[styles.ctCell, index % 2 != 0 ? {backgroundColor: '#F8F8F8'} : null]}>
                            <Text style={[
                              styles.ctText,
                              data[unit.code]['hotCount'] == val ? styles.hotText : null,
                              data[unit.code]['coldCount'] == val ? styles.coldText : null,
                            ]}>
                              {val}
                            </Text>
                          </View>
                        )
                      })
                    }
                    </View>
                  )
                })
              }
            </View>
          )
        }
        <View style={styles.tips}>
          <Text style={styles.tipsText}>
          {
            `展示为近${displayPeriods}期开奖号码里，号码1~9在万、千、百、十、个位上的出现次数，红色为出现次数最多的号码，蓝色为出现次数最少的号码。`
          }
          </Text>
        </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  sortIconMirror: {
    transform: [{rotate: '180deg'}],
    marginTop: 3.165,
  },
  sortIcon: {
    width: 7,
    height: 5.835,
  },
  sortWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 5.5,
  },
  coldText: {
    color: '#0E86E3',
    fontWeight: 'bold',
  },
  hotText: {
    color: '#DD1414',
    fontWeight: 'bold',
  },
  tipsText: {
    fontSize: 12,
    color: '#666666',
  },
  tips: {
    margin: 10,
  },
  NumText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  numWrap: {
    width: 25,
    height: 25,
    backgroundColor: '#EC0909',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctCell: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  ctNum: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  col: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 14,
    color: '#9198AB',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  num: {
    flex: 1,
    flexDirection: 'row',
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
