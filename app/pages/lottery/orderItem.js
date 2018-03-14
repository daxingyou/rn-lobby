import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

const { width } = Dimensions.get('window')

export default class OrderItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemHeight: 60,
    }
  }

  render() {
    const { rowData, index, delOrder, zhengMaGuoGuanPlay } = this.props
    const { itemHeight } = this.state
    let content = ''
    if (rowData.checkbox && rowData.checkbox.length > 0) {
      const boxes = []
      for (let box of ['万位', '千位', '百位', '十位', '个位']) {
        if (rowData.checkbox.includes(box)) {
          boxes.push(box)
        }
      }
      content = boxes.join(', ') + ' | '
    }
    if (!Array.isArray(rowData.select) && rowData.select && Object.keys(rowData.select).length > 0) {
      for (let i = 0; i < Object.keys(rowData.select).length; i++) {
        let key = Object.keys(rowData.select)[i]
        let item = rowData.select[key]
        let newContent = item.join(', ')
        if (i === 0) {
          content = content + newContent
        } else {
          content = content + ' | ' + newContent
        }
      }
    } else if (rowData.input && rowData.input.length > 0) {
      for (let i = 0; i < rowData.input.length; i++) {
        let newContent = rowData.input[i]
        if (i === 0) {
          content = content + newContent
        } else {
          content = content + ' | ' + newContent
        }
      }
    } else if (Array.isArray(rowData.select) && rowData.select && rowData.select.length > 0) {
      if (rowData.playName === '正码过关') {
        for (let subPlay of zhengMaGuoGuanPlay.play) {
          for (let item of subPlay.detail) {
            if (rowData.select.includes(item.id)) {
              content = content + item.name + ' '
              break
            }
          }
          content = content + '| '
        }
      } else {
        content = rowData.select.join(', ')
      }
    }

    return (
      rowData.betNum === 'blank' ?
      (
        <Image
          style={styles.imgBottom}
          source={require('../../src/img/orderitembottom.png')}/>
      )
      :
      (
        <View style={{alignItems: 'center'}}>
          <Image style={[styles.item, {height: itemHeight + 26}]} source={require('../../src/img/orderitemmid.png')}>
            <View style={{flexDirection: 'row'}}
              onLayout={(elm) => {
                this.setState({
                  itemHeight: elm.nativeEvent.layout.height,
                })
              }}>
              <View>
                <View style={styles.total}>
                  <Text style={{textAlign: 'center'}}>
                    <Text style={styles.playName}>{rowData.playName}</Text>
                    <Text style={styles.grayText}>{`(${rowData.playName === '正码过关' ? '正码过关' : rowData.subPlayName}) 共`}</Text>
                    <Text style={styles.redText}>{rowData.betNum}</Text>
                    <Text style={styles.grayText}>注 共</Text>
                    <Text style={styles.redText}>{rowData.totalPrice}</Text>
                    <Text style={styles.grayText}>元</Text>
                  </Text>
                </View>
                <View style={[styles.content, {width: width - 100}]}>
                  <Text
                    style={{fontSize: 15,backgroundColor : "transparent", color: '#000000'}}>
                    {rowData.content || content}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.del}
                underlayColor='transparent'
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  delOrder(index)
                }}>
                <Image style={styles.delImg} source={require('../../src/img/ic_del_small.png')} />
              </TouchableOpacity>
            </View>
          </Image>
          {
            index !== '0' && (
              <Image style={styles.itemBottomImg} source={require('../../src/img/ic_betItems_bottomLine.png')} />
            )
          }
        </View>
      )
    )
  }
}

const styles = StyleSheet.create({
  imgBottom: {
    resizeMode: 'stretch',
    width: width-22.5,
    marginLeft: 8.5,
    marginBottom: 50,
  },
  item: {
    width: width-22.5,
    height: 60,
    resizeMode: 'stretch',
    padding: 20,
    paddingBottom: 0,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: "transparent",
  },
  playName: {
    fontSize: 15,
    color: '#000000',
  },
  grayText: {
    fontSize: 13,
    color: '#797979',
  },
  redText: {
    fontSize: 13,
    color: Config.baseColor,
  },
  content: {
    paddingTop: 12,
  },
  del: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delImg: {
    width: 15,
    height: 15,
  },
  itemBottomImg: {
    position: 'absolute',
    marginLeft: 24,
    width: width - 52,
    resizeMode: 'contain',
    marginTop: 6,
  },
})
