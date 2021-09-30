import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signupRequest: ['data'],
  signupSuccess: ['payload'],
  signupFailure: ['errorMsg']
})

export const SignupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  errorMsg: null
})

/* ------------- Selectors ------------- */

export const SignupSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, error: null, errorMsg: null, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, errorMsg: null, payload })
}

// Something went wrong somewhere.
export const failure = (state, {errorMsg}) =>
  state.merge({fetching: false, error: true, errorMsg, payload: null})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGNUP_REQUEST]: request,
  [Types.SIGNUP_SUCCESS]: success,
  [Types.SIGNUP_FAILURE]: failure
})
