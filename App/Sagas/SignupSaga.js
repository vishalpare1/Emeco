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

import { call, put } from 'redux-saga/effects'
import SignupActions from '../Redux/SignupRedux'
import { apiProblemCodes } from '../Lib/Constants'
import TimeSheetActions from '../Redux/TimeSheetRedux'
import LoginActions from '../Redux/LoginRedux'
// import { SignupSelectors } from '../Redux/SignupRedux'

export function * postSignup (api, action) {
  const { data } = action
  // get current data from Store
  // const currentData = yield select(SignupSelectors.getData)
  // make the call to the api
  const response = yield call(api.postSignup, data)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(SignupActions.signupSuccess(response.data.status))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(SignupActions.signupFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(SignupActions.signupFailure(response.data.errors.full_messages[0]))
  }
}
