import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native'
import { connect } from 'react-redux'
import codePush from "react-native-code-push"
import { NavigationActions } from 'react-navigation'

const { width, height } = Dimensions.get('window')

class Splash extends Component {
  constructor(props) {
    super(props)
    this.state = {
      updateInfo: '正在加载配置',
    }
  }

  componentDidMount() {
    const codePushPromise = new Promise((resolve) => {
      this.checkUpdate(resolve)
    })

    const timerPromise = new Promise((resolve) => {
      this.timer = setTimeout(() => {
        resolve()
      }, 4000)
    })

    Promise.all([codePushPromise, timerPromise]).then(() => {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [ NavigationActions.navigate({ routeName: 'MyTab'}) ],
      })
      this.props.navigation.dispatch(resetAction)

      DeviceEventEmitter.emit('ADVERT')
    }).catch((err) => {console.warn(err)})
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimer)
    clearTimeout(this.timer)
  }

  codePushStatusDidChange = (status) => {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({
          updateInfo: '正在检查新配置',
        })
        break
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        break
      case codePush.SyncStatus.INSTALLING_UPDATE:
        break
      case codePush.SyncStatus.UP_TO_DATE:
        this.setState({
          updateInfo: '正在安装配置内容',
        })
        break
      case codePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({
          updateInfo: '将重新打开应用',
        })
        break
    }
  }

  codePushDownloadDidProgress = (progress) => {
    this.setState({
      updateInfo: `正在下载新配置${(progress.receivedBytes / progress.totalBytes * 100).toFixed(2)}%`,
    })
  }

  checkUpdate = (resolve) => {
    let doUpdate = true
    let checkReturn = false
    this.updateTimer = setTimeout(() => {
      if (!checkReturn) {
        doUpdate = false
        resolve('updateTimer end')
      }
    }, 5000)
    codePush.checkForUpdate().then((update) => {
      checkReturn = true
      if (doUpdate) {
        if (!update) {
          this.setState({updateInfo: '当前是最新配置'}, () => {resolve()})
        } else {
          codePush.sync(
            {installMode: codePush.InstallMode.IMMEDIATE},
            this.codePushStatusDidChange,
            this.codePushDownloadDidProgress
          ).then(() => {
            resolve()
          }).catch(() => {
            resolve()
          })
        }
      } else {
        resolve()
      }
    }).catch(() => {
      resolve()
    })
    codePush.notifyAppReady()
  }

  render() {
    const { advertImg } = this.props
    return (
      <View style={{ flex: 1, alignItems: 'stretch'}}>
        <View  style={styles.adImage}>
        {
          !!advertImg && (
            <Image source={{uri: advertImg}} style={styles.advertImg} />
          )
        }
        </View>
        <View>
          <Image source={require('../config/ic_app_splash.webp')} style={styles.imgCopyright} >
            <Text style={styles.updateText}>{this.state.updateInfo}</Text>
          </Image>
        </View>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  adImage: {
    flex: 1,
    backgroundColor: '#fff',
  },
  advertImg: {
    width: width,
    height: width / 650 * 930,
  },
  imgCopyright: {
    width: width,
    height: width / 750 * 222,
  },
  updateText: {
    textAlign:'center',
    fontSize: 14,
    color: '#666666',
    backgroundColor: 'transparent',
  },
})

const mapStateToProps = state => {
  return {
    advertImg: state.sysInfo.advertImg,
  }
}


export default connect(mapStateToProps)(Splash)
