import Immutable from 'immutable'
import AppNavigator from '../routes'
import { NavigationActions } from 'react-navigation'


const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Splash'))

const resetState = (state) => {
  let newState =  Immutable.fromJS(state).toJS()
  const topIndex = newState.index
  const tabIndex = newState.routes[topIndex].index
  let curSubTarRoutes = newState.routes[topIndex].routes[tabIndex].routes
  newState.routes[topIndex].routes[tabIndex].routes = curSubTarRoutes.slice(0, 1)
  newState.routes[topIndex].routes[tabIndex].index = 0
  return newState
}

const lobbyPcdd = (state, Booleans) => {
  let newState =  Immutable.fromJS(state).toJS()
  const topIndex = newState.index
  newState.routes[topIndex].index = 1
  newState.routes[topIndex].routes[1].routes[0].params = { categoryId: Booleans ? 6 : null }
  return newState
}

const lobbyCenter = (state) => {
  let newState =  Immutable.fromJS(state).toJS()
  const topIndex = newState.index
  newState.routes[topIndex].index = 1
  newState.routes[topIndex].routes[0].index = 0
  newState.routes[topIndex].routes[0].routes = newState.routes[topIndex].routes[0].routes.slice(0, 1)
  newState.routes[topIndex].routes[1].index = 0
  newState.routes[topIndex].routes[1].routes = newState.routes[topIndex].routes[1].routes.slice(0, 1)
  newState.routes[topIndex].routes[2].index = 0
  newState.routes[topIndex].routes[2].routes = newState.routes[topIndex].routes[2].routes.slice(0, 1)
  newState.routes[topIndex].routes[3].index = 0
  newState.routes[topIndex].routes[3].routes = newState.routes[topIndex].routes[3].routes.slice(0, 1)
  newState.routes[topIndex].routes[4].index = 0
  newState.routes[topIndex].routes[4].routes = newState.routes[topIndex].routes[4].routes.slice(0, 1)
  return newState

}

const getCurrentRouteName = (state) => {
  const route = state.routes[state.index]
  return typeof route.index === 'undefined' ? route.routeName : getCurrentRouteName(route)
}

const nav = (state = initialState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state)

  switch (action.type) {
    case 'RESET_NAV': //到tab顶层
      return resetState(state)
    case 'LOBBY_PCDD':
      return lobbyPcdd(state, true)
    case 'LOBBY_PCDDUN':
      return lobbyPcdd(state, false)
    case 'LOBBY_CENTER':
      return lobbyCenter(state)
    case 'GO_BACK':
      return AppNavigator.router.getStateForAction(  //  getStateForAction: 根据给定的action来定义返回的navigation sate
        NavigationActions.back(),   // action  返回上一屏幕并关闭当前屏幕
        state                       // state
      )
    default:
      // prevents navigating twice to the same route
      if (state && nextState) {
        const stateRouteName = getCurrentRouteName(state)
        const nextStateRouteName = getCurrentRouteName(nextState)
        return stateRouteName === nextStateRouteName ? state : nextState
      }
      // Simply return the original `state` if `nextState` is null or undefined.
      return nextState || state
  }
}

export default nav
