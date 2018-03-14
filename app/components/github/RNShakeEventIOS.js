import { DeviceEventEmitter } from 'react-native'

let listener
class RNShakeEventIOS {
  static addEventListener(type, handler) {
    listener = DeviceEventEmitter.addListener('ShakeEvent', () => {
      if (handler) {
        handler()
      }
    })
  }
  static removeEventListener(type, handler) {
    if (!listener) {
      return
    }
    if (handler) {
      handler()
    }
    listener.remove()
  }
}

export default RNShakeEventIOS
