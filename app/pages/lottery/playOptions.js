import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'

import Immutable from 'immutable'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

export default class PlayOptions extends Component {

  shouldComponentUpdate(nextProps) {
    const { playList, currentSubPlay, currentPlay, currentPlayDetail, visible } = this.props
    if (!Immutable.is(playList, nextProps.playList)
      || !Immutable.is(currentSubPlay, nextProps.currentSubPlay)
      || !Immutable.is(currentPlay, nextProps.currentPlay)
      || !Immutable.is(currentPlayDetail, nextProps.currentPlayDetail)
      || visible != nextProps.visible) {
      return true
    }
    return false
  }

  render() {
    const {
      playList,
      optionsPlay,
      optionsPlayDetail,
      optionsSubPlay,
      currentSubPlay,
      currentPlay,
      currentPlayDetail,
    } = this.props
    if (!currentSubPlay) {
      return null
    }
    return (
      <View style={styles.modaloverlay}>
        <View style={styles.playWin} ref='playWin'>
          <ScrollView style={styles.playColLeft}>
            {
              playList && playList.map((item, index) => {
                let selected = item.label === currentPlay.label
                let smText = {}
                if (item.label.length > 5) {
                  smText['fontSize'] = 13
                }
                return (
                  <TouchableOpacity
                    key={index}
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      optionsPlay(playList[index])
                    }}>
                      <View style={styles.playCell}>
                        <Text style={[styles.label, smText, selected && {color: Config.baseColor}]}>{item.label}</Text>
                        {
                          selected && (
                            <Image source={require('../../src/img/play_choice.png')} style={{width: 13, height: 10}} />
                          )
                        }
                      </View>
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
          <ScrollView style={styles.playColMiddle}>
            {
              currentPlay && currentPlay.detail.map((item, index) => {
                let selected = item.label === currentPlayDetail.label
                let smText = {}
                if (item.label.length > 5) {
                  smText['fontSize'] = 13
                }
                return (
                  <TouchableOpacity
                    key={index}
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      optionsPlayDetail(currentPlay.detail[index])
                    }}>
                      <View style={styles.playCell}>
                        <Text style={[styles.label, smText,selected && {color: Config.baseColor}]}>{item.label}</Text>
                        {
                          selected && (
                            <Image source={require('../../src/img/play_choice.png')} style={{width: 13, height: 10}} />
                          )
                        }
                      </View>
                    </TouchableOpacity>
                )
              })
            }
          </ScrollView>
          <ScrollView style={styles.playColRight}>
            {
              currentPlayDetail && currentPlayDetail.method.map((item, index) => {
                let selected = item.play_id === currentSubPlay.play_id
                let smText = {}
                if (item.label.length > 5) {
                  smText['fontSize'] = 13
                }
                return (
                  <TouchableOpacity
                    key={index}
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      optionsSubPlay(currentPlayDetail.method[index])
                      this.props.titleOnPress()
                        }}>
                      <View style={styles.playCell}>
                        <Text style={[styles.label, smText, selected && {color: Config.baseColor}]}>{item.label}</Text>
                      {
                        selected && (
                          <Image source={require('../../src/img/play_choice.png')} style={{width: 13, height: 10}} />
                        )
                      }
                      </View>
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        </View>
        <TouchableWithoutFeedback
          onPress={()=>{
            this.props.titleOnPress()
          }}>
            <View
              style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}} />
        </TouchableWithoutFeedback>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  modaloverlay:{
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playWin: {
    backgroundColor: '#F1F1F1',
    height: 225,
    flexDirection: 'row',
    shadowOffset: {height: 5},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  playColLeft: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  playColMiddle: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  playColRight: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  playCell: {
    paddingHorizontal: 10,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
})
