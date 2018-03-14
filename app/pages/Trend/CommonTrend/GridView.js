import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  ART,
} from 'react-native'
import LoadingView from '../../../components/LoadingView'
import Config from '../../../config/global'
import Statistical from '../common/Statistical'
import calLine from '../../../utils/polyline'
import { ballColor as utils } from '../../../utils/ballStyle'

export const ballColor = {
  lhc_ball_red: utils.red,
  lhc_ball_blue: utils.blue,
  lhc_ball_green: utils.green,
}
const windowWidth = Dimensions.get('window').width
const lhcStyle = {
  '生肖': {
    flexDirection: 'column',
    width: 40,
    height: 50,
  },
  '色波': {
    flexDirection: 'row',
    width: 65,
    height: 40,
  },
}

const numStyle = ({index, tabLabel, categoryId, selectedType, horizontal}) => {
  if (horizontal) {
    if (categoryId === '3') {
      return {width: 60}
    } else if (selectedType === '色波') {
      return {width: 90}
    } else {
      return {width: 30}
    }
  }

  let flex = 1
  if ((tabLabel === '冠亚和两面' || ['7', '8'].includes(categoryId)) && index === 0) {
    flex = 1.5
  } else if (categoryId === '2' && selectedType ==='基本走势') {
    if ([0, 1].includes(index)) {
      flex = 1.5
    } else {
      flex = 2
    }
  }
  return { flex }
}

