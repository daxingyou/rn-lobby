import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'
import Sound from '../../components/clickSound'

import selectBall from  '../../src/img/select_ball.png'
import unselectBall from  '../../src/img/unselect_ball.png'
import bgTools from '../../src/img/bg_tools.png'

const { width } = Dimensions.get('window')

export default class SelectItem extends Component {
  compareSelect(thisData, nextData) {
    if (thisData.length !== nextData.length) {
      return false
    }
    for (let i = 0; i < thisData.length; i++) {
      if (thisData[i] !== nextData[i]) {
        return false
      }
    }

    return true
  }

  /**
   * 判断内容是否是大于1个字的中文或者大于两个字的数字
   * @param  {String}  val [展示内容]
   * @return {Boolean}
   */
  verifySpecialContent = (val) => {
    let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
    if (val.length > 2 || (reg.test(val) && val.length >= 2)) {
      return true
    } else {
      return false
    }
  }

  renderCell(label, data, values) {
    const { select, click } = this.props
    const isSpecialContent = this.verifySpecialContent(data[0].toString())
    let rows = 0, cols = 0
    if (isSpecialContent) {
      cols = 3
    } else {
      if (data.length <= 11) {
        cols = 6
      } else {
        cols = 7
      }
    }
    rows = Math.ceil(data.length / cols)
    return (
      Array.from({length: rows}).map((row, rowIndex) =>{
        return (
          <View style={(rowIndex + 1) === rows ? styles.lastRow : styles.row} key={rowIndex}>
            {
              Array.from({length: cols}).map((col, index) => {
                let selectValue = values ? values[rowIndex * cols + index] : data[rowIndex * cols + index]
                let selected = select && select[label] && select[label].includes(selectValue)

                return (
                  <View style={styles.ballWrap} key={index}>
                    {
                      data[rowIndex * cols + index] != null && (
                        <View >
                          <TouchableOpacity
                            activeOpacity={1}
                            onPressIn={()=>{
                              Sound.stop()
                              Sound.play()
                              click(label, selectValue)
                            }}>
                              <View>
                                <Image
                                  style={isSpecialContent ? styles.lBallImg : styles.ballImg}
                                  resizeMode='stretch'
                                  source={selected ? selectBall : unselectBall}>
                                    <View style={styles.ballNum}>
                                      <Text style={selected ? styles.ballTextSelect : styles.ballText}>
                                        {data[rowIndex * cols + index]}
                                      </Text>
                                    </View>
                                </Image>
                              </View>
                          </TouchableOpacity>
                        </View>
                      )
                    }
                  </View>
                )
              })
            }
          </View>

        )}
      )
    )
  }

  render() {
    const { data, click } = this.props

    return (
      <View style={styles.item} refs={()=>{}}>
        {
          !!data.label &&
            <View style={styles.unit}>
              <Text style={styles.label}>{data.label}</Text>
            </View>
        }
        <View style={styles.content}>
          {
            data.tools ? (
              <View style={styles.tools}>
                <Image style={styles.toolsback}  resizeMode='stretch' source={bgTools}/>
                <View style={[styles.fn]}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop();Sound.play()
                      click(data.label, data.content.filter( f =>
                        f != null
                      ), true)
                    }}>
                    <View style={styles.fnWrap}>
                      <Text style={styles.fnText}>全</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.fn}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      click(data.label, data.content.filter( f =>
                        data.content.indexOf(f) >= data.content.length / 2
                    ), true)}}>
                    <View style={styles.fnWrap}>
                      <Text style={styles.fnText}>大</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.fn}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop();Sound.play()
                      click(data.label, data.content.filter( f =>
                      data.content.indexOf(f) < data.content.length / 2
                    ), true)}}>
                    <View style={styles.fnWrap}>
                      <Text style={styles.fnText}>小</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.fn}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop();Sound.play()
                      click(data.label, data.content.filter( f =>
                      (f % 2) != 0
                    ), true)}}>
                    <View style={styles.fnWrap}>
                      <Text style={styles.fnText}>单</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.fn}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop();Sound.play()
                      click(data.label, data.content.filter( f =>
                      (f % 2) == 0
                    ), true)}}>
                    <View style={styles.fnWrap}>
                      <Text style={styles.fnText}>双</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.fn}>
                  <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop();Sound.play()
                      click(data.label, [], true)}}>
                    <View style={styles.fnWrap}>
                      <Text style={styles.fnText}>清</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            ) : null
          }
          <View>
            {
              this.renderCell(data.label, data.content, data.values)
            }
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 5,
  },
  unit: {
    position: 'absolute',
    width: 15,
    left: 7.5,
    borderRadius: 4,
  },
  label: {
    textAlign: 'center',
    paddingVertical: 6,
    fontSize: 12,
    color: '#999',
    backgroundColor: 'transparent',
  },
  content: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  toolsback: {
    position: 'absolute',
    left: 15,
    height: 25,
    width: width-30,
  },
  tools: {
    height: 25,
    width: width / 16 * 15.3 + 4 ,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fn: {
    flex: 1,
    alignItems: 'center',
  },
  fnWrap: {
    justifyContent: 'center',
    width: 15,
    height: 25,
  },
  fnText: {
    fontSize: 16,
    color: '#000000',
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  lastRow: {
    flexDirection: 'row',
  },
  ballWrap: {
    height : 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballNum : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballImg : {
    height : 40,
    width : 40,
  },
  lBallImg: {
    height : 40,
    width : 70,
  },
  ballText: {
    fontSize: 20,
    color: '#000',
    backgroundColor: 'transparent',
    marginBottom : 2,
  },
  ballTextSelect: {
    fontSize: 20,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    marginBottom : 2,
  },
})
