import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ListView,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native'

import LotteryNavBar from '../../components/lotteryNavBar'
import { fetchWithOutStatus } from '../../utils/fetchUtil'
import Sound from '../../components/clickSound'

const screenWidth = Dimensions.get('window').width
const imgHeight = (screenWidth - 40) * 150 / 660

const detailIcon = require('../../src/img/ic_detail_arrow.png')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class Promotion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actList: [],
    }
    this.listView = null
  }

  componentWillMount() {
    fetchWithOutStatus({act: 10103}).then((res) => {
      if (res) {
        this.setState({
          actList: res,
        })
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  render() {
    const { navigation } = this.props
    const { actList } = this.state
    return (
      <View style={{flex: 1}}>
        <LotteryNavBar
          navigation={navigation}
          title='优惠活动'/>
        <View style={styles.container}>
        {
          actList && actList.length > 0 ? (
            <ListView
              showsVerticalScrollIndicator={false}
              ref={(listView) => { this.listView = listView }}
              style={{flex: 1}}
              dataSource={ds.cloneWithRows(actList.filter(n => n.activity_list_image))}
              renderRow={(rowData) => {
                return (
                  <View style={styles.actItem}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => {
                        Sound.stop()
                        Sound.play()
                        navigation.navigate('PromotionDetail', {data: rowData})
                      }}>
                      <Text style={styles.titleText}>{rowData.activity_name}</Text>
                      {rowData.activity_list_image !== '' && <Image source={{uri: rowData.activity_list_image}} style={styles.actImg} resizeMode='stretch'/>}
                      <View style={styles.desc}>
                        <Text style={styles.activetyDate}>
                          {`活动时间：${rowData.activity_starttime.split(' ')[0]} 至 ${rowData.activity_finishtime.split(' ')[0]}`}
                        </Text>
                        <View style={styles.detail}>
                          <Text style={styles.detailText}>查看详情</Text>
                          <Image source={detailIcon} style={styles.detailIcon} />
                        </View>
                      </View>

                    </TouchableOpacity>
                    {
                      !!rowData.is_expire && (
                        <View style={styles.mark}>
                          <Image
                            source={require('../../src/img/ends.png')}
                            style={styles.ends}/>
                        </View>
                      )
                    }
                  </View>
                )
              }}/>
          ) : null
        }

        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f9',
  },
  actItem: {
    position : "relative",
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingTop: 6.5,
    paddingBottom: 10,
  },
  titleText: {
    color: '#333333',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
  actImg: {
    marginTop: 10,
    width: screenWidth - 40,
    height: imgHeight,
    borderRadius: 4,
  },
  desc: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activetyDate: {
    color: '#666666',
    fontSize: 13,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#999999',
    fontSize: 12,
  },
  detailIcon: {
    marginLeft: 2.625,
    width: 9.33,
    height: 10.6,
  },
  mark : {
    position : "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor : "rgba(0,0,0,.3)",
    alignItems: 'center',
    justifyContent : "center",
    borderRadius: 4,
  },
  ends : {
    width : 77,
    height : 75,
  },
})
