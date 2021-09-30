import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { lastSyncTime } from '../Lib/Helpers'
import AsyncStorage from '@react-native-community/async-storage'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  downloadData: ['headers'],
  downloadDataSuccess: (payload) => ({type: 'DOWNLOAD_DATA_SUCCESS', payload, errorMsg: null}),
  downloadDataFailure: ['errorMsg'],
  resetSyncState: null,
  resetSyncFetchState: null,
  resetSyncErrorState: null
})

export const SyncDataTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  lastSyncTime: '',
  syncStartTime: '',
  error: null,
  errorMsg: '',
  downloadedData: null,
  sitesData: null,
  fleetsData: null,
  workOrdersData: null,
  tasksData: null,
  jobCostData: null,
  unBilledData: null,
  timesheetsData: null
})

/* ------------- Selectors ------------- */

export const SyncDataSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => {
  return state.merge({fetching: true, data, payload: null, syncStartTime: lastSyncTime()})
}

export const downloadDataSuccess = (state, action) => {
  const {payload} = action
  let downloadedData = payload
  let rentalData = Object.assign({}, downloadedData.rentalData)
  let sitesData = rentalData.sites
  let fleetsData = rentalData.fleets
  let workOrdersData = rentalData.workOrders
  let tasksData = rentalData.tasks
  let jobCostData = downloadedData.jobCostData
  let unBilledData = downloadedData.unBilledData
  let timesheetsData = downloadedData.timeSheets

	var middle = Math.ceil(workOrdersData.length / 2)
	var firstHalf = workOrdersData.splice(0, middle)
	var secondHalf = workOrdersData.splice(middle)

  AsyncStorage.setItem('workOrdersData1', JSON.stringify(firstHalf))
	AsyncStorage.setItem('workOrdersData2', JSON.stringify(secondHalf))

	//
  // AsyncStorage.setItem('jobCostData', JSON.stringify(jobCostData))
  // AsyncStorage.setItem('unBilledData', JSON.stringify(unBilledData))

  return state.merge({ fetching: false,
    sitesData,
    fleetsData,
    workOrdersData: null,
    tasksData,
    jobCostData,
    unBilledData,
    timesheetsData,
    error: null,
    lastSyncTime: state.syncStartTime
  })
}

// Something went wrong somewhere.
export const failure = (state, {errorMsg}) => {
  return state.merge({ fetching: false, error: true, errorMsg, payload: null })
}

export const networkChange = (state, action) => {
  return state.merge({ fetching: action.payload })
}

export const reset = state => state.merge({error: null, errorMsg: null, lastSyncTime: '', downloadedData: {}, fetching: false})

export const resetError = state => state.merge({error: null, errorMsg: null})

export const resetSyncFetchState = state => state.merge({fetching: false})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.DOWNLOAD_DATA]: request,
  [Types.DOWNLOAD_DATA_SUCCESS]: downloadDataSuccess,
  [Types.DOWNLOAD_DATA_FAILURE]: failure,
  [Types.RESET_SYNC_STATE]: reset,
  [Types.RESET_SYNC_FETCH_STATE]: resetSyncFetchState,
  [Types.RESET_SYNC_ERROR_STATE]: resetError
})
