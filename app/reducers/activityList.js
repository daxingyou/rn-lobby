import Immutable from 'immutable'

const activityList = (state = [], action) => {

  switch (action.type) {
    case 'SET_ACTIVITY_LIST':
      return Immutable.fromJS(action.data).toJS()
    default:
      return state
  }
}

export default activityList
