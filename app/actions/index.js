import Immutable from 'immutable'
import { fetchWithStatus, fetchWithOutStatus } from '../utils/fetchUtil'


export const getAdvert = () => (dispatch) => {
  fetchWithOutStatus({act: 10109}).then((res) => {
    if (res && res.image) {
      dispatch(setAdvertImg(res.image))
    }
  }).catch((err) => {
    console.warn(err)
  })
}

const setAdvertImg = (img) => {
  return {
    type: 'SET_ADVERT_IMG',
    img
  }
}

// navigation start

export const resetNav = () => {
  return {
    type: 'RESET_NAV',
  }
}

export const goBack = () => {
  return {
    type: 'GO_BACK',
  }
}

// navigation end

export const setNavName = (navName) => {
  return {
    type: 'SET_NAV_NAME',
    navName,
  }
}

export const setTabName = (tabName) => {
  return {
    type: 'SET_TAB_NAME',
    tabName,
  }
}

export const getHomeData = () => (dispatch) => {
  dispatch(getActivityList())
  dispatch(getHotList())
  dispatch(getWinningList())
  dispatch(getNoticeList())
}

export const getActivityList = () => (dispatch) => { //优惠活动列表
  fetchWithOutStatus({act: 10102}).then((res) => {
    if (res && Array.isArray(res)) {
      dispatch(setActivityList(res))
    }
  }).catch((err) => {
    console.warn(err)
  })
}

const setActivityList = (data) => {
  return {
    type: 'SET_ACTIVITY_LIST',
    data,
  }
}

export const getHotList = () => (dispatch) => { //热门彩种
  fetchWithOutStatus({act: 10016}).then((res) => {
    if (res && Array.isArray(res)) {
      let hotList = res.filter(n => n.category_id != 6 && n.lottery_id)
      hotList = [
        ...hotList.slice(0, 2),
        {
          category_id: "6",
          lottery_id: "pcdd",
          lottery_image_url: "/uploads/images/20170121/58832d62d56c2.png",
          lottery_introduction: "每2分钟开奖",
          lottery_name: "PC蛋蛋",
        },
        ...hotList.slice(2),
      ]
      dispatch(setHotList(hotList))
    }
  }).catch((err) => {
    console.warn(err)
  })
}

const setHotList = (data) => {
  return {
    type: 'SET_HOT_LIST',
    data,
  }
}

export const getWinningList = () => (dispatch) => { //中奖排行榜
  fetchWithOutStatus({act: 10020, page: 1, count: 100, sort: 1}).then((res) => {
    if (res && Array.isArray(res)) {
      dispatch(setWinningList(res))
    }
  }).catch((err) => {
    console.warn(err)
  })
}

const setWinningList = (data) => {
  return {
    type: 'SET_WINNING_LIST',
    data,
  }
}

export const getNoticeList = () => (dispatch) => { //公告列表
  fetchWithOutStatus({act: 10104, type: 3}).then((res) => {
    if (res && Array.isArray(res)) {
      dispatch(setNoticeList(res.map(item => item.notice_content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' '))))
    }
  }).catch((err) => {
    console.warn(err)
  })
}

const setNoticeList = (data) => {
  return {
    type: 'SET_NOTICE_LIST',
    data,
  }
}

export const getLotteryList = () => (dispatch) => {
  let startTime = new Date().getTime()
  fetchWithOutStatus({act: 10001}).then((res) => {
    let endTime = new Date().getTime()
    let timeDifference = endTime - res[0].lottery_info[0].now_time * 1000
    if (res) {
      dispatch(setNetworkDelay(endTime - startTime, timeDifference))
      dispatch(setLotteryList(res))
    }
  }).catch((err) => {
    console.warn(err)
  })

}

const setNetworkDelay = (delay, timeDifference) => {
  return {
    type: 'SET_NETEORK_DALAY',
    delay,
    timeDifference,
  }
}

export const setKeep = (lotteryId, type, callBack) => (dispatch, getState) => {
  let body = {act: 10011, lottery_id: lotteryId, action_type: type}
  fetchWithStatus(body, { token: getState().userInfo.token }).then((res) => {
    let lotteryList = getState().lotteryList
    for (let categoryList of lotteryList) {
      for (let lottery of categoryList.lottery_info) {
        if (lottery.lottery_id == lotteryId) {
          lottery['is_keep'] = type
        }
      }
    }
    callBack(res.status)
    dispatch(setLotteryList(lotteryList))
  }).catch((res) => {
    console.warn('catch', res)
    callBack(res.status)
  })

}

const setLotteryList = (lotteryList) => {
  return {
    type: 'SET_LOTTERY_LIST',
    lotteryList,
  }
}

const setLhcConfig = (config) => {
  return {
    type: 'SET_LHC_CONFIG',
    config,
  }
}

