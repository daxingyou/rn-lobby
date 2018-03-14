import React, {Component} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  Image,
  WebView,
} from 'react-native'
import { getWinningList } from '../../actions'

class WinningList extends Component {

  componentDidMount() {
    this.props.getWinningList()
  }

  render() {
    const winningList = this.props.winningList
    let listHtml = `<div style="display: flex; flex: 1; flex-direction: column; margin-top: -140px;">`
    if (Array.isArray(winningList) && winningList.length > 0) {
      for (let item of winningList) {
        listHtml += `
        <div style="padding-left: 10; padding-right: 10; display: flex; flex-direction: row; align-items: center; justify-content: space-between; height: 45px; border-bottom: 1px dashed #F0F0F0;">
          <div>
            <div style="position: relative; display: flex; flex-direction: row; align-items: center;">
              <div style="position: relative; top: 4; border-bottom: 2px solid transparent; border-top: 8px solid #F86054; border-left: 3px solid #F86054; border-right: 3px solid #F86054;">
                <div style="position: absolute; top: -14; left: -6;  width: 12; height: 12; border-radius: 50%; background-color: #FFCD00; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8; height: 8; border-radius: 50%; background-color: #E8BA00"></div>
                </div>
              </div>
              <span style="font-size:13px;font-family: PingFangSC-Regular;margin-left: 5;color:#666">${item.user_name.substring(0, 7)}</span>
            </div>
            <div style="font-family: PingFangSC-Regular;font-size:13px;color:#999">
              购买${item.lottery_name}
            </div>
          </div>
          <div style="font-size: 14px; font-family: PingFangSC-Regular; color: #FF0000;">
            喜中${Number(item.winning_bonus).toFixed(1)}元
          </div>
        </div>`
      }
    }
    listHtml += '</div>'
    return (
      <View style={styles.winningArea}>
        <View style={styles.winningHead}>
          <Image source={require('../../src/img/winning_icon.png')} style={styles.winIcon}/>
          <Text allowFontScaling={false} style={styles.winHeadText}>最新中奖榜</Text>
        </View>
        <View style={styles.winningList}>
          <WebView
            setMixedContentMode={true}
            automaticallyAdjustContentInsets={false}
            style={{flex: 1}}
            source={{html: `<marquee style="height:180px" direction="up" scrollamount="2">${listHtml}</marquee>`}}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  winningArea: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  winningHead: {
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  winIcon: {
    width: 15,
    height: 15,
    marginLeft: 9,
  },
  winHeadText: {
    fontSize: 12,
    color: '#333333',
    marginLeft: 3.25,
  },
  winningList: {
    height: 180,
  },
})

const mapStateToProps = (state) => {
  const { winningList } = state
  return { winningList }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getWinningList: () => {
      dispatch(getWinningList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WinningList)
