import React, { Component } from 'react'
import { View, StyleSheet, ListView, TouchableOpacity, Text, Image } from 'react-native'
import { connect } from "react-redux"
import Sound from "../../components/clickSound"
import selectBall from '../../src/img/select_ball.png'
import selectSquare from '../../src/img/select_square.png'
import unselectBall from '../../src/img/unselect_ball.png'
import unselectSquare from  '../../src/img/unselected_square.png'
import Config from '../../config/global'
import { ballColor as utils } from '../../utils/ballStyle'
import Note from './Note'
import Guide from './guide'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
const buttonImage = {
  ball: {
    select: selectBall,
    unselect: unselectBall,
  },
  square: {
    select: selectSquare,
    unselect: unselectSquare,
  },
}
const buttonStyle = {
  ball: {
    width: 40,
    height: 40,
  },
  square: {
    width: 87,
    height: 60,
  },
}
const textColor = {
  '红': utils.red,
  '蓝': utils.blue,
  '绿': utils.green,
}

class GridView extends Component {
  groupItems = (items, buttonType) => {
    const itemsPerRow = buttonType === 'ball' ? 5 : 3
    const rows = items.chunk(itemsPerRow)
    const lastRow = rows[rows.length - 1]
    while (lastRow.length !== itemsPerRow) {
      lastRow.push(null)
    }

    return rows
  }

  renderSection = (currentSubPlay, sectionID, rowID) => (
    <View style={{marginTop: 10}}>
      {
        this.groupItems(currentSubPlay.detail, this.props.buttonType).map((row, index) => (
          <View key={index}>
            {index === 0 && <Note text={currentSubPlay.groupName}/>}
            {index === 0 && rowID === '0' && <Guide zhengMaGuoGuan={true} onShowGuide={this.props.onShowGuide}/>}
            {this.renderRow(row, currentSubPlay)}
          </View>
        ))
      }
    </View>
  )

  renderRow = (row, currentSubPlay) => {
    const { buttonType, oddsOnTab, sx, wx, orderInfo, lhcConfig, onPressItem, selectNames } = this.props

    return (
      <View style={[styles.row, {height: oddsOnTab ? 60 : sx ? 80 : wx ? 110 : 70}]}>
        {
          row.map((item, index) => {
            if (item === null) {
              return (
                <View key={index} style={[buttonStyle[buttonType], (sx || wx) && {height: sx ? 70 : 100}]}/>
              )
            } else {
              const isSelect = selectNames.includes(orderInfo.playName === '正码过关' ? item.id : item.name)
              return (
                <View key={index}>
                  <TouchableOpacity
                    activeOpacity={1}
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      onPressItem(item.name, item.id, currentSubPlay.detail && currentSubPlay.detail.map(item => item.id))
                    }}>
                    <Image
                      style={[buttonStyle[buttonType], (sx || wx) && {height: sx ? 70 : 100, resizeMode: 'stretch'}]}
                      source={isSelect ? buttonImage[buttonType].select : buttonImage[buttonType].unselect}>
                      <View style={styles.button}>
                        <View style={{height: 24, justifyContent: 'center', marginTop: -2}}>
                          <Text style={[styles.buttonText, {color: isSelect ? '#FFFFFF' : ['波色', '色波'].includes(orderInfo.playName) ? textColor[item.name[0]] : '#000'}]}>
                            {item.name}
                          </Text>
                        </View>
                        {
                          buttonType === 'square' && (
                            <View style={{backgroundColor: 'transparent'}}>
                              <Text style={[{fontSize: 11, marginTop: 3}, {color: isSelect ? '#FFFFFF' : ['波色', '色波'].includes(orderInfo.playName) ? '#000' : Config.baseColor}]}>
                                赔率：{item.maxOdds}
                              </Text>
                            </View>
                          )
                        }
                        {
                          (sx || wx) && (
                            <View style={[wx && {width: 60} , {backgroundColor: 'transparent'}]}>
                              {
                                lhcConfig[sx ? 'sx' : 'wx']
                                && lhcConfig[sx ? 'sx' : 'wx'].filter(animal => animal.label === item.name)[0]
                                && lhcConfig[sx ? 'sx' : 'wx'].filter(animal => animal.label === item.name)[0].nums.chunk(sx ? 5 : 4).map((row, index) => (
                                  <View key={index} style={{flexDirection: 'row'}}>
                                    {
                                      row.map((num, index) => (
                                        <View key={index} style={{width: 15}}>
                                          <Text style={{textAlign: 'center', fontSize: 10, color: isSelect ? '#FFFFFF' : '#666666'}}>
                                            {num}
                                          </Text>
                                        </View>
                                      ))
                                    }
                                  </View>
                                ))
                              }
                            </View>
                          )
                        }
                      </View>
                    </Image>
                  </TouchableOpacity>
                  {
                    !oddsOnTab && buttonType !== 'square' && (
                      <View style={styles.outsideOdds}>
                        <Text style={{fontSize: 11, color: Config.baseColor}}>
                          {item.maxOdds}
                        </Text>
                      </View>
                    )
                  }
                </View>
              )
            }
          })
        }
      </View>
    )
  }

  render() {
    const { currentSubPlay, buttonType, currentPlay, tabs, onShowGuide } = this.props

    return (
      <View style={{flex: 1}}>
        {!currentPlay && <Guide tabs={tabs} onShowGuide={onShowGuide} teMaBaoSan={currentSubPlay.groupName === '特码包三'}/>}
        <ListView
          removeClippedSubviews={false}
          enableEmptySections={true}
          dataSource={ds.cloneWithRows(currentPlay ? currentPlay.play : this.groupItems(currentSubPlay.detail, buttonType))}
          renderRow={currentPlay ? this.renderSection : this.renderRow}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  button : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    backgroundColor: 'transparent',
  },
  outsideOdds: {
    alignItems: 'center',
  },
})

const mapStateToProps = ({ orderInfo, lhcConfig }) => (
  {
    orderInfo,
    lhcConfig,
  }
)

export default connect(mapStateToProps, null)(GridView)
