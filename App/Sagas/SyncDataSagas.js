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
import SyncDataActions from '../Redux/SyncDataRedux'
import { apiProblemCodes } from '../Lib/Constants'

export function * downloadData (api, action) {
  const {headers} = action

  const request = {
    'equipment_branch': ''
  }

  const timeSheetsResponse = yield call(api.getTimeSheets, null, headers);

  let data = {}

  if (timeSheetsResponse.ok) {
    data['timeSheets'] = timeSheetsResponse.data

    const [sitesResponse, tasksResponse, divisionsResponse, glEntries] = yield all([
      call(api.getTimeSheetSites, headers),
      call(api.getTimeSheetTasks, request, headers),
      call(api.getTimeSheetDivisions, headers),
      call(api.getTimeSheetGlEntry, headers)
    ])

    if (sitesResponse.ok && sitesResponse.data) {
      const rentalData = yield getRentalData(sitesResponse.data, tasksResponse, headers, api)
      if (rentalData) {
        data['rentalData'] = rentalData
      } else {
        return
      }
    } else {
      yield handleFailure(sitesResponse.problem)
      return
    }

    if (divisionsResponse.ok) {
      const jobCostData = yield getJobCostsData(divisionsResponse.data, headers, api)
      if (jobCostData) {
        data['jobCostData'] = jobCostData
      } else {
        return
      }
    } else {
      yield handleFailure(divisionsResponse.problem)
      return
    }

    if (glEntries.ok) {
      data['unBilledData'] = glEntries.data
    } else {
      yield handleFailure(glEntries.problem)
      return
    }
  } else {
    yield handleFailure(timeSheetsResponse.problem)
    return
  }

  yield put(SyncDataActions.downloadDataSuccess(data))
}

export function * getRentalData (sites, tasksResponse, headers, api) {
  const fleetsResponse = yield call(api.getTimeSheetFleets, {}, headers)
  let rentalData = {}

  if (fleetsResponse.ok && fleetsResponse.data) {
    const workOrdersResponse = yield call(api.getTimeSheetWos, {'page': '0'}, headers)

    if (workOrdersResponse.ok && workOrdersResponse.data.time_sheet_work_orders) {
      let allWorkOrders = workOrdersResponse.data && workOrdersResponse.data.time_sheet_work_orders
      let totalPages = workOrdersResponse.data && workOrdersResponse.data.total_pages

      let workOrdersPages = Array.apply(null, Array(totalPages)).map(function (x, i) { return i })

      const [workOrdersForPages] = yield all([
        workOrdersPages.map(page => {
          let pageNumber = page + 1
          if (pageNumber < workOrdersPages.length) {
            return call(api.getTimeSheetWos, {'page': pageNumber.toString()}, headers)
          }
        })
      ])

      workOrdersForPages.forEach((workOrder, index) => {
        if (workOrder && workOrder.ok && workOrder.data.time_sheet_work_orders) {
          allWorkOrders = allWorkOrders.concat(workOrder.data.time_sheet_work_orders)
        }
      })

      if (tasksResponse.ok && tasksResponse.data) {
        rentalData = {
          tasks: tasksResponse.data,
          sites: sites,
          fleets: fleetsResponse.data,
          workOrders: allWorkOrders
        }
      } else {
        yield handleFailure(tasksResponse.problem)
        return
      }
    } else {
      yield handleFailure(workOrdersResponse.problem)
      return
    }
  } else {
    yield handleFailure(fleetsResponse.problem)
    return
  }

  return rentalData
}

export function * getJobCostsData (divisions, headers, api) {
  let jobData = {}

  const jobsResponse = yield call(api.getTimeSheetJobs, {}, headers)

  if (jobsResponse.ok && jobsResponse.data) {
    const costCodesResponse = yield call(api.getTimeSheetCostCodes, {}, headers)

    if (costCodesResponse.ok && costCodesResponse.data) {
      const costCodesForJobs = yield getCostCodesForJobs(costCodesResponse.data)

      jobData = jobsResponse.data.map(job => {
        return {
          ...job,
          costCodes: costCodesForJobs[job.job_number]
        }
      })

    } else {
      yield handleFailure(costCodesResponse.problem)
      return
    }
  } else {
    yield handleFailure(jobsResponse.problem)
    return
  }

  return jobData
}

export function * getCostCodesForJobs (costCodes) {
  let costCodesForJobs = {}

  costCodes.map((costCode, index) => {
    let key = costCode.job_number
    if (costCodesForJobs[key]) {
      let values = costCodesForJobs[key]
      values.push(costCode)
      costCodesForJobs[key] = values
    } else {
      costCodesForJobs[key] = [costCode]
    }
  })

  return costCodesForJobs
}

export function * handleFailure (problem) {
  console.log('failure', problem);
  if (problem !== 'CLIENT_ERROR') {
    let error = apiProblemCodes[problem]
    if (!error) {
      error = 'Request time out'
    }
    yield put(SyncDataActions.downloadDataFailure(error))
  } else {
    yield put(SyncDataActions.downloadDataFailure())
  }
}