// FIX ME 把style判断移除map
const Title = ({ hidePrizeColumn, titles, issueStyle, prizeStyle, categoryId, tabLabel, selectedType, horizontal}) => {
  const ballWithText = ['生肖', '色波'].includes(selectedType)

  return (
    <View style={[styles.row, styles.title, ballWithText && {height: 50}]}>

      <View style={[styles.issue, issueStyle]}>
        <Text style={styles.titleText}>期号</Text>
      </View>

      {
        !hidePrizeColumn && (
          <View style={[styles.nums, ballWithText ? {width: lhcStyle[selectedType]['width']*7, flexDirection: 'column'} : prizeStyle]}>
            <View  style={{height: 15, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={[styles.titleText, {width: 100, textAlign: 'center', marginBottom: ballWithText ? 8 : 0}]}>开奖号码</Text>
            </View>
            {
              ballWithText && (
                <View style={{height: 15, width: lhcStyle[selectedType]['width']*7, flexDirection: 'row'}}>
                  {['正一', '正二', '正三', '正四', '正五', '正六', '特码'].map(subTitle => {
                    return (
                      <View key={subTitle} style={[styles.subNum, {width: lhcStyle[selectedType]['width'], height: 25, borderTopWidth: StyleSheet.hairlineWidth}]}>
                        <Text style={[styles.titleText]}>{subTitle}</Text>
                      </View>
                    )
                  })}
                </View>
              )
            }
          </View>
        )
      }

      {
        titles.map((title, index) => {
          return (
            <View key={title} style={[styles.san, numStyle({index, tabLabel, categoryId, selectedType, horizontal}), (categoryId === '3' && index === 0 && {width:90})]}>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          )
        })
      }

    </View>
  )
}

export default class GridView extends Component {
  widthSize = (windowWidth) => {
    if (windowWidth <= 320) {
      return {
        width: 16,
        size: 11,
      }
    } else if (320 < windowWidth && windowWidth <= 350) {
      return {
        width: 17,
        size: 12,
      }
    } else if (350 < windowWidth && windowWidth <= 380) {
      return {
        width: 18,
        size: 13,
      }
    } else if (380 < windowWidth && windowWidth <= 410) {
      return {
        width: 19,
        size: 14,
      }
    } else {
      return {
        width: 20,
        size: 15,
      }
    }
  }

  PrizeNumSize = () => {
    const { categoryId, selectedType } = this.props

    let width = 20
    let size = 15
    if (['5', '6'].includes(categoryId) && selectedType === '基本走势') {
      width = this.widthSize(windowWidth).width
      size = this.widthSize(windowWidth).size
    }
    return { width, size }
  }

  fixPrizeNum = (prizeNum) => {
    if (this.props.categoryId === '6') {
      const splits = prizeNum.split(',')
      return `${splits[0]},+,${splits[1]},+,${splits[2]},=,${splits[3]}`
    } else {
      return prizeNum
    }
  }

  formats = (val, type) => {
    const one = ['三同号', '豹子', '杂六']
    const two = ['二同号', '组三', '半顺']
    const three = ['三不同号', '组六', '顺子']
    const four = ['三连号']
    if (val === 1) {
      return one[type]
    } else if (val === 2) {
      return two[type]
    } else if (val === 3) {
      return three[type]
    } else if (val === 4) {
      return four[type]
    } else {
      return val
    }
  }

  specialNumberType = (val) => {
    if (val === 'big_odd') {
      return '大单'
    } else if (val === 'big_even') {
      return '大双'
    } else if (val === 'small_odd') {
      return '小单'
    } else if (val === 'small_even') {
      return '小双'
    } else if (val === 'maximum_odd') {
      return '极大单'
    } else if (val === 'maximum_even') {
      return '极大双'
    } else if (val === 'minimum_odd') {
      return '极小单'
    } else if (val === 'minimum_even') {
      return '极小双'
    } else {
      return val
    }
  }

  numberType = (val) => {
    if (val === 'big') {
      return '大'
    } else if (val === 'small') {
      return '小'
    } else if (val === 'odd') {
      return '单'
    } else if (val === 'even') {
      return '双'
    } else {
      return val
    }
  }

  colorType = (val) => {
    if (val === 'green') {
      return '绿波'
    } else if (val === 'blue') {
      return '蓝波'
    } else if (val === 'red') {
      return '红波'
    } else if (val === 'grey') {
      return '灰波'
    } else {
      return val
    }
  }

  formatRow = (item) => {
    const { nums, selectedType } = this.props
    const row = ['定位胆'].includes(selectedType) ? [] : [Number(item.sum)]
    for (let num of nums) {
      row.push(item[num] === item.sum && String(item[num]) === num ? String(item[num]) : item[num])
    }
    return row
  }

  chooseContents = (item) => {
    const { categoryId, selectedType, titles, tabLabel } = this.props
    if (categoryId === '1') {
      if (selectedType === '基本走势') {
        return [this.formats(item.frontThree, 1), this.formats(item.middleThree, 1), this.formats(item.backThree, 1)]
      } else if (selectedType === '定位胆') {
        return this.formatRow(item)
      } else if (selectedType === '和值') {
        return this.formatRow(item)
      }
    } else if (categoryId === '2') {
      if (selectedType === '基本走势') {
        return [item.sum, item.span, this.formats(item.shape, 0)]
      } else if (selectedType === '和值') {
        return this.formatRow(item)
      }
    } else if (categoryId === '3') {
      if (selectedType === '基本走势') {
        return [item.sum, item.size, item.single, item.longhu, this.formats(item.frontThreeSort+1, 2), this.formats(item.middleThreeSort+1, 2), this.formats(item.backThreeSort+1, 2)]
      } else {
        return this.formatRow(item)
      }
    } else if (categoryId === '4') {
      if (selectedType === '基本走势') {
        return [item.sum, item.span, this.formats(item.shape, 1)]
      } else {
        return this.formatRow(item)
      }
    } else if (categoryId === '5') {
      if (selectedType === '冠亚和') {
        if (tabLabel === '和值号码分布') {
          return this.formatRow(item)
        } else {
          return [String(item.sum), this.numberType(item.big), this.numberType(item.small), this.numberType(item.odd), this.numberType(item.even)]
        }
      } else if (selectedType === '基本走势') {
        return [item.sum]
      } else {
        return this.formatRow(item)
      }
    } else if (categoryId === '6') {
      if (selectedType === '基本走势') {
        return [this.specialNumberType(item.shape), this.colorType(item.color)]
      } else if (selectedType === '特码') {
        return this.formatRow(item)
      }
    } else if (['7', '8'].includes(categoryId)) {
      if (selectedType === '基本走势') {
        if (tabLabel === '总和') {
          return [item.sum, item.single, item.size, item.color]
        } else {
          return [item.speNum, item.sizeSingle, item.sx, item.color, item.wx]
        }
      } else if (selectedType === '生肖') {
        if (Object.keys(item).includes('sxCountX')) {
          return titles.map(animal => item['sxCountX'][animal])
        }else {
          return []
        }
      } else if (selectedType === '色波') {
        return [item.ratio]
      }
    }
  }

  // FIX ME 把style判断移除map
  render() {
    const {
      horizontal, setRef, titles, categoryId, hidePrizeColumn, showStatData, showMisData, showDelay,
      tabLabel, statFlex, showPolyline, statWidth, dataList, stat, balls, selectedType, unitIndex,
    } = this.props
    if (!Array.isArray(dataList) || Array.isArray(dataList) && dataList.length <= 0) {
      return <LoadingView/>
    }
    const path = ART.Path()
    const ballWithText = ['生肖', '色波'].includes(selectedType)
    let issueStyle
    if (horizontal) {
      issueStyle = {width: statWidth-30}
    } else {
      if (typeof statWidth !== 'undefined') {
        issueStyle = {width: statWidth}
      } else {
        issueStyle = {flex: 1.5}
      }
    }
    let prizeStyle
    if (categoryId === '3') {
      prizeStyle = {width: 120}
    } else if (categoryId === '5') {
      prizeStyle = {flex: 4}
    } else {
      prizeStyle = {flex: 2.5}
    }
    return (
      <View style={{flex: 1}}>
        {!horizontal && <Title
          hidePrizeColumn={hidePrizeColumn}
          titles={titles} issueStyle={issueStyle}
          prizeStyle={prizeStyle} horizontal={horizontal} categoryId={categoryId}
          tabLabel={tabLabel} selectedType={selectedType}/>}

        <ScrollView horizontal={horizontal} ref={r => { !horizontal && setRef && setRef(selectedType, tabLabel, r) }}>
          <View>
            {horizontal && <Title hidePrizeColumn={hidePrizeColumn} titles={titles} issueStyle={issueStyle}
                                  prizeStyle={prizeStyle} horizontal={horizontal} categoryId={categoryId}
                                  tabLabel={tabLabel} selectedType={selectedType} />}
            <ScrollView style={{flex: 1}} ref={r => { horizontal && setRef && setRef(selectedType, tabLabel, r) }}>
              {
                dataList.map((item, rowID) => {
                  return (
                    <View key={rowID} style={[styles.row, rowID % 2 !== 0 ? {backgroundColor: '#F8F8F8'} : null, ballWithText && {height: lhcStyle[selectedType]['height']} ]}>
                      <View style={[styles.issue, issueStyle]}>
                        <Text style={styles.contentText}>{item.issueNo.slice(-4)}{'期'}</Text>
                      </View>

                      {
                        !hidePrizeColumn && (
                          ballWithText
                            ? (
                              <View style={styles.nums}>
                                {item.prizeNum.split(',').map((num, index) => {
                                  return (
                                    <View key={index} style={[styles.subNum, lhcStyle[selectedType]]}>
                                      <View
                                        style={[styles.prizeNum, selectedType === '生肖' ? {marginTop: 3} : {marginRight: 5}, {width: 23, height: 23, backgroundColor: ballColor[item['color'][index]]}]}
                                        >
                                        <Text style={[styles.contentText, styles.hText, {fontSize: this.PrizeNumSize().size}]}>{num}</Text>
                                      </View>
                                      <View>
                                        <Text style={styles.contentText}>{item['sx'][index]}</Text>
                                      </View>
                                    </View>
                                  )
                                })}
                              </View>
                            )
                            : (
                              <View style={[styles.nums, prizeStyle]}>
                                {this.fixPrizeNum(item.prizeNum).split(',').map((num, index) => {
                                  return (
                                    <View key={index} style={[{alignItems: 'center', width: this.PrizeNumSize().width}]}>
                                      <Text style={[styles.contentText, {fontSize: this.PrizeNumSize().size}]}>{num}</Text>
                                    </View>
                                  )
                                })}
                              </View>
                            )
                        )
                      }

                      {
                        this.chooseContents(item).filter(n=>n!==undefined).map((content, index) => {
                            let prized = (typeof showPolyline !== 'undefined' || tabLabel === '冠亚和两面') && typeof content === 'string'
                            if (showPolyline && prized) {
                              calLine({
                                path,
                                numList: horizontal ? titles.slice(1) : titles,
                                displayRecord: dataList,
                                unitIndex: unitIndex ? unitIndex : horizontal ? -1 : 0,
                                rowID: rowID,
                                index: horizontal ? index-1 : index,
                                item: content,
                                windowWidth: horizontal ? statWidth+30*balls : windowWidth,
                                prizeNum: 'prizeNum',
                                beforeItem: statWidth,
                              })
                            }
                            return (
                              <View key={index} style={[styles.san, numStyle({index, tabLabel, categoryId, selectedType, horizontal}), (categoryId === '3' && [0, 1, 2].includes(index) && {width:30})]}>
                                <View style={prized && tabLabel !== '冠亚和两面' && styles.prizeNum}>
                                  {
                                    selectedType === '色波'
                                      ? (
                                        <Text style={styles.contentText}>
                                          <Text style={{color: ballColor['lhc_ball_red']}}>{content.lhc_ball_red || 0}</Text>
                                          <Text>:</Text>
                                          <Text style={{color: ballColor['lhc_ball_blue']}}>{content.lhc_ball_blue || 0}</Text>
                                          <Text>:</Text>
                                          <Text style={{color: ballColor['lhc_ball_green']}}>{content.lhc_ball_green || 0}</Text>
                                        </Text>
                                      )
                                      : <Text style={[styles.contentText, prized && tabLabel !== '冠亚和两面' && styles.hText]}>
                                          {(prized || typeof showMisData === 'undefined' || showMisData) && content}
                                        </Text>
                                  }
                                </View>
                              </View>
                            )
                          })
                      }

                    </View>
                  )
                })
              }
              {
                showPolyline && !showDelay && (
                  <View style={{flex: 1, position: 'absolute', backgroundColor: 'transparent'}}>
                    <ART.Surface width={horizontal ? statWidth+30*balls : windowWidth} height={dataList.length * 30} position='absolute' >
                      <ART.Shape d={path} stroke={Config.baseColor} strokeWidth={1} />
                    </ART.Surface>
                  </View>
                )
              }

            </ScrollView>

            <View style={selectedType === '生肖' && {height: showStatData ? 30 * 4 : 0}}>
                {horizontal&&showStatData && <Statistical stat={stat} label={tabLabel} flex={statFlex} width={statWidth} horizontal={horizontal} selectedType={selectedType} />}
            </View>

          </View>
        </ScrollView>
        { !horizontal && showStatData && (
          <View>
            <Statistical stat={stat} label={tabLabel} flex={statFlex} width={statWidth} horizontal={horizontal} selectedType={selectedType} />
          </View>
        )}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  contentText: {
    fontSize: 15,
    color: '#9198AB',
  },
  titleText: {
    fontSize: 12,
    color: '#9198AB',
  },
  san: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  nums: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issue: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  title: {
    backgroundColor: '#E5E5E5',
    borderBottomWidth: 0,
  },
  row: {
    height: 30,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
  },
  prizeNum: {
    width: 25,
    height: 25,
    backgroundColor: Config.baseColor,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  subNum: {
    alignItems: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    justifyContent: 'center',
  },
})
