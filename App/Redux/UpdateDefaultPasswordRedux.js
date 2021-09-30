import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  updateDefaultPasswordRequest: ['data', 'staff_id', 'headers'],
  updateDefaultPasswordSuccess: ['payload'],
  updateDefaultPasswordFailure: ['errorMsg'],
  resetChangePasswordState: null
})

export const UpdateDefaultPasswordTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Selectors ------------- */

export const UpdateDefaultPasswordSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => {
  return state.merge({ fetching: true, data, payload: null })
}
// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = (state, { errorMsg }) =>
  state.merge({ fetching: false, error: errorMsg, payload: null })

export const reset = state => state.merge({
  error: null,
	fetching: null,
	payload: null
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_DEFAULT_PASSWORD_REQUEST]: request,
  [Types.UPDATE_DEFAULT_PASSWORD_SUCCESS]: success,
  [Types.UPDATE_DEFAULT_PASSWORD_FAILURE]: failure,
  [Types.RESET_CHANGE_PASSWORD_STATE]: reset
})
