import Immutable from 'immutable'

const hotList = (state = [], action) => {

  switch (action.type) {
    case 'SET_HOT_LIST':
      return Immutable.fromJS(action.data).toJS()
    default:
      return state
  }
}

export default hotList
