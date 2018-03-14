import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'

import Immutable from 'immutable'
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import Modal from 'react-native-modalbox'
import LotteryNavBar from '../../components/lotteryNavBar'

export default class PlayOpts extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // shouldComponentUpdate(nextProps) {
  //   const { playList, currentSubPlay, currentPlay, currentPlayDetail, visible } = this.props
  //   if (!Immutable.is(playList, nextProps.playList)
  //     || !Immutable.is(currentSubPlay, nextProps.currentSubPlay)
  //     || !Immutable.is(currentPlay, nextProps.currentPlay)
  //     || !Immutable.is(currentPlayDetail, nextProps.currentPlayDetail)
  //     || visible != nextProps.visible) {
  //     return true
  //   }
  //   return false
  // }

  modalOnClose = () => {
    this.setState({
      currentPlay: null,
      currentSubPlay: null,
    }, () => {
      this.props.closePlayWin()
    })
  }

  render() {
    const { playList, showPlayWin, setPlay } = this.props

    const currentPlay = this.state.currentPlay || this.props.currentPlay
    const currentSubPlay = this.state.currentSubPlay || this.props.currentSubPlay

    let data = Immutable.fromJS(playList).toJS()
    if ((playList.length) % 4 !== 0) {
      data = data.concat(Array.from({length: 4 - ((playList.length) % 4)}))
    }
    let totalPlayRows = data.length / 4
    return (
      <Modal
        ref={(val) => this.modalRef = val}
        swipeToClose={false}
        isOpen={showPlayWin}
        onClosed={this.modalOnClose}
        style={styles.modal}
        position={"top"}>
        <LotteryNavBar
          rightIcon={require('../../src/img/ic_menu_close.png')}
          rightIconStyles={{width: 13, height: 13}}
          rightOnPress={() => this.modalRef.close()}
          title={'全部玩法'}/>
        <View style={styles.totalPlay}>
        {
          Array.from({length: totalPlayRows}).map((row, rowIndex) => {
            let rowData = data.slice(rowIndex * 4, rowIndex * 4 + 4)
            return (
              <View style={styles.totalPlayRow} key={rowIndex}>
              {
                rowData.map((item, index) => {
                  if (item) {
                    let selected = item.label === currentPlay.label
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.totalPlayCell, selected ? styles.totalPlayCellOn : null]}
                        underlayColor='transparent'
                        onPress={() => {
                          Sound.stop()
                          Sound.play()
                          this.setState({
                            currentPlay: item,
                            currentSubPlay: Immutable.fromJS(item.detail[0].method[0]).toJS(),
                          })
                        }}>
                          <Text style={[styles.playCellText, selected ? styles.totalPlayCellTextOn : null]}>{item.label}</Text>
                      </TouchableOpacity>
                    )
                  } else {
                    return <View key={index} style={{width: 77, height: 28}}/>
                  }

                })
              }
              </View>
            )
          })
        }
        </View>
        <ScrollView style={{flex: 1, paddingHorizontal: 10}}>
        {
          currentSubPlay && Array.isArray(currentPlay.detail) && currentPlay.detail.map((item, index) => {
            let methodList = Immutable.fromJS(item.method).toJS()
            if ((item.method.length) % 3 !== 0) {
              methodList = methodList.concat(Array.from({length: 3 - ((item.method.length) % 3)}))
            }
            let methodRows = methodList.length / 3
            return (
              <View style={styles.subPlayWrap} key={index}>
                <View style={styles.subPlayLable}>
                  <Text style={styles.subPlayLableText}>{item.label}</Text>
                </View>
                <View>
                {
                  Array.from({length: methodRows}).map((row, rowIndex) => {
                    let rowData = methodList.slice(rowIndex * 3, rowIndex * 3 + 3)
                    return (
                      <View style={styles.subPlayRow} key={rowIndex}>
                      {
                        rowData.map((item, index) => {
                          if (item) {
                            let selected = currentSubPlay.play_id === item.play_id
                            return (
                              <TouchableOpacity
                                key={index}
                                style={[styles.subPlayCell, selected ? styles.subPlayCellOn : null]}
                                underlayColor='transparent'
                                onPress={() => {
                                  Sound.stop()
                                  Sound.play()
                                  let playData = Immutable.fromJS(currentPlay).toJS()
                                  this.setState({
                                    currentPlay: null,
                                    currentSubPlay: null,
                                  }, () => {
                                    setPlay(playData, item)
                                  })
                                }}>
                                <Text style={[styles.playCellText, selected ? styles.subPlayCellTextOn : null]}>{item.label}</Text>
                              </TouchableOpacity>
                            )
                          } else {
                            return <View style={{width: 95, height: 28}} key={index}/>
                          }
                        })
                      }
                      </View>
                    )
                  })
                }
                </View>
              </View>
            )
          })
        }
        </ScrollView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  totalPlay: {
    backgroundColor: '#F7F7F7',
    paddingTop: 15,
  },
  totalPlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  totalPlayCell: {
    width: 77,
    height: 28,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalPlayCellOn: {
    backgroundColor: Config.baseColor,
    borderColor: Config.baseColor,
  },
  playCellText: {
    fontSize: 15,
    color: '#666666',
  },
  totalPlayCellTextOn: {
    color: '#FFFFFF',
  },
  subPlayWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5E5',
  },
  subPlayLable: {
    paddingVertical: 10,
  },
  subPlayLableText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  subPlayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subPlayCell: {
    width: 95,
    height: 28,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C2C2C2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  subPlayCellOn: {
    borderColor: Config.baseColor,
  },
  subPlayCellTextOn: {
    color: Config.baseColor,
  },
})
