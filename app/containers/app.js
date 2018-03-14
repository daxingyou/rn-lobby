import React, {Component} from 'react'
import { Platform } from 'react-native'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import devTools from 'remote-redux-devtools'
import rootReducer from '../reducers/index'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { PersistGate } from 'redux-persist/es/integration/react'
import LoadingView from '../components/LoadingView'
import AppWithNavigationState from './appNavigator'

const middlewares = [thunk]

const enhancers = compose(
  applyMiddleware(...middlewares),
  devTools({
      name: Platform.OS,
      hostname: 'localhost',
      port: 5678,
    })
)

let myTransform = createTransform(
  // transform state coming from redux on its way to being serialized and stored
  (state, key) => ({state: state, key: key}),
  // transform state coming from storage, on its way to be rehydrated into redux
  (state, key) => ({state: state, key: key}),
  // configuration options
  {whitelist: ['specialKey']}
)

const config = {
  key: 'root',
  storage,
  transforms: [myTransform],
  blacklist: [
    'playList', 'lotteryInfo', 'orderInfo', 'issueList',
    'planList', 'LHCbetDetails', 'noticeList',
    'nav', 'orderList',
  ],
}

const reducer = persistReducer(config, rootReducer)

function configureStore () {
  let store = createStore(reducer, enhancers)
  let persistor = persistStore(store)

  return { persistor, store }
}

const { persistor, store } = configureStore()

const onBeforeLift = () => {
  // take some action before the gate lifts
}

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<LoadingView />}
          onBeforeLift={onBeforeLift}
          persistor={persistor}>
          <AppWithNavigationState />
        </PersistGate>
      </Provider>
    )
  }
}
