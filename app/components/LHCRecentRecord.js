import React, {Component} from "react"
import { StyleSheet, View, Text, Dimensions } from 'react-native'

const windowWidth = Dimensions.get('window').width

export default class  RecentRecord extends Component {
  constructor(props) {
    super(props)
    this.state={
      shopState: this.props.shopState,
    }
  }
  render (){
    const RecentRecord = this.props.RecentRecord,
          sx_list = this.props.sx_list
    if( RecentRecord && RecentRecord.length>=1 && sx_list && Object.keys(sx_list).length>=1 ){
      const data = this.props.RecentRecord,
            data2 = this.props.sx_list,
            renderDataArr = []

    const labelData = {
      '1': {label: data2['01']||'猴', color: '#F45959'},
      '2': {label: data2['02']||'羊', color: '#F45959'},
      '3': {label: data2['03']||'马', color: '#51ABF0'},
      '4': {label: data2['04']||'蛇', color: '#51ABF0'},
      '5': {label: data2['05']||'龙', color: '#6ACC7B'},
      '6': {label: data2['06']||'兔', color: '#6ACC7B'},
      '7': {label: data2['07']||'虎', color: '#F45959'},
      '8': {label: data2['08']||'牛', color: '#F45959'},
      '9': {label: data2['09']||'鼠', color: '#51ABF0'},
      '01': {label: data2['01']||'猴', color: '#F45959'},
      '02': {label: data2['02']||'羊', color: '#F45959'},
      '03': {label: data2['03']||'马', color: '#51ABF0'},
      '04': {label: data2['04']||'蛇', color: '#51ABF0'},
      '05': {label: data2['05']||'龙', color: '#6ACC7B'},
      '06': {label: data2['06']||'兔', color: '#6ACC7B'},
      '07': {label: data2['07']||'虎', color: '#F45959'},
      '08': {label: data2['08']||'牛', color: '#F45959'},
      '09': {label: data2['09']||'鼠', color: '#51ABF0'},
      '10': {label: data2['10']||'猪', color: '#51ABF0'},
      '11': {label: data2['11']||'狗', color: '#6ACC7B'},
      '12': {label: data2['12']||'鸡', color: '#F45959'},
      '13': {label: data2['13']||'猴', color: '#F45959'},
      '14': {label: data2['14']||'羊', color: '#51ABF0'},
      '15': {label: data2['15']||'马', color: '#51ABF0'},
      '16': {label: data2['16']||'蛇', color: '#6ACC7B'},
      '17': {label: data2['17']||'龙', color: '#6ACC7B'},
      '18': {label: data2['18']||'兔', color: '#F45959'},
      '19': {label: data2['19']||'虎', color: '#F45959'},
      '20': {label: data2['20']||'牛', color: '#51ABF0'},
      '21': {label: data2['21']||'鼠', color: '#6ACC7B'},
      '22': {label: data2['22']||'猪', color: '#6ACC7B'},
      '23': {label: data2['23']||'狗', color: '#F45959'},
      '24': {label: data2['24']||'鸡', color: '#F45959'},
      '25': {label: data2['25']||'猴', color: '#51ABF0'},
      '26': {label: data2['26']||'羊', color: '#51ABF0'},
      '27': {label: data2['27']||'马', color: '#6ACC7B'},
      '28': {label: data2['28']||'蛇', color: '#6ACC7B'},
      '29': {label: data2['29']||'龙', color: '#F45959'},
      '30': {label: data2['30']||'兔', color: '#F45959'},
      '31': {label: data2['31']||'虎', color: '#51ABF0'},
      '32': {label: data2['32']||'牛', color: '#6ACC7B'},
      '33': {label: data2['33']||'鼠', color: '#6ACC7B'},
      '34': {label: data2['34']||'猪', color: '#F45959'},
      '35': {label: data2['35']||'狗', color: '#F45959'},
      '36': {label: data2['36']||'鸡', color: '#51ABF0'},
      '37': {label: data2['37']||'猴', color: '#51ABF0'},
      '38': {label: data2['38']||'羊', color: '#6ACC7B'},
      '39': {label: data2['39']||'马', color: '#6ACC7B'},
      '40': {label: data2['40']||'蛇', color: '#F45959'},
      '41': {label: data2['41']||'龙', color: '#51ABF0'},
      '42': {label: data2['42']||'兔', color: '#51ABF0'},
      '43': {label: data2['43']||'虎', color: '#6ACC7B'},
      '44': {label: data2['44']||'牛', color: '#6ACC7B'},
      '45': {label: data2['45']||'鼠', color: '#F45959'},
      '46': {label: data2['46']||'猪', color: '#F45959'},
      '47': {label: data2['47']||'狗', color: '#51ABF0'},
      '48': {label: data2['48']||'鸡', color: '#51ABF0'},
      '49': {label: data2['49']||'猴', color: '#6ACC7B'},
    }
    Object.keys(data).forEach((value,i)=>{
      if(i>=5){return}
      const numList = data[i].prize_num.split(',')
              renderDataArr.push (
                <View key={i} style={styles.container}>
                  <View style={styles.recentWrap}>
                    <Text style={styles.recentTime}>{data[i].issue_no.length > 8 ? data[i].issue_no.substr(4, data[i].issue_no.length-1) : data[i].issue_no }期</Text>
                  </View>
                  <View style={styles.rightLine}><View style={styles.rightPoint} /></View>
                  <View style={styles.numWrap}>
                    {
                      data[i].prize_num.split(',').map((v,i)=>{
                      if(i === numList.length-1) {
                        return (
                          <View key={i} style={{flexDirection: 'row'}}>
                            <View style={styles.addWrap}>
                              <View style={styles.add1} />
                              <View style={styles.add2} />
                            </View>
                            <View style={styles.numContainer}>
                              <View style={[styles.numItemWrap, {backgroundColor:labelData[v].color} ]}>
                                <Text style={styles.numItem}>{v}</Text>
                              </View>
                              <Text style={styles.labelText}>{labelData[v].label}</Text>
                            </View>
                          </View>
                        )
                      } else{
                        return (
                          <View key={i}>
                            <View style={[styles.numItemWrap, {backgroundColor:labelData[v].color} ]}>
                              <Text style={styles.numItem}>{v}</Text>
                            </View>
                            <Text style={styles.labelText}>{labelData[v].label}</Text>
                          </View>
                        )
                      }
                      })
                    }
                  </View>
                </View>
              )
      })
    return(
      this.props.visibleState?
        <View style={styles.containerWrap}>
          { renderDataArr }
        </View>
      :
      <View />
    )
    }else{
      return(
        null
      )
    }
  }
}
const styles = StyleSheet.create({
  containerWrap: {
    backgroundColor: '#EFF5FF',
    borderBottomWidth: 1,
    borderColor: '#CCD4E5',
  },
  container:{
    flexDirection: 'row',
    padding: 5,
    paddingLeft: 10,
    borderBottomWidth: 0.5,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
  },
  recentWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightLine: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 75,
    width:1,
    height: 46,
    borderColor: '#CCD4E5',
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  rightPoint: {
    zIndex: 1,
    position: 'absolute',
    top: 18,
    left: -4.5,
    width:10,
    height: 10,
    borderRadius: 50,
    backgroundColor: '#CCD4E5',
  },
  recentTime: {
    fontSize: 11,
    color: '#333',
    fontWeight: '300',
  },
  numWrap: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 20,
    paddingRight: 30,
    justifyContent: 'space-between',
  },
  numContainer: {
    alignItems: 'center',
  },
  numItemWrap: {
    marginBottom: 4,
    width: 20,
    height: 20,
    backgroundColor: '#FFE1C6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numItem: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  addWrap: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginRight: 5,
    transform:windowWidth>=375?[{translateX: -5},{translateY: 8}]:[{translateX: -1},{translateY: 8}],
  },
  add1: {
    position: 'absolute',
    top: 8,
    left: 1,
    width: 18,
    height: 3,
    backgroundColor: '#ccc',
  },
  add2: {
    position: 'absolute',
    top: 0,
    left: 8,
    width: 3,
    height: 20,
    backgroundColor: '#ccc',
  },
  labelText: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '400',
  },
})
