import Immutable from 'immutable'
import { getTotal } from '../utils'

const orderInfo = (state = {}, action) => {
  switch (action.type) {
    case 'SET_RANDOM':
      return Immutable.fromJS(state).merge({
        checkbox: action.randomInfo.checkbox,
        input: action.randomInfo.input,
        inputRawData: action.randomInfo.input.join(' '),
        select: action.randomInfo.select,
        betNum: action.randomInfo.betNum,
        totalPrice: getTotal(state.unit, action.randomInfo.betNum, state.unitPrice),
      }).toJS()
    case 'SET_CHECKBOX':
      return Immutable.fromJS(state).merge({
        checkbox: action.checkbox,
        betNum: action.betNum,
        totalPrice: getTotal(state.unit, action.betNum, state.unitPrice),
      }).toJS()
    case 'SET_SELECT':
      return Immutable.fromJS(state).merge({
        select: action.select,
        betNum: action.betNum,
        totalPrice: getTotal(state.unit, action.betNum, state.unitPrice),
      }).toJS()
    case 'SET_INPUT':
      return Immutable.fromJS(state).merge({
        input: action.input,
        inputRawData: action.inputRawData,
        betNum: action.betNum,
        totalPrice: getTotal(state.unit, action.betNum, state.unitPrice),
      }).toJS()
    case 'SET_LOTTERY_ID':
      return Immutable.fromJS(state).merge({
        lotteryId: action.lotteryId,
        categoryId: action.categoryId,
      }).toJS()
    case 'SET_PLAY_ID':
      return Immutable.fromJS(state).merge({
        playId: action.playId,
        playName: action.playName,
        odds: action.odds,
        select: {},
        checkbox: [],
        input: [],
        inputRawData: '',
        betNum: 0,
        totalPrice: 0,
        unit: 'yuan',
        unitPrice: 2,
      }).toJS()
    case 'SET_UNIT':
      return Immutable.fromJS(state).merge({
        unit: action.unit,
        totalPrice: getTotal(action.unit, state.betNum, state.unitPrice),
      }).toJS()
    case 'SET_UNIT_PRICE':
      return Immutable.fromJS(state).merge({
        unitPrice: action.unitPrice,
        totalPrice: getTotal(state.unit, state.betNum, action.unitPrice),
      }).toJS()
    case 'DEL_ORDER_INFO':
      return Immutable.fromJS(state).merge({
        select: {},
        checkbox: [],
        input: [],
        inputRawData: '',
        betNum: 0,
        totalPrice: 0,
      }).toJS()
    default:
      return state
  }
}

export default orderInfo
