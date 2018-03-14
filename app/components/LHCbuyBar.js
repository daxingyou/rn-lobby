import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import ButtonIos from './ButtonIos'
import KeyboardSpacer from '../components/github/KeyboardSpacer'
import Sound from '../components/clickSound'
import Config from '../config/global'
import { connect } from "react-redux"

const isIos = Platform.OS === "ios"

class BuyBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      betInput: 2,
      btnState: false,
    }
    this.ConfirmCheck = this.ConfirmCheck.bind(this)
  }
  componentWillMount() {
    this.props.onChangeText(this.state.betInput)
  }
  ChangeText (betInput){
    this.setState({ betInput },()=>{
      this.props.onChangeText(betInput)
    })
  }
  ConfirmCheck(){
    if(!this.props.isLogin){
      this.props.navigation.navigate('LoginPage')
      return
    }

    this.props.onPressConfirm()
  }
  render() {
    const ordersNum =  this.props.sendAction.orders && Object.keys(this.props.sendAction.orders).length  || 0
    let btnState = Boolean(this.state.betInput>0)&&Boolean(this.props.sendAction.orders)&&Boolean((ordersNum>0))
    let disableState = false
    return(
            <View>
              {
                (()=>{
                  if(ordersNum>0){

                switch(this.props.type)
                {
                  case 1:
                  return(
                    ordersNum>=2?
                    <Text style={styles.betMsg}>{ordersNum}串1 共 {this.props.zuhe>0?this.props.betInput:0} 元</Text>
                    :null
                  )
                  case 2:
                  return(
                    <Text style={styles.betMsg}>{this.props.zuhe}种组合 共 {this.props.zuhe>0?this.props.betInput * this.props.zuhe : 0} 元</Text>
                  )
                  default:
                  return(
                    <Text style={styles.betMsg}>{ordersNum} 注 {this.props.betInput*ordersNum} 元</Text>
                  )
                }
                }
                })()
              }
              <View style={styles.buyContent}>
                <View style={styles.betConfirm}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    style={styles.randomBtn}
                    onPress={() => {
                      Sound.stop()
                      Sound.play()
                      if (ordersNum > 0) {
                        this.props.onPressCancelInput()
                      } else {
                        this.props.randomOrder()
                      }
                    }}>
                    <Text style={styles.randomBtnText}>{ordersNum > 0 ? '清空' : '机选'}</Text>
                  </TouchableOpacity>
                  <View style={styles.betInputLeft}>
                    <Text style={styles.betInputLeftMsg}>单注</Text>
                    <TextInput underlineColorAndroid='transparent'
                      style={styles.textInput}
                      onChangeText={betInput => {
                        this.ChangeText(betInput.replace(/[^\d{1,}|\d{1,}]|^0{1,}\d{1,}|[,,.]{1,}/g,''))
                      }}
                      keyboardType={"number-pad"}
                      defaultValue={"2"}
                      value={String(this.state.betInput)}
                      maxLength={6}/>
                  <Text style={styles.yuan}>元</Text>
                  </View>
                  <ButtonIos
                    disabled={!btnState}
                    flexOrientation='row'
                    containerStyle={styles.betBtnContainer}
                    styleTextLeft={styles.betBtnText}
                    styleTextRight={styles.betBtnText}
                    onPress={() => {Sound.stop();Sound.play(); disableState=!disableState; btnState===true?this.ConfirmCheck():null }}
                    text='确定'/>
                </View>
              </View>
              {
                isIos?<KeyboardSpacer />:null
              }
            </View>
    )}
  }

const styles = StyleSheet.create({
  betMsg: {
    height: 22,
    lineHeight: 22,
    backgroundColor: "#e5e9f2",
    textAlign: "center",
    fontSize: 12,
    color:'#333',
    letterSpacing: 1,
  },
  buyContent: {
    height: 50,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#E7E7E7',
  },
  betConfirm: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  betBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1.37,
  },
  randomBtn: {
    width: 60,
    height: 30,
    backgroundColor: '#FFEFEF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Config.baseColor,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomBtnText: {
    color: Config.baseColor,
    fontSize: 16,
    letterSpacing: 1.37,
  },
  betBtnContainer: {
    width: 60,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Config.baseColor,
  },
  betInputLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  betInputLeftMsg: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  textInput: {
    width: 89,
    height: 30,
    padding: 0,
    fontSize: 16,
    color: '#666666',
    backgroundColor: '#FFFAFA',
    borderColor: '#FFC8C8',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  yuan: {
    fontSize: 16,
    color: "#666666",
  },
})

const mapStateToProps = (state) => {
  return {
    isLogin: !!state.userInfo.token,
  }
}

export default connect(mapStateToProps, null)(BuyBar)
