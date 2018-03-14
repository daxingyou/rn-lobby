import React from 'react'
import {View, TouchableOpacity, Image, Text, Dimensions} from 'react-native'
import Config from "../../config/global"
const { width } = Dimensions.get('window')

const HeXiaoTypes = ({ heXiaoCategory, setHeXiaoCategory }) => (
  <View style={{marginBottom: 20, paddingBottom: 3, borderBottomWidth: 1, borderColor: '#E4E6E8'}}>
    {
      [
        ['野兽','家禽','单','双'],
        ['前肖','后肖','天肖','地肖'],
      ].map((row, index) => (
        <View key={index} style={{flexDirection: 'row'}}>
          {row.map((category, index) => {
            const categorySelected = category === heXiaoCategory
            return (
              <View key={index} style={{flex: 1, flexDirection: 'row', marginBottom: 7}}>
                {
                  index !== 0 && (
                    <View style={{justifyContent: 'center'}}>
                      <Image style={{height: 14}} source={require('../../src/img/heXiao_divide.png')}/>
                    </View>
                  )
                }
                <TouchableOpacity
                  style={{marginLeft: (width/4-57)/2, height: 23, width: 57, borderWidth: 0.5, borderColor: categorySelected ? Config.baseColor : '#DADADA', borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => setHeXiaoCategory(category)}>
                  <Text style={categorySelected && {color: Config.baseColor}}>{category}</Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      ))
    }
  </View>
)

export default HeXiaoTypes
