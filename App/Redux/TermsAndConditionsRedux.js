import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getTerms: null,
  termsAndConditionsSuccess: ['payload'],
  termsAndConditionsFailure: ['errorMsg']
})

export const TermsAndConditionsTypes = Types
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

export const TermsAndConditionsSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = state =>
  state.merge({ fetching: true, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = (state, { errorMsg }) =>
  state.merge({ fetching: false, errorMsg, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_TERMS]: request,
  [Types.TERMS_AND_CONDITIONS_SUCCESS]: success,
  [Types.TERMS_AND_CONDITIONS_FAILURE]: failure
})
