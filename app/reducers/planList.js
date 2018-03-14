import Immutable from 'immutable'

const planList = (state = [], action) => {

  switch (action.type) {
    case 'SET_PLAN_LIST':
      return Immutable.fromJS(action.planList).toJS()
    case 'SET_MULTIPLE':
      return Immutable.fromJS(state).update(action.index, (item) => {
        return item.set('multiple', action.multiple)
      }).toJS()
    case 'CLEAR_PLAN_LIST':
      return []
    default:
      return state
  }

}

export default planList
