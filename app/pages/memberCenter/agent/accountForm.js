import React, { Component } from 'react'
import {
  View, Image, StyleSheet, Dimensions, Text, TouchableOpacity,
  ScrollView, TextInput, Alert, Modal, TouchableWithoutFeedback, CameraRoll,
  PermissionsAndroid, UIManager, Platform, Clipboard,
} from 'react-native'
import Immutable from 'immutable'
import dismissKeyboard from '../../../utils/dismissKeyboard'
import Sound from '../../../components/clickSound'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { clearNoNum } from '../../../utils/formatUtil'
import Config from '../../../config/global'
const { height } = Dimensions.get('window')

const radioSelected = require('../../../src/img/ic_selected.png')
const radioUnselected = require('../../../src/img/ic_unselected.png')
const inputComponents = []
const isAndroid = Platform.OS !== 'ios'
let isActivated

export default class AccountForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'agent',
      userName: '',
      pwd: 'ks123456',
      rebate: props.userInfo.rebate,
      isFetching: false,
      showQCode: false,
      code: '',
      qrcode: '',
    }
    this.contentHeight = 0
    this.saveImage = this.saveImage.bind(this)
  }

  _onStartShouldSetResponderCapture = (event) => {
    let target = event.nativeEvent.target
    if(!inputComponents.includes(target)) {
        dismissKeyboard()
    }
    return false
  }

  _inputOnLayout = (e) => {
    inputComponents.push(e)
  }

  async saveImage () {
    if (isAndroid) {
      const RNFetchBlob = require('react-native-fetch-blob').default
      const {qrcode} = this.state
      let result = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: ' 权限请求 ',
          message:
            ' 该应用需要如下权限 ' + ' 保存图片 ' + ' 请授权! ',
        },
      )
      if (result) {
        RNFetchBlob.config({
          appendExt : 'jpeg',
          fileCache : true,
        })
        .fetch('GET', qrcode)
        .then((res) => {
          CameraRoll.saveToCameraRoll(res.path()).then(() => {
            Alert.alert('图片已保存到本地')
          })
        })
      }
    } else {
      UIManager.takeSnapshot(this.refs.location, { format: 'png', quality: 1 })
        .then(uri => {
          CameraRoll.saveToCameraRoll(uri)
        })
      Alert.alert('图片已保存到本地')
    }
  }

  keyboardDidShow = () => {
    const keyboardHeight = 300
    this.button.measure((fx, fy, w, h, px, py) => {
      const marginBottomHeight = height - py
      if (marginBottomHeight < keyboardHeight ) {
        const moveHeight = keyboardHeight - marginBottomHeight
        this.scroll.scrollTo({ y: moveHeight, x: 0 })
      }
    })
  }
  keyboardDidHide = () => {
    this.scroll.scrollTo({ y: 0, x: 0 })
  }
  handleBtnClient = () => {
    const { formType, resetRefreshMark, token, userInfo } = this.props
    const { type, userName, rebate } = this.state
    let body = {}
    const requestRebate = Immutable.fromJS(rebate).toJS().filter((item) => delete item.categoryName )
    if (formType === 'accurateAccount') {
      body = {
        act: 10302,
        type: type === 'agent' ? 1 : 2,
        userName,
        rebate: requestRebate,
      }
    } else if (formType === 'generateInviCode'){
      body = {
        act: 10303,
        type: type === 'agent' ? 1 : 2,
        rebate: requestRebate,
      }
    }

    fetchWithOutStatus(body, { token }).then(res => {
      this.setState({isFetching: false}, () => {
        if (formType === 'accurateAccount' && res.status === 0) {
          Alert.alert('', res.message, [
            { text: '确认', onPress: () => {
              this.setState({rebate: userInfo.rebate})
            } },
          ], { cancelable: false })
        } else if (formType === 'generateInviCode' && res.status === 0) {
          this.setState({
            showQCode: true,
            code: res.code,
            qrcode: res.qrcode,
            userName: '',
            rebate: userInfo.rebate,
          }, () => {
            resetRefreshMark(res.code)
          })
        } else {
          Alert.alert('', res.message, [
            { text: '确认', onPress: () => {
              this.setState({rebate: userInfo.rebate})
            } },
          ], { cancelable: false })
        }
      })
    }).catch(err => {
      this.setState({isFetching: false, rebate: userInfo.rebate})
      console.warn(err)
    })
  }

  modelQCode = () => {
    const { showQCode, code, qrcode } = this.state
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={showQCode}>
        <TouchableWithoutFeedback
          onPress={()=>this.setState({showQCode: false})}>
        <View style={styles.modelBg}>
          <View style={styles.winWrap}>
            <TouchableWithoutFeedback
              style={styles.confirmBtn}
              onLongPress={() => {
                Sound.stop()
                Sound.play()
                this.saveImage()
              }}>
              {qrcode !== '' && <Image ref='location' style={styles.qCodeImg} source={{uri: qrcode}}/>}
            </TouchableWithoutFeedback>
            <Text style={styles.tipsText1}>长按可保存二维码</Text>
            <Text style={styles.tipsText}>您生成的邀请码为</Text>
            <Text style={styles.invCodeText}>{code}</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.confirmBtn}
              onPress={() => {
                Sound.stop()
                Sound.play()
                this.setState({showQCode: false})
                Clipboard.setString(code)
              }}>
              <Text  style={styles.confirmBtnText}>复制邀请码</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
  render() {
    const { userInfo, formType } = this.props
    const { type, userName, pwd, rebate, isFetching } = this.state
    isActivated = false
    let btnText = ''
    let btnDisText = ''
    if (formType === 'accurateAccount') {
      btnText = '立即开户'
      btnDisText = '开户中'
      if (userName && rebate) {
        isActivated = true
      }
    } else if (formType === 'generateInviCode') {
      btnText = '生成邀请码'
      btnDisText = '开户中'
      if (rebate) {
        isActivated = true
      }
    }
    return (
      <ScrollView
        ref = {(ref) => this.scroll = ref}
        style={{flex: 1}}
        onContentSizeChange ={(contentWidth, contentHeight)=>{
          this.contentHeight = parseInt(contentHeight)
        }}
        onStartShouldSetResponderCapture={this._onStartShouldSetResponderCapture}>
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Image style={styles.fieldIcon} source={require('../../../src/img/agent_type.png')}/>
              <Text style={styles.fieldsText}>类型</Text>
            </View>
            <View style={styles.rowRight}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.typeOption}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.setState({ type: 'agent' })
                }}>
                <Image style={styles.radioIcon} source={type === 'agent' ? radioSelected : radioUnselected} />
                <Text style={styles.typeOptionText}>代理</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.typeOption, {marginLeft: 45}]}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  this.setState({ type: 'user' })
                }}>
                <Image style={styles.radioIcon} source={type === 'user' ? radioSelected : radioUnselected} />
                <Text style={styles.typeOptionText}>玩家</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            formType === 'accurateAccount' && (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Image style={styles.fieldIcon} source={require('../../../src/img/agent_user.png')}/>
                  <Text style={styles.fieldsText}>用户名</Text>
                </View>
                <View style={styles.rowRight}>
                  <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.input}
                    onLayout={(event) => { this._inputOnLayout(event.nativeEvent.target) }}
                    keyboardType={'ascii-capable'}
                    maxLength={16}
                    placeholder='字母开头6-16位数字或字母'
                    onChangeText={(text) => { this.setState({userName: text}) }}
                    value={userName}/>
                </View>
              </View>
            )
          }
          {
            formType === 'accurateAccount' && (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Image style={styles.fieldIcon} source={require('../../../src/img/agent_pwd.png')}/>
                  <Text style={styles.fieldsText}>初始密码</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.pwd}>{pwd}</Text>
                </View>
              </View>
            )
          }
          {
            !!userInfo.rebate && userInfo.rebate.map((item, index) => {
              return (
                <View style={[styles.row]} key={index}>
                  <View style={[styles.rowLeft, index > 0 && { paddingLeft: 18 }]}>
                    {index === 0 &&  <Image style={styles.fieldIcon} source={require('../../../src/img/agent_rebate.png')} />}
                    <Text style={styles.fieldsText}>{item.categoryName}返点</Text>
                  </View>
                  <View style={[styles.rowRight,  index > 0 && { marginLeft: -18 }]}>
                    <TextInput
                      underlineColorAndroid='transparent'
                      style={styles.input}
                      onLayout={(event) => { this._inputOnLayout(event.nativeEvent.target)}}
                      keyboardType={'numeric'}
                      onFocus={() => {
                        this.keyboardDidShow()
                        const newRebate = Immutable.fromJS(rebate).toJS()
                        newRebate[index].userRebate = ''
                        this.setState({ rebate: newRebate })
                      }}
                      onBlur={() => {
                        this.keyboardDidHide()
                        const newRebate = Immutable.fromJS(rebate).toJS()
                        if (!newRebate[index].userRebate) {
                          newRebate[index].userRebate = item.userRebate
                          this.setState({ rebate: newRebate })
                        }
                      }}
                      maxLength={16}
                      placeholder={`请输入彩票返点（0.0～${item.userRebate}）`}
                      onChangeText={(text) => {
                        const newRebate = Immutable.fromJS(rebate).toJS()
                        const value = Number(clearNoNum(text)) > Number(item.userRebate) ? item.userRebate : clearNoNum(text)
                        newRebate[index] = { userRebate: value, categoryId: item.categoryId }
                        this.setState({ rebate: newRebate })
                      }}
                      value={rebate[index] && rebate[index].userRebate}/>
                  </View>
                </View>
              )
            })
          }
        </View>
        <View style={styles.btnWrap}>
          <TouchableOpacity
            ref={(ref) => this.button = ref}
            activeOpacity={0.85}
            style={[styles.btn, isActivated && styles.btnActiveted]}
            disabled={!isActivated || isFetching}
            onPress={() => {
              this.setState({
                isFetching: true,
              }, () => {
                Sound.stop()
                Sound.play()
                this.handleBtnClient()
              })
            }}>
            <Text style={[styles.btnText, isActivated && styles.btnTextActiveted]}>
              {isFetching ? btnDisText : btnText}
            </Text>
          </TouchableOpacity>
        </View>
        { this.modelQCode() }
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  form: {
    marginTop: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  row: {
    height: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fieldIcon: {
    width: 18,
    height: 18,
  },
  fieldsText: {
    marginLeft: 9,
    color: '#333333',
    fontSize: 14,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioIcon: {
    height: 15,
    width: 15,
  },
  typeOptionText: {
    marginLeft: 15,
    color: '#333333',
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  pwd: {
    fontSize: 14,
    color: '#EC0909',
  },
  btnWrap: {
    paddingTop: 26,
    paddingHorizontal: 15,
  },
  btn: {
    height: 40,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#999999',
    fontSize: 18,
  },
  btnActiveted: {
    backgroundColor: Config.baseColor,
  },
  btnTextActiveted: {
    color: '#FFFFFF',
  },
  modelBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winWrap: {
    width: 300,
    height: 329,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  qCodeImg: {
    marginTop: 20,
    width: 160,
    height: 160,
  },
  tipsText1: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
  tipsText: {
    marginBottom: 5,
    marginTop: 5,
    fontSize: 12,
    color: '#333333',
  },
  invCodeText: {
    fontSize: 18,
    color: '#EC0909',
  },
  confirmBtn: {
    marginTop: 20,
    width: 205,
    height: 40,
    backgroundColor: '#EC0909',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
})
