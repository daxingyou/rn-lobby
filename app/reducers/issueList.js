import Immutable from 'immutable'

const issueList = (state = [], action) => {
  switch (action.type) {
    case 'SET_ISSUE_LIST':
      return Immutable.fromJS(action.issueList).toJS()
    case 'SHIFT_ISSUE_LIST':
      return Immutable.fromJS(state).toJS().slice(action.index)
    case 'CLEAN_ISSUE_LIST':
      return []
    default:
      return state
  }
}

export default issueList
