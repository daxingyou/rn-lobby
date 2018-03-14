import Immutable from 'immutable'

const lotteryMap = (state = {}, action) => {
  const newState = Immutable.fromJS(state).toJS()
  switch (action.type) {
    case 'SET_LOTTERY_MAP':
      newState[action.lotteryId] = action.playList
      return newState
    default:
      return state
  }
}

export default lotteryMap
