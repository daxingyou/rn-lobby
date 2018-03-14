import Immutable from 'immutable'

const LHCbetDetails = (state = {act:10201, order_list:[]}, action) => {
  let tempState = Immutable.fromJS(state).toJS()
  switch (action.type) {
    case 'SET_LHC_ID':
      tempState.lotteryId = action.lotteryId
      return tempState
    case 'ADD_LHC_ListItem':
      tempState['order_list'].unshift(action.obj.sendAction)
      return tempState
    case 'REMOVE_LHC_ListItem':
      if(action.key) {
        delete tempState['order_list'][action.index]['orders'][action.key]
        if( Object.keys(tempState['order_list'][action.index]['orders']).length === 0 ){
          tempState['order_list'].splice(action.index,1)
        }
      } else {
        tempState['order_list'].splice(action.index,1)
      }
      return tempState
    case 'CLEAR_LHC_ListItem':
      return {act:10201, lotteryId:tempState.lotteryId, order_list:[]}
    default:
      return state
  }
}

export default LHCbetDetails
