import { AsyncStorage, Platform, NativeModules } from 'react-native'
import UmengPush from 'react-native-umeng-push'
import { fetchWithStatus } from './fetchUtil'
import Config from '../config/global'
const isIos = Platform.OS === 'ios'

let UMNative = -1
if (isIos) {
  UMNative = NativeModules.UMNative
} else {
  UMNative = NativeModules.UmengNativeModule
}

/**
 * 汇报友盟PushToken，appKey
 * 应用首次打开如果能拿到deviceToken并且跟本地保存的deviceToken不一致试会向服务端汇报
 * 登录注册的时候如果能拿到deviceToken回向服务端汇报
 * @param  {string}  token 用户token
 * @return {void}
 */
export const reportEquipement = async (token, fromLogin = false) => {
  let pushToken = ''
  pushToken = await AsyncStorage.getItem('pushToken')
  UmengPush.getDeviceToken(async (deviceToken) => {
    if (deviceToken && (deviceToken !== pushToken || fromLogin)) {
      pushToken = deviceToken
      await AsyncStorage.setItem('pushToken', pushToken)
      let appKey = isIos ? Config.umengAppKeyIos : Config.umengAppKeyAndroid
      try {
        if (UMNative !== -1 && UMNative.appKey) {
          appKey = UMNative.appKey
        }
      } catch (e) {
        console.warn('get channel errer: ', e)
      }

      const body = {
        act: 10048,
        push_token: pushToken,
        platform: isIos ? 1 : 2,
        app_key: appKey,
      }

      fetchWithStatus(body, { token }).catch(res => {
        console.warn('err', res)
      })
    }
  })
}
