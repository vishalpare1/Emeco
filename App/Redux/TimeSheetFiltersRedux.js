import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { timeSheetTypes } from '../Lib/Constants'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getTimeSheetSites: ['headers', 'timeSheetType'],
  getTimeSheetFleets: ['data', 'headers'],
  getTimeSheetWos: ['data', 'headers', 'equipmentBranch'],
  getTimeSheetTasks: ['data', 'headers'],
  getTimeSheetDivisions: ['headers'],
  getTimeSheetJobs: ['data', 'headers'],
  getTimeSheetCostCodes: ['data', 'headers'],
  getTimeSheetGlEntry: ['headers'],
  timeSheetSiteFilterSuccess: ['payload'],
  timeSheetFleetFilterSuccess: ['payload'],
  timeSheetWoFilterSuccess: ['payload'],
  timeSheetTasksFilterSuccess: ['payload'],
  timeSheetDivisionFilterSuccess: ['payload'],
  timeSheetJobFilterSuccess: ['payload'],
  timeSheetCostFilterSuccess: ['payload'],
  timeSheetGlEntryFilterSuccess: ['payload'],
  timeSheetFiltersFailure: ['errorMsg'],
  resetFilters: null
})

export const TimeSheetFiltersTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  filterType: '',
  sites: [],
  fleets: [],
  workOrders: [],
  tasks: [],
  divisions: [],
  jobs: [],
  costCodes: [],
  glEntries: [],
  error: null,
  errorMsg: ''
})

/* ------------- Selectors ------------- */

export const TimeSheetFiltersSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => {
  return state.merge({fetching: true, data, payload: null})
}

// successful api lookup
export const siteSuccess = (state, action) => {
  const {payload} = action
  const sites = payload.sites

  const tasks = payload.tasks
  return state.merge({fetching: false, error: null, sites: sites, payload: sites, tasks: tasks, filterType: 'site'})
}

export const fleetSuccess = (state, action) => {
  const { payload } = action
  let fleets = payload
  return state.merge({ fetching: false, error: null, fleets, payload, filterType: 'fleet' })
}

export const woSuccess = (state, action) => {
  const { payload } = action
  const workOrders = payload.workOrders
  const tasks = payload.tasks
  return state.merge({ fetching: false, error: null, workOrders, tasks, payload, filterType: 'wo' })
}

export const tasksSuccess = (state, action) => {
  const { payload } = action
  let tasks = payload
  return state.merge({ fetching: false, error: null, tasks, payload, filterType: 'task' })
}

export const divisionSuccess = (state, action) => {
  const { payload } = action
  let divisions = payload
  return state.merge({ fetching: false, error: null, divisions, payload, filterType: 'division' })
}
export const jobSuccess = (state, action) => {
  const { payload } = action
  let jobs = payload
  return state.merge({ fetching: false, error: null, jobs, payload, filterType: 'job' })
}
export const costCodeSuccess = (state, action) => {
  const { payload } = action
  let costCodes = payload
  return state.merge({ fetching: false, error: null, costCodes, payload, filterType: 'costCode' })
}

export const glEntrySuccess = (state, action) => {
  const { payload } = action
  let glEntries = payload
  return state.merge({ fetching: false, error: null, glEntries, payload, filterType: 'glEntry' })
}

// Something went wrong somewhere.
export const failure = (state, {errorMsg}) => {
  return state.merge({ fetching: false, error: true, errorMsg, payload: null })
}

export const reset = state =>
  state.merge({ errorMsg: '', payload: null, fetching: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_TIME_SHEET_SITES]: request,
  [Types.GET_TIME_SHEET_FLEETS]: request,
  [Types.GET_TIME_SHEET_WOS]: request,
  [Types.GET_TIME_SHEET_TASKS]: request,
  [Types.GET_TIME_SHEET_DIVISIONS]: request,
  [Types.GET_TIME_SHEET_JOBS]: request,
  [Types.GET_TIME_SHEET_COST_CODES]: request,
  [Types.GET_TIME_SHEET_GL_ENTRY]: request,
  [Types.TIME_SHEET_SITE_FILTER_SUCCESS]: siteSuccess,
  [Types.TIME_SHEET_FLEET_FILTER_SUCCESS]: fleetSuccess,
  [Types.TIME_SHEET_WO_FILTER_SUCCESS]: woSuccess,
  [Types.TIME_SHEET_TASKS_FILTER_SUCCESS]: tasksSuccess,
  [Types.TIME_SHEET_DIVISION_FILTER_SUCCESS]: divisionSuccess,
  [Types.TIME_SHEET_JOB_FILTER_SUCCESS]: jobSuccess,
  [Types.TIME_SHEET_COST_FILTER_SUCCESS]: costCodeSuccess,
  [Types.TIME_SHEET_GL_ENTRY_FILTER_SUCCESS]: glEntrySuccess,
  [Types.TIME_SHEET_FILTERS_FAILURE]: failure,
  [Types.RESET_FILTERS]: reset
})
