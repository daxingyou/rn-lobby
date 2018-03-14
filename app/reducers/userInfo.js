import Immutable from 'immutable'

const userInfo = (state = { }, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return Immutable.fromJS(state).merge(action.data).toJS()
    case 'RESET_USER_INFO':
      return {}
    default:
      return state
  }
}

export default userInfo
