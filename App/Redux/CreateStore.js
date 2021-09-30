import { createStore, applyMiddleware, compose } from 'redux'
import Rehydration from '../Services/Rehydration'
import ReduxPersist from '../Config/ReduxPersist'
import Config from '../Config/DebugConfig'
import createSagaMiddleware from 'redux-saga'
import ScreenTracking from './ScreenTrackingMiddleware'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import { createNetworkMiddleware } from 'react-native-offline'
import { TimeSheetTypes } from './TimeSheetRedux'
import logger from 'redux-logger'

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const enhancers = []

  /* ------------- Network Middleware ------------- */

  const networkMiddleware = createNetworkMiddleware({
    actionTypes: [TimeSheetTypes.POST_TIME_SHEET, TimeSheetTypes.PUT_TIME_SHEET, TimeSheetTypes.DELETE_TIME_SHEET, TimeSheetTypes.RECALL_TIME_SHEET],
    queueReleaseThrottle: 250})
  const middleware = [networkMiddleware]

  /* ------------- Navigation Middleware ------------ */
  const navigationMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
  )
  middleware.push(navigationMiddleware)

  /* ------------- Analytics Middleware ------------- */
  middleware.push(ScreenTracking)

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = Config.useReactotron ? console.tron.createSagaMonitor() : null
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  middleware.push(sagaMiddleware)

  /* ------------- logger Middleware ------------- */
  if (__DEV__) {
    middleware.push(logger)
  }

  /* ------------- thunk Middleware ------------- */
  // middleware.push(thunk)

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware))

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore
  const store = createAppropriateStore(rootReducer, compose(...enhancers))

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    Rehydration.updateReducers(store)
  }

  // kick off root saga
  let sagasManager = sagaMiddleware.run(rootSaga)

  return {
    store,
    sagasManager,
    sagaMiddleware,
    networkMiddleware
  }
}
