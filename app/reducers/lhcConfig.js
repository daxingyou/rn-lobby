const lhcConfig = (state = {}, action) => {
  switch (action.type) {
    case 'SET_LHC_CONFIG':
      return action.config
    default:
      return state
  }
}

export default lhcConfig
