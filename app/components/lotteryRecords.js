import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ListView,
  Dimensions,
} from 'react-native'
import { COLOR } from '../pages/pcdd/COLOR'
import Config from '../config/global'
import ballStyle from '../utils/ballStyle'

const winWidth = Dimensions.get('window').width
const winHeight = Dimensions.get('window').height
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
Date.prototype.Format = function (fmt) { //author: meizz
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds(), //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    return fmt
}

export default class LotteryRecords extends Component {
  renderSectionHeader = () => {
    if(this.props.categoryId === '2'){
      return (
        <View style={styles.listTab}>
          <Text style={[styles.tabText,{width:50}]}>期次</Text>
          <View>
            <Text style={[styles.tabText,{width:100,textAlign:'center',marginLeft:5}]}>开奖号码</Text>
          </View>
          <View style={{flexDirection:'row', marginLeft:-5}}>
            <Text style={[styles.tabText,{width:winWidth/7}]}>和值</Text>
            <Text style={[styles.tabText,{width:winWidth/7}]}>大小</Text>
            <Text style={[styles.tabText,{width:winWidth/7}]}>单双</Text>
          </View>
        </View>
      )
    } else{
      return (
        <View style={styles.listTab}>
          <Text style={[styles.tabText,{width:50}]}>期次</Text>
          <Text style={[styles.tabText,{width:150}]}>开奖号码</Text>
        </View>
      )
    }
  }

  render() {
    const { lotteryRecord, categoryId } = this.props
    return (
      <View style={styles.lotteryRecord}>
        <ListView
          removeClippedSubviews={false}
          style={{backgroundColor: 'white'}}
          dataSource={ds.cloneWithRows(lotteryRecord.slice(0, 20) || [])}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={(rowData, rowID, sectionID) =>
          {
            let issueNo = '0000'
            if (rowData.issue_no) {
              issueNo = rowData.issue_no.substr(-4)
            } else if (rowData.Issue_no) {
              issueNo = rowData.Issue_no.substr(-4)
            }

            return categoryId === '2'
              ? (
                <View style={[issueNo%2 === 1 ? styles.rowOdd : styles.rowEven]}>
                  <View style={[styles.issueWrap, {width:50}]}>
                    <Text allowFontScaling={false} style={{fontSize: 11,width:50, color: '#333',textAlign:'center'}}>
                      {issueNo + '期'}
                    </Text>
                  </View>
                  <View style={styles.rightLine}><View style={styles.rightPoint} /></View>
                  <View style={{flexDirection:'row'}}>
                    <View style={[styles.ballWrap,{width:80}]}>
                      {
                        rowData.prize_num.split(',').map((v,i)=>{
                          return ballStyle(v,i, categoryId)
                        })
                      }
                    </View>

                    <View style={{marginLeft:5,flexDirection:'row', height: 45}}>
                      <View style={[styles.ballWrap,{width:winWidth/7,borderColor:'#E6EAEE',borderLeftWidth:1}]}>
                        {
                          (()=>{
                            let num = 0
                            rowData.prize_num.split(',').forEach((v)=>{
                              num += Number(v)
                            })
                            return <Text style={styles.rightText}>{num}</Text>
                          })()
                        }
                      </View>
                      <View style={[styles.ballWrap,{width:winWidth/7,borderColor:'#E6EAEE',borderLeftWidth:1}]}>
                        {
                          (()=>{
                            let num = 0
                            rowData.prize_num.split(',').forEach((v)=>{
                              num += Number(v)
                            })
                            return <Text style={styles.rightText}>{num>9?'大':'小'}</Text>
                          })()
                        }
                      </View>
                      <View style={[styles.ballWrap,{width:winWidth/7,borderColor:'#E6EAEE',borderLeftWidth:1}]}>
                        {
                          (()=>{
                            let num = 0
                            rowData.prize_num.split(',').forEach((v)=>{
                              num += Number(v)
                            })
                            return <Text style={styles.rightText}>{num%2===0?'双':'单'}</Text>
                          })()
                        }
                      </View>
                    </View>

                  </View>
                </View>
              )
              : (
                <View style={[sectionID%2 === 0 ? styles.rowOdd : styles.rowEven]}>
                  <View style={styles.issueWrap}>
                    <Text allowFontScaling={false} style={{fontSize: 11, color: '#333',textAlign:'center'}}>
                      {issueNo + '期'}
                    </Text>
                  </View>
                  <View style={styles.rightLine}><View style={styles.rightPoint} /></View>
                  <View style={{flexDirection:'row'}}>
                    {
                      categoryId === '8'
                        ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {
                              rowData.data.map((item,index)=>{
                                if(index === rowData.data.length-1){
                                  return([
                                    <Text key={index*10} style={{ fontSize: 18, marginHorizontal: 3, marginTop: -18 }}>+</Text>,
                                    ballStyle(item,index,categoryId),
                                  ])
                                }
                                return ballStyle(item,index,categoryId)
                              })
                            }
                          </View>
                        )
                        : (
                          <View style={{ flexDirection: 'row'}}>
                            {
                              rowData.prize_num.split(',').map((item, index) => {
                                let length = rowData.prize_num.split(',').length
                                if (categoryId === '6') {
                                  return (
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}  key={index}>
                                      <View style={[length === 10 ? styles.sBall : styles.rBall, index===3?COLOR[161 + Number(item)]:null ]}>
                                        <Text style={length === 10 ? styles.sBallText : styles.rBallText}>{item}</Text>
                                      </View>
                                      {
                                        (()=>{
                                          if( index===0||index===1 ){
                                            return <Text style={{fontSize: 16}}>+ </Text>
                                          } else if( index ===2 ){
                                            return <Text style={{fontSize: 16}}>= </Text>
                                          }
                                        })()
                                      }
                                    </View>
                                  )
                                } else {
                                  return (
                                    <View style={length === 10 ? styles.sBall : styles.rBall} key={index}>
                                      <Text allowFontScaling={false} style={length === 10 ? styles.sBallText : styles.rBallText}>{item}</Text>
                                    </View>
                                  )
                                }
                              })
                            }
                          </View>
                        )
                    }
                  </View>
                </View>
              )
          }}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  issueWrap: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotteryRecord: {
    height: winHeight*0.4,
    backgroundColor: '#FFFFFF',
  },
  listTab: {
    flexDirection: 'row',
    backgroundColor: '#F2F5F8',
    borderBottomColor: '#CCD4E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#707D9D',
    backgroundColor: '#F2F5F8',
    lineHeight: 25,
  },
  rowEven: {
    flex: 1,
    height: 45,
    backgroundColor: '#F2F5F8',
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  rowOdd: {
    backgroundColor: '#fff',
    flex: 1,
    height: 45,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rBall: {
    backgroundColor: Config.baseColor,
    width: 20,
    height: 20,
    borderRadius: 50,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sBall: {
    backgroundColor: Config.baseColor,
    width: 17,
    height: 17,
    borderRadius: 50,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rBallText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  sBallText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  rightLine: {
    height: 45,
    borderColor: '#CCD4E5',
    borderLeftWidth: StyleSheet.hairlineWidth,
    marginRight: 15,
  },
  rightPoint: {
    zIndex: 1,
    position: 'absolute',
    top: 17,
    right: -4.4,
    width: 9,
    height: 9,
    borderRadius: 50,
    backgroundColor: '#CCD4E5',
  },
  ballWrap: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightText: {
    fontSize: 12,
    color: '#307195',
  },
})
