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
import TimeSheetActions from '../Redux/TimeSheetRedux'
import { apiProblemCodes } from '../Lib/Constants'

export function * getTimeSheets (api, action) {
  const { data, headers } = action
  const response = yield call(api.getTimeSheets, data, headers)

  if (response.ok) {
    const data = {'data': response.data, 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetSuccess(data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  } else {
    const error = response.data.errors ? response.data.errors[0] : (response.data.message || response.data)
    const errorDictionary = {'error': error, 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  }
}

function getErrorFromData(data) {
  console.warn('parse error', data);
  if (!data) {
    return 'Unknown error';
  }
  if (data.errors) {
    return data.errors[0];
  }
  if (data.error) {
    return data.error;
  }
  if (data.message) {
    return data.message;
  }
  return data;
}

export function * postTimeSheet (api, action) {
  const { data } = action.payload
  let isOffline = false
  let response

  if (data) {
    isOffline = data.isOffline
    response = yield call(api.postTimeSheet, data)
  } else {
    isOffline = action.payload.isOffline
    response = yield call(api.postTimeSheet, action.payload)
  }

  if (response.ok) {
    const data = {'data': response.data, 'method': response.config.method, isOffline: isOffline}
    yield put(TimeSheetActions.timeSheetSuccess(data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  } else {
    const errorDictionary = {'error': getErrorFromData(response.data), 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  }
}

export function * putTimeSheet (api, action) {
  let data = action.payload.data
  let isOffline = false
  let response

  if (!data) {
    data = action.payload
  }

  const [deleteTaskResponse] = yield all([
    data.removedTaskIds.map(taskId => {
      return call(api.deleteTask, taskId, data.headers)
    })
  ])

  let deletedAllTasks = deleteTaskResponse.every(function (value, index, array) {
    return value.ok
  })

  if (deletedAllTasks) {
    isOffline = data.isOffline
    response = yield call(api.putTimeSheet, data)

    if (response.ok) {
      const data = {'data': response.data, 'method': response.config.method, isOffline: isOffline}
      yield put(TimeSheetActions.timeSheetSuccess(data))
    } else if (response.problem !== 'CLIENT_ERROR') {
      const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
      yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
    } else {
      const errorDictionary = {'error': getErrorFromData(response.data), 'method': response.config.method}
      yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
    }
  } else {
    const errorDictionary = {'error': 'Tasks could not be deleted successfully', 'method': 'put'}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  }
}

export function * deleteTimeSheet(api, action) {
  let data = action.payload.data || action.payload
  let time_sheet = data && data.time_sheet
  let isOffline = false
  let response

  if (data) {
    isOffline = data.isOffline
    response = yield call(api.deleteTimeSheet, data)
  }

  if (response.ok) {
    // response has no content
    const data = {'data': time_sheet, 'method': response.config.method, isOffline: isOffline}
    yield put(TimeSheetActions.timeSheetSuccess(data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  } else {
    const errorDictionary = {'error': getErrorFromData(response.data), 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  }
}

export function * recallTimeSheet(api, action) {
  let data = action.payload.data
  let isOffline = false
  let response

  if (data) {
    isOffline = data.isOffline
    response = yield call(api.recallTimeSheet, data)
  } else {
    isOffline = action.payload.isOffline
    response = yield call(api.recallTimeSheet, action.payload)
  }

  if (response.ok) {
    const data = {'data': response.data, 'method': response.config.method, isOffline: isOffline}
    yield put(TimeSheetActions.timeSheetSuccess(data))
  } else if (response.problem !== 'CLIENT_ERROR') {
    const errorDictionary = {'error': apiProblemCodes[response.problem], 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  } else {
    const errorDictionary = {'error': getErrorFromData(response.data), 'method': response.config.method}
    yield put(TimeSheetActions.timeSheetFailure(errorDictionary))
  }
}

export function * saveTimeSheet (api, action) {
}
