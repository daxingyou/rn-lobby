import Immutable from 'immutable'

const sysInfo = (state = { }, action) => {
  switch (action.type) {
    case 'STORE_LOGIN_STATUS':
      return Immutable.fromJS(state).merge({
        IDNum: action.IDNum,
        password: action.password,
      }).toJS()
    case 'CHANGE_NETWORK_STATUS':
      return Immutable.fromJS(state).merge({
        isConnectedNetWork: action.isConnectedNetWork,
      }).toJS()
    case 'SET_NETEORK_DALAY':
      return Immutable.fromJS(state).merge({
        delay: action.delay,
        timeDifference: action.timeDifference,
      }).toJS()
    case 'SET_CLIENT_SERVICE_URL':
      return Immutable.fromJS(state).merge({
        clientServiceUrl: action.clientServiceUrl,
        qqLink: action.qqLink,
      }).toJS()
    case 'SET_SPECIAL_AGENT':
      return Immutable.fromJS(state).merge({
        isSpecialAgent: action.isSpecialAgent,
      }).toJS()
    case 'SET_NAV_NAME':
      return Immutable.fromJS(state).merge({
        navName: action.navName,
      }).toJS()
    case 'SET_TAB_NAME':
      return Immutable.fromJS(state).merge({
        tabName: action.tabName,
      }).toJS()
    case 'SET_ADVERT_IMG':
      return Immutable.fromJS(state).merge({
        advertImg: action.img,
      }).toJS()
    default:
      return state
  }
}

export default sysInfo


/**
userInfo:
user_name,
account_balance,
realname,
funds_pwd_status,
user_bank_status,
withdraw_amount
**/
