import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'

import Sound from './clickSound'
import Config from '../config/global'

const { width } = Dimensions.get('window')

const Types = ({ selectedType, selectAction, hideWin, types }) => {
  let typesList = types
  if (typesList.length % 3 !== 0) {
    typesList = typesList.concat(Array.from({length: 3 - typesList.length % 3}))
  }
  return (
    <View style={styles.container}>
      <View style={styles.typesWrap}>
      {
        typesList.map((item, index) => {
          if (item) {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                style={[
                  styles.typeItem,
                  selectedType === item ? styles.typeItemSelected : null,
                ]}
                underlayColor='transparent'
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  selectAction(item)
                }}>
                <View>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
                {
                  selectedType === item && (
                    <Image style={styles.iconSelected} source={require('../src/img/ic_selected2.png')} />
                  )
                }
              </TouchableOpacity>
            )
          } else {
            return <View style={styles.placeholder} key={index} />
          }
        })
      }
      </View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.mark}
        onPress={() => hideWin()} />
    </View>
  )
}

const styles = StyleSheet.create({
  iconSelected: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
  },
  mark: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  placeholder: {
    width: width/3-20,
    height: 30,
    marginTop: 10,
  },
  typeItemSelected: {
    borderColor: Config.baseColor,
  },
  typeItem: {
    width: width/3-20,
    height: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DDDDDD',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
  },
  typesWrap: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
  },
  container: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default Types
