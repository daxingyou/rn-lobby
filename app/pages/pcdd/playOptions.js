import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native'
import Sound from '../../components/clickSound'
const windowWidth = Dimensions.get('window').width

export default class PlayOptions extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    const { data, optionsSubPlay, closeShow, currentSubPlay } = this.props
    let playList = data
    if (data.length % 3 !== 0) {
      playList = playList.concat(Array.from({length: 3 - data.length % 3}))
    }
    return (
      <View style={styles.playW}>
        <View style={styles.playWin}>
          {
            playList && playList.length > 0 && playList.map((item, index) => {
              if (item) {
                const isSelect = item.type_id == currentSubPlay.type_id
                return (
                  <TouchableOpacity
                    key={index}
                    style={isSelect ? styles.playItemSelected : styles.playItem}
                    underlayColor='transparent'
                    onPress={() => {Sound.stop();Sound.play();optionsSubPlay(data[index]);closeShow()}}>
                    <View>
                      <Text style={isSelect ? styles.isplayItemText : styles.playItemText}>{item.type_name}</Text>
                    </View>
                    {
                      isSelect ? <Image source={require('../../src/img/ic_cross.png')} style={styles.cross} /> : null
                    }
                  </TouchableOpacity>
                )
              } else {
                return (
                  <View style={styles.placeholder} key={index} />
                )
              }
            })
          }
        </View>
        <TouchableWithoutFeedback
          onPress={()=>{
            closeShow()
          }}>
            <View
              style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)'}} />
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cross: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
  },
  playW: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playWin: {
    backgroundColor: '#fff',
    height: 96,
    shadowOffset: {height: 5},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  playItemSelected: {
    height: 28,
    borderWidth: 1,
    borderColor: '#EC0909',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 12,
    width: windowWidth*0.3,
    backgroundColor: '#FFF',
  },
  playItem: {
    width: windowWidth*0.3 -5,
    height: 28,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 12,
  },
  placeholder: {
    width: windowWidth*0.3 -5,
    height: 28,
  },
  isplayItemText: {
    fontSize: 15,
    color: '#EC0909',
  },
  playItemText: {
    fontSize: 15,
    color: '#464646',
  },
})
