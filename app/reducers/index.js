import { combineReducers } from 'redux'
import lotteryList from './lotteryList'
import lotteryInfo from './lotteryInfo'
import orderInfo from './orderInfo'
import orderList from './orderList'
import issueList from './issueList'
import planList from './planList'
import sysInfo from './sysInfo'
import LHCbetDetails from './LHCbetDetails'
import activityList from './activityList'
import hotList from './hotList'
import winningList from './winningList'
import noticeList from './noticeList'
import nav from './nav'
import userInfo from './userInfo'
import lotteryMap from './lotteryMap'
import phone from './phone'
import lhcConfig from './lhcConfig'

const rootReducer = combineReducers({
  lotteryList,
  lotteryInfo,
  orderInfo,
  orderList,
  issueList,
  planList,
  sysInfo,
  LHCbetDetails,
  activityList,
  hotList,
  winningList,
  noticeList,
  nav,
  userInfo,
  lotteryMap,
  phone,
  lhcConfig,
})

export default rootReducer
