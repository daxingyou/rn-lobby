import React, { Component } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert,
    ScrollView, Switch } from 'react-native'
import { connect } from 'react-redux'
import { fetchWithStatus, fetchTime } from '../../utils/fetchUtil'
import Immutable from 'immutable'
import HeaderToolBar from '../../components/HeadToolBar'
import SettingListItem from '../../components/SettingListItem'
import ButtonIos from '../../components/ButtonIos'
import { toastShort } from '../../utils/toastUtil'
import { setPhoneSettings, resetUserInfo } from '../../actions'
import codePush from "react-native-code-push"
import Sound from '../../components/clickSound'
import Config from '../../config/global'
import updateList from '../../../updateLog'

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL } //设置频率


const LIST_UP_DATAS = ['我的银行卡', '登录密码']
const LIST_DOWN_DATAS = ['关于我们']
const PHONE_SETTINGS = ['声音', '震动', '摇一摇']

class SettingPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      isErrorPopup: false,
      errorTip: '',
      updateInfo: '',
      delay: null
    }
    this._onPressLoginOut = this._onPressLoginOut.bind(this)
  }

  codePushStatusDidChange(status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({
          updateInfo: '正在检查更新',
        })
        break
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({
          updateInfo: '正在下载更新包',
        })
        break
      case codePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({
          updateInfo: '正在安装',
        })
        break
      case codePush.SyncStatus.UP_TO_DATE:
        this.setState({
          updateInfo: `当前是最新版本${updateList[updateList.length - 1].version}`,
        })
        break
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          updateInfo: '更新完成',
        })
        break
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({
      updateInfo: `正在下载新配置${(progress.receivedBytes / progress.totalBytes * 100).toFixed(2)}%`,
    })
  }


  onPressItem(itemName) {
    const { userInfo, navigation } = this.props
    let fundsPwdStatus = userInfo.funds_pwd_status
    if (itemName === '我的银行卡') {
      navigation.navigate('BankCardMainPage', { token: userInfo.token, realName: userInfo.realname })
    } else if (itemName === '登录密码') {
      navigation.navigate('ModifyLoginPwdPage', { type: 0 })
    } else if (itemName === '资金密码') {
      if (fundsPwdStatus === 1) {
        navigation.navigate('ModifyLoginPwdPage', { type: 1 })
      } else {
        navigation.navigate('FundPwdPage', { isFromSettingItem: true })
      }
    } else if (itemName === '关于我们') {
      navigation.navigate('AboutMePage')
    } else if (itemName === '网速检测') {
      let time1 = Date.now()
      fetch('https://c9.kosunmobile.com/time', {
        method: 'GET'
      })
      .then((res) => {
        if (Number(res.status) === 200) {
          this.setState({ delay: Date.now()-time1 })
        }
      })
      .catch(err => {
        console.log('ERR', err)
        toastShort('网络异常')
      })
      .done()
    } else if (itemName === '版本检测') {
      codePush.sync(
        {
          updateDialog: {
            descriptionPrefix: '提示: ',
            mandatoryContinueButtonLabel: '确定',
            mandatoryUpdateMessage: '有可用更新，必须安装',
            optionalIgnoreButtonLabel: '稍后',
            optionalInstallButtonLabel: '后台更新',
            optionalUpdateMessage: '有新版本了，是否更新？',
            title: '更新提示',
          },
          installMode: codePush.InstallMode.IMMEDIATE,
        },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this)
      )
    } else {
      toastShort('服务在开发中, 敬请期待!')
    }
  }
  _onPressLoginOut() {
    Alert.alert('', '是否退出登录!', [
      { text: '点错了', onPress: () => { return false } },
      { text: '确定',
        onPress: () => {
          const headers = { token: this.props.userInfo.token }
          fetchWithStatus({ act: 10037 }, headers).then(() => {
            this.setState({ isLoading: false })
            this.props.resetUserInfo() // 用户信息置空
            this.props.navigation.goBack()
          }).catch((reason) => { //
            this.setState({ isLoading: false, isErrorPopup: false })

            setTimeout(() => {
              this.setState({ isErrorPopup: true, errorTip: (reason.message || '退出登录失败!') })
            }, 500)
          })
        },
      },
    ])
  }

  handlePhoneSettings(item) {
    let newSetting = Immutable.fromJS(this.props.phoneSettings).toJS()
    if (item == 'sound') {
      newSetting.sound = !this.props.phoneSettings.sound
    } else if (item == 'shake') {
      newSetting.shake = !this.props.phoneSettings.shake
    } else if (item == 'shakeitoff') {
      newSetting.shakeitoff = !this.props.phoneSettings.shakeitoff
    }
    this.props.setPhoneSettings(newSetting)
  }

  render() {
    const { userInfo, navigation } = this.props
    const isClickAvailable = userInfo.token ? true : false
    const isTryAccount = userInfo.account_type === 2
    const { securityCenter } = navigation.state.params
    const fundsPwdStatus = userInfo.funds_pwd_status
    const { updateInfo, delay } = this.state
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'设置'}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}>
          {
            (isClickAvailable && !isTryAccount && securityCenter) ? <Text style={styles.textStyle}>账户安全设置</Text> : null
          }

          {
            (isClickAvailable && !isTryAccount && securityCenter) ?
              LIST_UP_DATAS.map((item, index) => {
                return (
                  <SettingListItem
                    key={index}
                    text={item}
                    styleText={styles.styleText}
                    containerStyle={styles.listItemStyle}
                    onPress={() => {Sound.stop();Sound.play();this.onPressItem.bind(this, item)()}}/>
                )
              }) : null
          }
          {
            (isClickAvailable && !isTryAccount && securityCenter) ?
              <TouchableOpacity
                style={styles.listItemStyle}
                onPress={() => {Sound.stop();Sound.play();this.onPressItem.bind(this, '资金密码')()}}
                activeOpacity={0.85}>
                <Text style={styles.styleText}>{'资金密码'}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ marginRight: 5, color: '#999', fontSize: 15 }}>{fundsPwdStatus ? '已设置' : '未设置'}</Text>
                  <Image source={require('../../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
                </View>
              </TouchableOpacity> : null
          }

          {
            securityCenter ? null :
            <View style={styles.viewUpDown}>
              <Text style={styles.textStyle}>通用</Text>
            </View>
          }
          {
            securityCenter ? null :
            PHONE_SETTINGS.map((item, index) => {
              let alias
              if (item === '声音') {
                alias = 'sound'
              } else if (item === '震动') {
                alias = 'shake'
              } else if (item === '摇一摇') {
                alias = 'shakeitoff'
              }
              return (
                <View style={styles.phoneSettings} key={index}>
                  <Text style={styles.styleText}>{item}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Switch
                      onValueChange={() => {this.handlePhoneSettings(alias)}}
                      value={this.props.phoneSettings[alias]}/>
                  </View>
                </View>
              )
            })
          }
          {
            <TouchableOpacity
              style={styles.updateVersion}
              onPress={() => {Sound.stop();Sound.play();this.onPressItem.bind(this, '网速检测')()}}
              activeOpacity={0.85}>
              <Text style={styles.styleText}>网速检测</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 5, color: '#999', fontSize: 15 }}>{delay && `${delay}ms`}</Text>
                <Image source={require('../../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
              </View>
            </TouchableOpacity>
          }
          {
            securityCenter ? null :
            <TouchableOpacity
              style={styles.updateVersion}
              onPress={() => {Sound.stop();Sound.play();this.onPressItem.bind(this, '版本检测')()}}
              activeOpacity={0.85}>
              <Text style={styles.styleText}>版本检测</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 5, color: '#999', fontSize: 15 }}>{updateInfo}</Text>
                <Image source={require('../../src/img/ic_arrow_right.png')} style={styles.imgStyle} />
              </View>
            </TouchableOpacity>
          }
          {
            securityCenter ? null :
            LIST_DOWN_DATAS.map((item, index) => {
              return (
                <SettingListItem
                  key={index}
                  text={item}
                  styleText={styles.styleText}
                  containerStyle={[styles.listItemStyle, { borderTopWidth: 0, borderBottomWidth: 1 }]}
                  onPress={() => {Sound.stop();Sound.play();this.onPressItem.bind(this, item)()}}/>
              )
            })
          }
          <ButtonIos
            disabled={!isClickAvailable}
            containerStyle={styles.quitBtnStyle}
            text='退出'
            styleTextLeft={styles.quitText}
            onPress={() => {Sound.stop();Sound.play();this._onPressLoginOut()}}/>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  listItemStyle: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
  },
  updateVersion: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  phoneSettings: {
    height: 51,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  styleText: {
    fontSize: 16,
  },
  textStyle: {
    fontSize: 12,
    padding: 10,
    color: '#999999',
  },
  imgStyle: {
    width: 10,
    height: 18,
    resizeMode: 'contain',
  },
  viewUpDown: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  quitBtnStyle: {
    paddingVertical: 12,
    marginHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Config.baseColor,
    marginTop: 25,
    borderRadius: 4,
  },
  quitText: {
    color: 'white',
    fontSize: 20,
  },
})

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    phoneSettings: state.phone.phoneSettings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetUserInfo: () => dispatch(resetUserInfo()),
    setPhoneSettings: (phoneSettings) => dispatch(setPhoneSettings(phoneSettings)),
  }
}

SettingPage = codePush(codePushOptions)(SettingPage)
export default connect(mapStateToProps, mapDispatchToProps)(SettingPage)
