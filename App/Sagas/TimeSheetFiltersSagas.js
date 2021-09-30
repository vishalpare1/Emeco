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

import { call, put, all } from 'redux-saga/effects'
import TimeSheetFiltersActions from '../Redux/TimeSheetFiltersRedux'
import { apiProblemCodes, timeSheetTypes } from '../Lib/Constants'
import LoginActions from '../Redux/LoginRedux'
// import { TimeSheetFiltersSelectors } from '../Redux/TimeSheetFiltersRedux'

export function * getTimeSheetSites (api, action) {
  const { data, headers, timeSheetType } = action
  const response = yield call(api.getTimeSheetSites, headers)

  if (response.ok) {
    const request = {
      'equipment_branch': ''
    }
    var reponseData
    if (timeSheetType === timeSheetTypes.rental) {
      const tasks = yield getTimeSheetTasks(api, request, headers)
      reponseData = {'sites': response.data, 'tasks': tasks, type: timeSheetType}
    }
    yield put(TimeSheetFiltersActions.timeSheetSiteFilterSuccess(reponseData))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure())
  }
}

export function * getTimeSheetFleets (api, action) {
  const { data, headers } = action
  const response = yield call(api.getTimeSheetFleets, data, headers)

  if (response.ok) {
    yield put(TimeSheetFiltersActions.timeSheetFleetFilterSuccess(response.data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure())
  }
}

export function * getTimeSheetWos (api, action) {
  const { data, equipmentBranch, headers } = action
  const response = yield call(api.getTimeSheetWos, data, headers)

  if (response.ok) {
    const request = {
      'equipment_branch': equipmentBranch
    }
    const tasks = yield getTimeSheetTasks(api, request, headers)
    const reponseData = {'tasks': tasks, 'workOrders': response.data.time_sheet_work_orders}
    yield put(TimeSheetFiltersActions.timeSheetWoFilterSuccess(reponseData))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure())
  }
}

export function * getTimeSheetTasks (api, data, headers) {
  const response = yield call(api.getTimeSheetTasks, data, headers)

  if (response.ok) {
    return response.data
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure('error'))
  }
}

export function * getTimeSheetDivisions (api, action) {
  const {headers} = action
  const response = yield call(api.getTimeSheetDivisions, headers)

  if (response.ok) {
    yield put(TimeSheetFiltersActions.timeSheetDivisionFilterSuccess(response.data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure())
  }
}

export function * getTimeSheetJobs (api, action) {
  const { data, headers } = action
  const response = yield call(api.getTimeSheetJobs, data, headers)

  if (response.ok) {
    yield put(TimeSheetFiltersActions.timeSheetJobFilterSuccess(response.data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure())
  }
}

export function * getTimeSheetCostCodes (api, action) {
  const { data, headers } = action
  const response = yield call(api.getTimeSheetCostCodes, data, headers)

  if (response.ok) {
    yield put(TimeSheetFiltersActions.timeSheetCostFilterSuccess(response.data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure())
  }
}

export function * getTimeSheetGlEntry (api, action) {
  const {headers} = action
  const response = yield call(api.getTimeSheetGlEntry, headers)

  if (response.ok) {
    yield put(TimeSheetFiltersActions.timeSheetGlEntryFilterSuccess(response.data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure(apiProblemCodes[response.problem]))
  } else {
    yield put(TimeSheetFiltersActions.timeSheetFiltersFailure('error'))
  }
}
