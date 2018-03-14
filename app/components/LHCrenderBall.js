import React from "react"
import { StyleSheet, Dimensions} from 'react-native'
import ButtonBall from './ButtonBall'

const windowWidth = Dimensions.get('window').width

export const _renderGridItem1 = (item, callback, rate)=> { //5列
  const isSelect = item.isSelected
  const r = rate||item.rate
  return (
    <ButtonBall
      ballType={'small'}
      key={item.label}
      isSelect={isSelect}
      containerStyle={styles.grid5Btn}
      styleTextLeft={[isSelect ? { color: '#FFF' } : { color: '#000'},r?{}:{marginTop:-4},{fontSize: 20, backgroundColor: 'transparent'}]}
      styleTextRight={{ color: '#FF0000', marginTop: 6, fontSize: 12, backgroundColor: 'transparent' }}
      text={r?item.label + " " + r:item.label}
      onPress={() => callback(item)}/>
  )
}

export const _renderGridItem2 = (item, callback) => { // 4列
  const isSelect = item.isSelected
  return (
    <ButtonBall
      ballType={'big'}
      key={item.label}
      isSelect={isSelect}
      containerStyle={styles.grid4Btn}
      styleTextLeft={[{marginTop:-18, fontSize:20, backgroundColor:'transparent'}, isSelect? { color: '#FFF' } : { color: '#000'}]}
      styleTextRight={[{marginTop:-25, backgroundColor:'transparent'}, isSelect? { color: '#FFF'} : { color:'#FF0000'}]}
      text={item.label + " " + item.rate}
      onPress={() => callback(item)}/>
  )
}

export const ButtonItem = ({ item, onPressItem, rate }) => {
  let r = rate||item.rate
  const isSelect = item.isSelected
  const color = item.color?{"R":'#ff0000',"G":'#00C017',"B":'#0A74B9'}[item.color]:'#000'
  const txt = (()=>{
    let t = item.label+" "
    if(r && item.title !== '不中') {
      r = typeof r === 'number' ? r.toFixed(3) : r
      t += "赔率:" + r
    }
    if(item.numbers) {
      t += " " + item.numbers
    }
    return t
  })()
  return (
      <ButtonBall
        ballType = 'sx'
        key={item.token}
        isSelect={isSelect}
        flexOrientation='column'
        containerStyle={styles.gridBtn}
        styleTextLeft={[isSelect ? { color: '#FFF' } : {color},{marginTop:-40,fontSize: 20, backgroundColor: 'transparent'},r?{}:{marginTop:-25}]}
        styleTextRight={[isSelect ? { color: '#FFF' } : { color: '#FF0000'},{marginTop:-40,fontSize: 14, backgroundColor: 'transparent'},item.numbers?{}:{marginTop:-30}]}
        styleTextEnd={[isSelect ? { color: '#fff' } : { color: '#666' }, { marginTop:-20, fontSize: 12, backgroundColor: 'transparent' },r?{}:{marginTop:-25}, item.numbers&&item.numbers.split('/').length>=5?{fontSize:10}:{fontSize:12}]}
        text={txt}
        onPress={() => onPressItem()}/>
  )
}

const styles = StyleSheet.create({
  grid4Btn: {
    margin: windowWidth>=350?10:4,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid5Btn: {
    margin: windowWidth>=350?(windowWidth>=400?12:9):6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBtn: {
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    marginBottom: 10,
  },
})