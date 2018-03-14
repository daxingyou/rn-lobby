import { eraseUserInfo, popToTop } from '../containers/appNavigator'
import Immutable from 'immutable'
import md5 from 'md5'
import { toastShort } from './toastUtil'
import { Platform } from 'react-native'
import Config from '../config/global'
import updateList from '../../updateLog'
import XDate from 'xdate'

const HOST = `${Config.host}/Mobile`
const TIMEHOST = `${Config.host}/time`
const isIos = Platform.OS == "ios"
const OS = (isIos || Platform.OS == "android") ? Platform.OS : "phone"

let UMNative = -1
if (isIos) {
  UMNative = require('react-native').NativeModules.UMNative
} else {
  UMNative = require('react-native').NativeModules.UmengNativeModule
}
const defaultHeader = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

export const _fetch = (data) => {
  let { host, method, postData, timeout, token } = data
  host = host || HOST
  timeout = timeout || 15000
  method = method || 'POST'
  let init = null
  if (method === 'POST') {
    let contentStr = getContentStr(postData)
    let body = JSON.stringify(postData)
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': OS,
      'Authorization': md5(contentStr),
    }
    if (token) {
      headers['token'] = token
    }
    init = {
      method,
      headers,
      body,
    }
  }

  let fetchPromise = new Promise((resolve, reject) => {
    let resData
    fetch(host, init).then(res => {
      let response = res.clone()
      response.text().then(d => resData = d)
      return res.json()
    }).then(res => {
      resolve(res)
    }).catch(err => {
      toastShort('网络异常')
      if (resData && postData.act != 18888) {
        reportInterfaceErr(init.body, resData)
      }
      reject(err)
    })
  })

  let abortFn = null
  let abortPromise = new Promise((resolve, reject) => {
    abortFn = () => {
      reject({message: '网络请求超时'})
    }
  })
  let abortablePromise = Promise.race([fetchPromise, abortPromise])

  setTimeout(() => {
    abortFn()
  }, timeout)

  return abortablePromise
}

export const fetchWithStatus = (data, headers = defaultHeader, isAuto2LoginPage = true) => {
  let contentStr = getContentStr(data)
  let body = JSON.stringify(data)
  headers = Object.assign(headers, {'User-Agent': OS}, {'Authorization': md5(contentStr)})
  return new Promise((resolve, reject) => {
    let resData
    fetch(HOST, {
      method: 'POST',
      headers,
      body,
    })
    .then((res) => {
      let response = res.clone()
      response.text().then(d =>
        resData = d
      )
      return res.json()
    })
    .then((res) => {
      if (res.status === 0) {
        resolve(res)
      } else if (res.status === 9000003 && isAuto2LoginPage) { // 未登录 || 被挤掉线
        eraseUserInfo()
        popToTop()
      } else {
        reject(res)
      }
    })
    .catch(err => {
      toastShort('网络异常')
      if (resData && data.act != 18888) {
        reportInterfaceErr(body, resData)
      }
      reject(err)
    })
    .done()
  })
}

export const fetchTime = (data, headers = defaultHeader, isAuto2LoginPage = true) => {
  let contentStr = getContentStr(data)
  let body = JSON.stringify(data)
  headers = Object.assign(headers, {'User-Agent': OS}, {'Authorization': md5(contentStr)})
  return new Promise((resolve, reject) => {
    let resData
    fetch(TIMEHOST, {
      method: 'POST',
      headers,
      body,
    })
    .then((res) => {
      let response = res.clone()
      response.text().then(d =>
        resData = d
      )
      return res.json()
    })
    .then((res) => {
      console.log('RES', res)
      if (res.status === 0) {
        resolve(res)
      } else if (res.status === 9000003 && isAuto2LoginPage) { // 未登录 || 被挤掉线
        eraseUserInfo()
        popToTop()
      } else {
        reject(res)
      }
    })
    .catch(err => {
      toastShort('网络异常')
      if (resData && data.act != 18888) {
        reportInterfaceErr(body, resData)
      }
      reject(err)
    })
    .done()
  })
}

export const fetchWithOutStatus = (data, headers = defaultHeader, isAuto2LoginPage = true) => {
  let contentStr = getContentStr(data)
  let body = JSON.stringify(data)
  headers = Object.assign(headers, {'User-Agent': OS}, {'Authorization': md5(contentStr)})
  return new Promise((resolve, reject) => {
    let resData
    fetch(HOST, {
      method: 'POST',
      headers,
      body,
    })
    .then((res) => {
      let response = res.clone()
      response.text().then(d =>
        resData = d
      )
      return res.json()
    })
    .then((res) => {
      if (res.status === 9000003 && isAuto2LoginPage) { // 未登录 || 被挤掉线
        eraseUserInfo()
        popToTop()
      } else {
        resolve(res)
      }
    }).catch(err => {
      if (data.act != 10003) {
        toastShort('网络异常')
        if (resData && data.act != 18888) {
          reportInterfaceErr(body, resData)
        }
      }
      reject(err)
    })
    .done()
  })
}


/**
 * 异常接口报告
 * @param  {object} requestData  异常接口请求数据
 * @param  {string} responseData 异常接口返回数据
 * @return {void}
 */
const reportInterfaceErr = (requestData, responseData) => {
  let channelName = isIos ? 'App Store' : 'default'
  try {
    if (UMNative !== -1 && UMNative.channelId) {
      channelName = UMNative.channelId
    }
  } catch (e) {
    console.warn('get channel errer: ', e)
  }
  const currentDate = new XDate(false)
  fetchWithStatus({
    act: 18888,
    requestData,
    responseData,
    terminal: isIos ? 3 : 4,
    version: updateList[updateList.length - 1].version,
    channelNames: channelName,
    type: 1,
    occurDate: currentDate.toString('yyyy-M-d HH:mm:ss'),
  }, defaultHeader).catch(e => console.warn('act:18888 err: ', e))
}

const sortArray = (arr) => {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    let val = arr[i]
    if (typeof val == 'object') {
      if (Array.isArray(val)) {
        newArr[i] =  sortArray(val)
      } else if (Object.keys(val).length > 0) {
        newArr[i] = sortObj(val)
      } else {
        newArr[i] = val
      }
    } else {
      newArr[i] = val
    }
  }

  return newArr
}

const sortObj = (obj) => {
  let sortKeys = Object.keys(obj).sort()
  let newObj = {}
  for (let key of sortKeys) {
    let val = obj[key]
    if (typeof val == 'object') {
      if (Array.isArray(val)) {
        newObj[key] = sortArray(val)
      } else if (!Array.isArray(val) && Object.keys(val).length > 0) {
        newObj[key] = sortObj(val)
      } else {
        newObj[key] = val
      }
    } else {
      newObj[key] = val
    }
  }
  return newObj
}

const getContentStr = (data) => {
  let content = sortObj(Immutable.fromJS(data).toJS())
  let keys = Object.keys(content).sort()
  let newArr = []
  for (let key of keys) {
    let val = content[key]
    if (typeof val == 'object') {
      val = JSON.stringify(val)
    }
    newArr.push(`${key}=${val}`)
  }
  let contentStr = newArr.join('&')
  contentStr += 'kosun.net'
  return contentStr
}
