import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  resetPasswordRequest: ['data'],
  resetPasswordSuccess: ['payload'],
  resetPasswordFailure: ['errorMsg']
})

export const ResetPasswordTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const ResetPasswordSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, error: null, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = (state, { errorMsg }) =>
  state.merge({ fetching: false, error: errorMsg, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESET_PASSWORD_REQUEST]: request,
  [Types.RESET_PASSWORD_SUCCESS]: success,
  [Types.RESET_PASSWORD_FAILURE]: failure
})
