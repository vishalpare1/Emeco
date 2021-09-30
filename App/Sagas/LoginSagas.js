/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put, select } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
import { apiProblemCodes } from '../Lib/Constants'
import TimeSheetActions from '../Redux/TimeSheetRedux'
// import { LoginSelectors } from '../Redux/LoginRedux'

export function * postLogin (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(LoginSelectors.getData)
  // make the call to the api
  const response = yield call(api.postLogin, data)
  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    const data = {data: response.data.data, headers: response.headers}
    yield put(LoginActions.requestSuccess(data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
    yield put(LoginActions.requestFailure(errorDictionary))
  } else {
    const errorDictionary = {'error': response.data.errors[0], 'method': response.config.method}
    yield put(LoginActions.requestFailure(errorDictionary))
  }
}

export function * getUserProfile (api, action) {
  const { headers } = action
  const response = yield call(api.getUserProfile, headers)

  if (response.ok) {
    const data = {data: response.data, headers: response.headers}

    yield put(LoginActions.requestSuccess(data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
    yield put(LoginActions.requestFailure(errorDictionary))
  } else {
    const error = response.data.errors && response.data.errors.length === 1 ? response.data.errors[0] : response.data.message
    const errorDictionary = {'error': error, 'method': response.config.method}
    yield put(LoginActions.requestFailure(errorDictionary))
  }
}

export function * deleteLogout (api, action) {
  const { data } = action
  const response = yield call(api.deleteLogout, data)
  if (response.ok) {
    const responseDictionary = {'data': response.data, 'method': response.config.method}
    yield put(LoginActions.logoutSuccess(responseDictionary))
  } else {
    if (response.problem !== 'CLIENT_ERROR') {
      console.warn('ERROR', apiProblemCodes[response.problem])
    } else {
      const error = response.data.errors && response.data.errors.length === 1 ? response.data.errors[0] : response.data.message
      console.warn('ERROR', error)
    }
    const loginState = yield select((state) => state.login)
    const responseDictionary = {'data': {'email': loginState.data.uid}, 'method': response.config.method}
    yield put(LoginActions.logoutSuccess(responseDictionary))
  }
}

export function * putUpdateUser (api, action) {
  const { data, headers } = action
  const response = yield call(api.putUpdateUser, data, headers)

  if (response.ok) {
    const data = {data: response.data, headers: response.headers}

    yield put(LoginActions.requestSuccess(data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
    yield put(LoginActions.requestFailure(errorDictionary))
  } else {
    const error = response.data.errors && response.data.errors.length === 1 ? response.data.errors[0] : response.data.message
    const errorDictionary = {'error': error, 'method': response.config.method}
    yield put(LoginActions.requestFailure(errorDictionary))
  }
}
