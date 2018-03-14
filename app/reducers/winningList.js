import Immutable from 'immutable'

const winningList = (state = [], action) => {

  switch (action.type) {
    case 'SET_WINNING_LIST':
      return Immutable.fromJS(action.data).toJS()
    default:
      return state
  }
}

export default winningList
