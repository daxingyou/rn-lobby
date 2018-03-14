import Immutable from 'immutable'

const phoneSettings = { sound: false, shake: false, shakeitoff: true }

const phone = (state = { phoneSettings }, action) => {
  switch (action.type) {
    case 'SET_PHONE_SETTINGS':
      return Immutable.fromJS(state).merge({
        phoneSettings: action.phoneSettings,
      }).toJS()
    default:
      return state
  }
}

export default phone
