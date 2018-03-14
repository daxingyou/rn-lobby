import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import Config from '../config/global'

const winWidth = Dimensions.get('window').width
export const ballColor = {
  red: '#EC0909',
  blue: '#0E86E3',
  green: '#12C231',
}

const defaultBall = (number,index)=>{
  return (
    <View key={index} style={styles.default}>
      <Text style={styles.numText}>
        {number}
      </Text>
    </View>
  )
}

const lhcBall = (item,index)=>{
  return (
    <View key={index} style={styles.lhc}>
      <View style={[styles.lhcNum,{backgroundColor:ballColor[item.color]}]}>
        <Text style={styles.numText}>
          {item.number}
        </Text>
      </View>
      <Text style={styles.lhcSx}>{item.sx}</Text>
    </View>
  )
}

const pk10 = (item,index)=>{
  return (
    <View style={styles.pk10} key={index}>
      <Text style={styles.pk10Text}>{item}</Text>
    </View>
  )
}

const diceBall = (number,index)=>{
  if (number === '1') {
    return <Image key={index} style={styles.diceBg} source={require('../src/img/dice/one.png')} />
  } else if (number === '2') {
    return <Image key={index} style={styles.diceBg} source={require('../src/img/dice/two.png')} />
  } else if (number === '3') {
    return <Image key={index} style={styles.diceBg} source={require('../src/img/dice/three.png')} />
  } else if (number === '4') {
    return <Image key={index} style={styles.diceBg} source={require('../src/img/dice/four.png')} />
  } else if (number === '5') {
    return <Image key={index} style={styles.diceBg} source={require('../src/img/dice/five.png')} />
  } else if (number === '6') {
    return <Image key={index} style={styles.diceBg} source={require('../src/img/dice/six.png')} />
  }

  return(
    <View key={index}>
      <Image style={styles.diceBg} source={require('../src/img/bg_dice.png')}>
        {
          ((number)=>{
            switch(Number(number)){
              case 1:
              return (
                <View style={styles.dicePointWrap}>
                  <View style={{width:16,alignItems:'center',justifyContent:'center'}}>
                    <View style={[styles.point,{backgroundColor:'red'}]} />
                  </View>
                </View>
              )
              case 2:
              return (
                <View style={styles.dicePointWrap}>
                  <View style={[styles.point,{backgroundColor:'#333'}]} />
                  <View style={[styles.point,{backgroundColor:'#333',marginTop:4}]} />
                </View>
              )
              case 3:
              return (
                <View style={styles.dicePointWrap}>
                  <View style={{width:16,alignItems:'flex-start'}}>
                    <View style={[styles.point,{backgroundColor:'#333',alignItems:'flex-start'}]} />
                  </View>
                  <View style={{width:16,alignItems:'center'}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                  <View style={{width:16,alignItems:'flex-end'}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                </View>
              )
              case 4:
              return (
                <View style={styles.dicePointWrap}>
                  <View style={{width:16,flexDirection:'row',justifyContent:'space-around'}}>
                    <View style={[styles.point,{backgroundColor:'red'}]} />
                    <View style={[styles.point,{backgroundColor:'red'}]} />
                  </View>
                  <View style={{width:16,flexDirection:'row',justifyContent:'space-around',marginTop:3}}>
                    <View style={[styles.point,{backgroundColor:'red'}]} />
                    <View style={[styles.point,{backgroundColor:'red'}]} />
                  </View>
                </View>
              )
              case 5:
              return (
                <View style={styles.dicePointWrap}>
                  <View style={{width:15,flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                  <View style={{width:15,flexDirection:'row',justifyContent:'center'}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                  <View style={{width:15,flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                </View>
              )
              case 6:
              return (
                <View style={styles.dicePointWrap}>
                  <View style={{width:15,flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                  <View style={{width:15,flexDirection:'row',justifyContent:'space-between',marginTop:1}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                  <View style={{width:15,flexDirection:'row',justifyContent:'space-between',marginTop:1}}>
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                    <View style={[styles.point,{backgroundColor:'#333'}]} />
                  </View>
                </View>
              )
            }
          })(number)
        }
      </Image>
    </View>
  )
}

const BallStyle = (item, index, categoryId)=> {
  if(['7', '8'].includes(categoryId)) {
    return lhcBall(item, index)
  } else if(categoryId === '2') {
    return diceBall(item, index)
  } else if(categoryId === '5') {
    return pk10(item, index)
  } else {
    return defaultBall(item, index)
  }
}
const styles = StyleSheet.create({
  default: {
    width: 22,
    height: 22,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Config.baseColor,
  },
  lhc: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  lhcNum: {
    width: 20,
    height: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Config.baseColor,
  },
  lhcSx: {
    marginTop: 5,
    fontSize: 11,
    color: '#555',
  },
  diceBg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  dicePointWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pk10: {
    width: winWidth>330 ? ((winWidth - 1) / 2 - 10) / 5 : 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pk10Text: {
    color: '#EC0909',
    textAlign: 'center',
    fontSize: winWidth<=350?12:14,
  },
  point: {
    width: 5,
    height: 5,
    borderRadius: 50,
    backgroundColor: '#000',
  },
  numText: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
  },
})

export default BallStyle