export const getPlayList = (lotteryId) => (dispatch) => {
  dispatch(resetCountdown())
  fetchWithOutStatus({act: 10002, lottery_id: lotteryId}).then(res => {
    if (res) {
      dispatch(setLotteryMap(lotteryId, res.layout))
      dispatch(setLotteryId(lotteryId, res.category_id))
      dispatch(getBetCountdown(lotteryId))
      dispatch(getLotteryRecord(lotteryId))
    }
  }).catch(err => {
    console.warn(err)
  })
}

export const getNewPlayList = (lotteryId) => (dispatch) => {
  dispatch(resetCountdown())
  if (['27', '28'].includes(lotteryId)) {
    fetchWithOutStatus({act: 10065, date: new Date().toISOString().slice(0, 10)}).then(res => {
      if (res.status === 0) {
        dispatch(setLhcConfig(res.data))
      } else {
        console.warn(res.message)
      }
    }).catch(err => {
      console.warn(err)
    })
  }
  fetchWithOutStatus({act: 10066, lottery_id: lotteryId}).then(res => {
    if (res.status === 0) {
      dispatch(setLotteryMap(lotteryId, res.data))
      dispatch(setLotteryId(lotteryId, res.data.categoryId))
      dispatch(getBetCountdown(lotteryId))
      dispatch(getLotteryRecord(lotteryId))
    } else {
      console.warn(res.message)
    }
  }).catch(err => {
    console.warn(err)
  })
}

const setLotteryMap = (lotteryId, playList) => {
  return {
    type: 'SET_LOTTERY_MAP',
    lotteryId,
    playList,
  }
}

export const getBetCountdown = (lotteryId) => (dispatch) => {
  let startRequestTime = new Date()
  fetchWithOutStatus({act: 10003, lottery_id: lotteryId}).then((res) => {
    if (res) {
      let endRequestTime = new Date().getTime()
      let delay = endRequestTime - startRequestTime
      let nowTime = res.now_time * 1000
      let startTime = res.start_time * 1000
      let endTime = res.end_time * 1000
      let issue = res.issue_no
      let timeDifference = endRequestTime - res.now_time * 1000
      dispatch(setBetCountdown(delay, nowTime, startTime, endTime, issue, timeDifference))
    }
  }).catch(() => {
    setTimeout(() => {
      dispatch(getBetCountdown(lotteryId))
    }, 7000)
  })
}

const setBetCountdown = (delay, nowTime, startTime, endTime, issue, timeDifference) => {
  return {
    type: 'SET_COUNTDOWN',
    delay,
    endTime,
    issue,
    nowTime,
    startTime,
    timeDifference,
  }
}

export const resetCountdown = () => {
  return {
    type: 'RESET_COUNTDOWN',
  }
}

export const getLotteryRecord = (lotteryId) => (dispatch) => {
  fetchWithOutStatus({act: 10017, lottery_id: lotteryId}).then((res) => {
    if (res) {
      dispatch(setLotteryRecord(res))
    }
  }).catch((err) => {
    console.warn(err)
  })
}

const setLotteryRecord = (lotteryRecord) => {
  return {
    type: 'SET_LOTTERY_RECORD',
    lotteryRecord,
  }
}

//--------start orderInfo-------------

export const setRandomInfo = (randomInfo) => {
  return {
    type: 'SET_RANDOM',
    randomInfo,
  }
}

export const setUnitPrice = (unitPrice) => {
  return {
    type: 'SET_UNIT_PRICE',
    unitPrice,
  }
}

export const setUnit = (unit) => {
  return {
    type: 'SET_UNIT',
    unit,
  }
}

export const delOrderInfo = () => {
  return {
    type: 'DEL_ORDER_INFO',
  }
}

export const setCheckbox = (data, betNum) => {
  return {
    type: 'SET_CHECKBOX',
    checkbox: data,
    betNum,
  }
}

export const setSelect = (select, betNum) => {
  return {
    type: 'SET_SELECT',
    select,
    betNum,
  }
}

export const setInput = (data) => {
  return {
    type: 'SET_INPUT',
    input: data.input,
    inputRawData: data.inputRawData,
    betNum: data.betNum,
  }
}

export const setPlayId = (playId, odds, playName) => {
  return {
    type: 'SET_PLAY_ID',
    playId,
    odds,
    playName,
  }
}

const setLotteryId = (lotteryId, categoryId) => {
  return {
    type: 'SET_LOTTERY_ID',
    lotteryId,
    categoryId,
  }
}
//--------end orderInfo---------------


//---------start orderList
export const delOrder = (index) => {
  return {
    type: 'DEL_ORDER',
    index,
  }
}

export const createOrder = (rebate, playName, subPlayName, orderInfo) => (dispatch, getState) => {
  const { lotteryInfo } = getState()
  const order = Immutable.fromJS(orderInfo ? orderInfo : getState().orderInfo)
    .set('issue', lotteryInfo.issue)
    .set('rebate', rebate)
    .set('playName', playName)
    .set('subPlayName', subPlayName).toJS()
  dispatch(addOrder([order]))
  dispatch(delOrderInfo())
}

export const addOrder = (orderList) => {
  return {
    type: 'ADD_ORDER',
    orderList,
  }
}

