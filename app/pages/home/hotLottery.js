import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import Sound from '../../components/clickSound'
const defLotteryLogo = require('../../src/img/ic_def_lottery.png')
import { getHotList } from '../../actions'
import { goToLottery } from '../../utils/navigation'

class HotLottery extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getHotList()
  }

  render() {
    const { hotList, navigation } = this.props
    let rows = 0, cols = 2
    if (Array.isArray(hotList) && hotList.length > 0) {
      rows = Math.ceil(hotList.length / cols)
    }
    return (
      <View style={styles.container}>
        <View style={styles.hotTitle}>
          <Image source={require('../../src/img/icon_hot.png')} style={styles.hotIcon}/>
          <Text allowFontScaling={false} style={{fontSize: 12, color: '#333333'}}>
            热门彩种
          </Text>
        </View>
        <View style={styles.hotList}>
        {
          Array.from({length: rows}).map((row, rowIndex) =>
            <View style={styles.row} key={rowIndex}>
            {
              Array.from({length: cols}).map((col, colIndex) => {
                let item = hotList[cols * rowIndex + colIndex]
                return item ? (
                  <TouchableOpacity
                    key={colIndex}
                    style={{flex: 1}}
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      goToLottery(navigation, item.category_id, item.lottery_id, item.category_id === '6')
                    }}>
                    <View style={[styles.col, colIndex == 1 && styles.colRight ]}>
                      {
                        item.lottery_id === 'pcdd' ? (
                          <Image source={require('../../src/img/logo_pcdd.png')} style={styles.hotLotteryIcon}/>
                        ) : (
                          <Image
                            source={item.lottery_image_url && item.lottery_image_url !== '' ? {uri: item.lottery_image_url} : defLotteryLogo}
                            style={styles.hotLotteryIcon}/>
                        )
                      }

                      <View style={styles.lotteryInfo}>
                        <Text allowFontScaling={false} style={{fontSize: 16, color: '#000000', marginBottom: 10}}>
                          {item.lottery_name}
                        </Text>
                        <Text allowFontScaling={false}
                              style={{fontSize: 12, color: '#666666', overflow: 'hidden', width: 85, height: 17, lineHeight: 14}} >
                          {item.lottery_introduction}
                        </Text>
                      </View>
                      {
                        item.lottery_id === '20' && item.lottery_tip === '今日开奖' ? (
                          <Image source={require('../../src/img/todayAward.png')} style={styles.todayAward}/>
                        ) : null
                      }
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.col, colIndex == 1 && styles.colRight ]} key={colIndex} />
                )
              })
            }
            </View>
          )
        }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  todayAward: {
    position:'absolute',
    height: 12,
    width: 42,
    right: 10,
  },
  container: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  hotTitle: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  hotIcon: {
    width: 12,
    height: 12,
    marginLeft: 10,
    marginRight: 3.5,
  },
  hotList: {
    minHeight: 240,
  },
  row: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  col: {
    flex: 1,
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colRight: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#EEEEEE',
  },
  hotLotteryIcon: {
    width: 50,
    height: 50,
  },
  lotteryInfo: {
    marginLeft: 10,
    minWidth: 80,
  },
})

const mapStateToProps = (state) => {
  const { hotList, lotteryList } = state
  return { hotList, lotteryList }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getHotList: () => {
      dispatch(getHotList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HotLottery)
