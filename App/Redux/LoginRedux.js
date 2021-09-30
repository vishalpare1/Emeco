import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {getCurrentDateTime} from '../Lib/Helpers'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['data'],
  logoutRequest: ['data'],
  requestSuccess: ['payload'],
  requestFailure: ['errorDictionary'],
  resetLoginState: null,
  getUserProfile: ['headers'],
  updateUser: ['data', 'staff_id', 'headers'],
  logoutSuccess: ['payload']
})

export const LoginTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: {
    data: {},
    headers: {}
  },
  error: null,
  errorMsg: null,
  method: null,
  isReset: false,
  passwordLength: 0,
  loginDateTime: ''
})

/* ------------- Selectors ------------- */

export const LoginSelectors = {
  getData: state => state.data,
  isFetching: state => state.fetching
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => {
  let passwordLength = data.password ? data.password.length : state.passwordLength
  return state.merge({fetching: true, error: null, errorMsg: null, data, payload: INITIAL_STATE.payload, passwordLength})
}

// successful api lookup
export const success = (state, action) => {
  const { payload } = action

  let data = state.payload.data.merge(payload.data)
  let headers = state.payload.headers.merge(payload.headers)

  let dataPayload = {data, headers}

  return state.merge({ fetching: false, error: null, payload: dataPayload, loginDateTime: getCurrentDateTime() })
}

// Something went wrong somewhere.
export const failure = (state, { errorDictionary }) => {
  const errorMsg = errorDictionary.error
  const method = errorDictionary.method
  return state.merge({ fetching: false, error: true, errorMsg, method })
}

export const logoutRequest = (state, { data }) => {
  return state.merge({ fetching: true, data, payload: state.payload, isReset: false })
}

export const userRequest = (state) =>
  state.merge({ fetching: true, method: 'get', isReset: false })

export const updateUserRequest = (state, { data }) =>
  state.merge({ fetching: true, method: 'put', data, payload: state.payload, isReset: false })

export const reset = state => state.merge({
  error: null,
  errorMsg: null,
  method: null,
  isReset: true
})

export const logoutSuccess = (state, action) => {
  let data = {email: state.payload.data.email}
  let headers = {}

  const {payload} = action

  let newPayload = {data, headers}

  return state.merge({ fetching: false, payload: newPayload, error: null, errorMsg: null, method: payload.method })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: request,
  [Types.LOGOUT_REQUEST]: logoutRequest,
  [Types.GET_USER_PROFILE]: userRequest,
  [Types.UPDATE_USER]: updateUserRequest,
  [Types.REQUEST_SUCCESS]: success,
  [Types.REQUEST_FAILURE]: failure,
  [Types.RESET_LOGIN_STATE]: reset,
  [Types.LOGOUT_SUCCESS]: logoutSuccess
})
