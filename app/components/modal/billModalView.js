import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import Sound from '../clickSound'
const windowWidth = Dimensions.get('window').width

export default class BillModalView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedId: 'all',
    }
  }

  render() {
    const { data, optionsSubPlay } = this.props

    let playList = data

    if (data.length % 3 !== 0) {
      playList = playList.concat(Array.from({length: 3 - data.length % 3}))
    }
    return (
      <View style={styles.container}>
        <View style={styles.playWin}>
          {
            playList && playList.length > 0 && playList.map((item, index) => {
              if (item) {
                const isSelect = item.lottery_id == this.props.isSelect.selectedId
                return (
                  <TouchableOpacity
                    key={index}
                    style={isSelect ? styles.playItemSelected : styles.playItem}
                    underlayColor='transparent'
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      optionsSubPlay(item)
                    }}>
                    <View>
                      <Text style={isSelect ? styles.isplayItemText : styles.playItemText}>{item.lottery_name}</Text>
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
        <TouchableOpacity
          onPress={() => {
            this.props.overlayclose()
            this.props.triangletodown()
          }}
          activeOpacity={1}
          style={styles.modaloverlay} />
      </View>



    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modaloverlay:{
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  playWin: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    shadowOffset: {height: 5},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  playItem: {
    height: 35,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 12,
    width: windowWidth*0.3,
    backgroundColor: '#FFF',
  },
  playItemSelected: {
    height: 35,
    borderWidth: 1,
    borderColor: '#EC0909',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 12,
    width: windowWidth*0.3,
    backgroundColor: '#FFF',
  },
  placeholder: {
    width:windowWidth*0.3,
    height:10,
  },
  playItemText: {
    fontSize: 15,
    color: '#464646',
  },
  isplayItemText: {
    fontSize: 15,
    color: '#EC0909',
  },
  cross: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
  },
})
