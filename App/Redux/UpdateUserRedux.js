import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  updateUserRequest: ['data', 'staff_id', 'headers'],
  updateUserSuccess: ['payload'],
  updateUserFailure: ['errorMsg']
})

export const UpdateUserTypes = Types
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

export const UpdateUserSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data, staff_id, headers }) =>
  state.merge({ fetching: true, data, staff_id, headers, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = (state, { errorMsg }) =>
  state.merge({ fetching: false, error: true, errorMsg, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_USER_REQUEST]: request,
  [Types.UPDATE_USER_SUCCESS]: success,
  [Types.UPDATE_USER_FAILURE]: failure
})