export const clearOrderList = () => {
  return {
    type: 'CLEAR_ORDER_LIST',
  }
}

//---------end orderList



//---------start issueList
const setIssueList = (issueList) => {
  return {
    type: 'SET_ISSUE_LIST',
    issueList,
  }
}


export const removeCurrentIssue = (currentIssue) => (dispatch, getState) => {
  let issueList = getState().issueList
  let index = -1
  for (let i = 0; i < issueList.length; i++) {
    let item = issueList[i]
    if (item.issue_no == currentIssue) {
      index = i
      break
    }
  }

  if (index != -1) {
    dispatch(shiftIssueList(index + 1))
  }
}

const shiftIssueList = (index) => {
  return {
    type: 'SHIFT_ISSUE_LIST',
    index,
  }
}

export const cleanIssueList = () => {
  return {
    type: 'CLEAN_ISSUE_LIST',
  }
}

//---------end issueList



//---------start planList
export const initPlanList = (periods, multiple = 0, interval = 0, intervalMultiple = 0) => (dispatch, getState) => {
  const issueList = getState().issueList
  if (issueList && issueList.length >= periods && issueList[0].issue_no == getState().lotteryInfo.issue) {
    dispatch(setPlanList(issueList.slice(0, periods), multiple, interval, intervalMultiple))
  } else {
    if (getState().planList && getState().planList.length > 0) {
      dispatch(clearPlanList())
    }
    fetchWithOutStatus({act: 10004, lottery_id: getState().orderInfo.lotteryId}).then((res) => {
      if (res) {
        dispatch(setIssueList(res))
        dispatch(setPlanList(res.slice(0, periods), multiple, interval, intervalMultiple))
      }
    }).catch((err) => {
      console.warn(err)
    })
  }
}

const setPlanList = (issueList, multiple, interval, intervalMultiple) => {
  if (interval) {
    for (let i = 0; i < issueList.length; i++) {
      if (i != 0 && (i % interval) == 0) {
        multiple = multiple * intervalMultiple
      }
      issueList[i].multiple = multiple
    }
  } else {
    for (let plan of issueList) {
      plan.multiple = multiple
    }
  }

  return {
    type: 'SET_PLAN_LIST',
    planList: issueList,
  }
}

export const setMultiple = (index, multiple) => {
  return {
    type: 'SET_MULTIPLE',
    index,
    multiple,
  }
}

export const clearPlanList = () => {
  return {
    type: 'CLEAR_PLAN_LIST',
  }
}

//---------end planList


// ---------start sysInfo

export const storeState = (IDNum, password) => {
  return {
    type: 'STORE_LOGIN_STATUS',
    IDNum,
    password,
  }
}

export const changeNetworkStatus = (isConnectedNetWork) => {
  return {
    type: 'CHANGE_NETWORK_STATUS',
    isConnectedNetWork,
  }
}

const defaultHeader = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}


export const getUserInfo = (token, isAuto2LoginPage = true) => (dispatch) => {
  const headers = Object.assign(defaultHeader, { token })
  fetchWithOutStatus({ act: 10034 }, headers, isAuto2LoginPage).then((res) => {
    dispatch(setUserInfo(res))
  })
}

export const setUserInfo = (data) => {
  return {
    type: 'SET_USER_INFO',
    data,
  }
}

export const resetUserInfo = () => {
  return {
    type: 'RESET_USER_INFO',
  }
}

export const setPhoneSettings = (phoneSettings) => {
  return {
    type: 'SET_PHONE_SETTINGS',
    phoneSettings,
  }
}

export const setClientServiceUrl = (data) => {
  return {
    type: 'SET_CLIENT_SERVICE_URL',
    clientServiceUrl: data.help_link ? data.help_link.trim() : '',
    qqLink: data.qq_link ? data.qq_link.trim() : '',
  }
}

export const setSpecialAgent = (isSpecialAgent) => {
  return {
    type: 'SET_SPECIAL_AGENT',
    isSpecialAgent,
  }
}


// ---------end sysInfo

export const clearBet = () => (dispatch) => {
  dispatch(clearOrderList())
  dispatch(delOrderInfo())
}

/*------------------start LHC-----------------------*/

export const setLHCId = (lotteryId) => {
  return {
    type: 'SET_LHC_ID',
    lotteryId,
  }
}


export const ADDLHClistItem = (obj) => (dispatch, getState) => {
  const newObj = Immutable.fromJS(obj).toJS()
  newObj['sendAction']['issue'] = getState().lotteryInfo.issue
  dispatch(pushLHCListItem(newObj))
}

const pushLHCListItem = (obj) => {
  return {
    type: 'ADD_LHC_ListItem',
    obj,
  }
}

export const RemoveLHClistItem = (index, key) => {
  return (key? {
    type: 'REMOVE_LHC_ListItem',
    index,
    key,
  }:{
    type: 'REMOVE_LHC_ListItem',
    index,
  }
  )
}

export const ClearLHClistItem = () => {
  return {
    type: 'CLEAR_LHC_ListItem',
  }
}

/*------------------start LHC-----------------------*/
