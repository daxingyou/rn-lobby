import Immutable from 'immutable'

const lotteryList = (state = [], action) => {

  switch (action.type) {
    case 'SET_LOTTERY_LIST':
      return Immutable.fromJS(action.lotteryList).toJS()
    default:
      return state
  }

}

export default lotteryList
