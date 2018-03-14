import Immutable from 'immutable'

const lotteryInfo = (state = {}, action) => {

  switch (action.type) {
    case 'SET_COUNTDOWN':
      return Immutable.fromJS(state).merge({
        issue: action.issue,
        delay: action.delay,
        endTime: action.endTime,
        nowTime: action.nowTime,
        startTime: action.startTime,
        timeDifference: action.timeDifference,
      }).toJS()
    case 'RESET_COUNTDOWN':
      return Immutable.fromJS(state).merge({
        issue: '00000000',
        delay: 0,
        endTime: 0,
        nowTime: 0,
        startTime: 0,
        timeDifference: 0,
        lotteryRecord: [],
      }).toJS()
    case 'SET_LOTTERY_RECORD':
      return Immutable.fromJS(state).merge({
        lotteryRecord: action.lotteryRecord,
      }).toJS()
    default:
      return state
  }

}

export default lotteryInfo
