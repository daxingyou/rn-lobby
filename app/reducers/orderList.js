import Immutable from 'immutable'

const orderList = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      return Immutable.fromJS(state).unshift(...action.orderList).toJS()
    case 'DEL_ORDER':
      return Immutable.fromJS(state).delete(action.index).toJS()
    case 'CLEAR_ORDER_LIST':
      return []
    default:
      return state
  }
}

export default orderList
