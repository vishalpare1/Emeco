import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import {
  getUtcDate,
  getDateInFormat,
  lastSyncTime,
  getCurrentDateInFormat,
} from "../Lib/Helpers";
import { timeSheetTypesArray, shiftDayNightArray } from "../Lib/Constants";

import uuid from "react-native-uuid";
import { select } from "redux-saga/effects";

/* ------------- Types and Action Creators ------------- */

export const postTimeSheet = (data) => ({
  type: "POST_TIME_SHEET",
  payload: data,
  meta: {
    retry: true,
  },
});

export const putTimeSheet = (data) => ({
  type: "PUT_TIME_SHEET",
  payload: data,
  meta: {
    retry: true,
  },
});

export const deleteTimeSheet = (data) => ({
  type: "DELETE_TIME_SHEET",
  payload: data,
  meta: {
    retry: true,
  },
});

export const recallTimeSheet = (data) => ({
  type: "RECALL_TIME_SHEET",
  payload: data,
  meta: {
    retry: true,
  },
});

export const saveTimeSheet = (data) => ({
  type: "SAVE_TIME_SHEET",
  payload: data,
});

export const deleteSavedTimeSheet = (data) => ({
  type: "DELETE_SAVED_TIME_SHEET",
  payload: data,
});

const { Types, Creators } = createActions({
  getTimeSheets: ["data", "headers"],
  timeSheetSuccess: ["payload"],
  timeSheetFailure: ["errorDictionary"],
  setOfflineApprovedSheets: ["id"],
  setOfflineSubmittedSheets: ["data"],
  setOfflineCanceledSheets: ["id"],
  setOfflineRecalledSheets: ["id"],
  resetTimesheet: null,
  resetTimesheetError: null,
  resetTimesheetCreation: null,
  resetOfflineSubmittedTimesheets: null,
});

Types.GET_TIME_SHEETS = "GET_TIME_SHEETS";
Types.POST_TIME_SHEET = "POST_TIME_SHEET";
Types.PUT_TIME_SHEET = "PUT_TIME_SHEET";
Types.DELETE_TIME_SHEET = "DELETE_TIME_SHEET";
Types.RECALL_TIME_SHEET = "RECALL_TIME_SHEET";
Types.SAVE_TIME_SHEET = "SAVE_TIME_SHEET";
Types.DELETE_SAVED_TIME_SHEET = "DELETE_SAVED_TIME_SHEET";

export const TimeSheetTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  errorDictionary: null,
  isOffline: false,
  timesheetSite: "",
  timesheetShift: "",
  offlineApprovedTimeSheetIds: [],
  offlineSubmittedTimeSheets: [],
  offlineCanceledTimeSheetIds: [],
  offlineRecalledTimeSheetIds: [],
  savedTimeSheets: [],
  timesheets: [],
  lastGetTime: "",
  getStartTime: "",
  timesheet: null,
});

/* ------------- Selectors ------------- */

export const TimeSheetSelectors = {
  getData: (state) => state.data,
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => {
  return state.merge({
    fetching: true,
    data,
    payload: null,
    needRefresh: false,
    getStartTime: lastSyncTime(),
  });
};

export const setOfflineApprovedSheets = (state, action) => {
  let { id } = action;
  let offlineApprovedTimeSheetIds = state.offlineApprovedTimeSheetIds
    ? state.offlineApprovedTimeSheetIds
    : [];
  if (id) {
    offlineApprovedTimeSheetIds = [id, ...offlineApprovedTimeSheetIds];
  }

  return state.merge({ offlineApprovedTimeSheetIds });
};

export const setOfflineSubmittedSheets = (state, action) => {
  let { data } = action;
  let offlineSubmittedTimeSheets = state.offlineSubmittedTimeSheets
    ? state.offlineSubmittedTimeSheets
    : [];
  if (data) {
    let offlineData = Object.assign({}, data);
    offlineData.time_sheet_type = timeSheetTypesArray[data.time_sheet_type];
    offlineData.submitted_at = getCurrentDateInFormat("Y-MM-DD HH:mm");
    offlineData.status = "pending";
    offlineData.tasks = data.tasks_attributes;
    offlineData.shift = shiftDayNightArray[data.shift];
    offlineData.submittedOfflineSheet = true;
    offlineSubmittedTimeSheets = [offlineData, ...offlineSubmittedTimeSheets];
  }
  return state.merge({ offlineSubmittedTimeSheets });
};

export const setOfflineCanceledSheets = (state, action) => {
  let { id } = action;
  let offlineCanceledTimeSheetIds = state.offlineCanceledTimeSheetIds
    ? state.offlineCanceledTimeSheetIds
    : [];
  if (id) {
    offlineCanceledTimeSheetIds = [id, ...offlineCanceledTimeSheetIds];
  }

  return state.merge({ offlineCanceledTimeSheetIds });
};

export const setOfflineRecalledSheets = (state, action) => {
  let { id } = action;
  let offlineRecalledTimeSheetIds = state.offlineRecalledTimeSheetIds
    ? state.offlineRecalledTimeSheetIds
    : [];
  if (id) {
    offlineRecalledTimeSheetIds = [id, ...offlineRecalledTimeSheetIds];
  }

  return state.merge({ offlineRecalledTimeSheetIds });
};

export const postAndPutTimeSheetRequest = (state, action) => {
  let { data } = action.payload;
  let tempId = null;
  let site = "";
  let shift = "";
  let savedTimeSheets = state.savedTimeSheets;

  if (!data) {
    data = action.payload;
    // NOTE: If there is id then time sheet is being approved, for approving time sheet we will not keep default site and shift.
    if (!data.id) {
      site = data.time_sheet ? data.time_sheet.site : state.timesheetSite;
      shift = data.time_sheet ? data.time_sheet.shift : state.timesheetShift;
    }
  }

  tempId = data.tempId;

  if (tempId) {
    savedTimeSheets = savedTimeSheets ? [...savedTimeSheets] : [];
    savedTimeSheets = savedTimeSheets.filter((ts) => ts.tempId != tempId);
  }

  return state.merge({
    fetching: true,
    data,
    payload: null,
    timesheetSite: site,
    timesheetShift: shift,
    savedTimeSheets,
  });
};

export const deleteTimeSheetRequest = (state, action) => {
  let data = action.payload;
  let site = "";
  let shift = "";

  return state.merge({
    fetching: true,
    data,
    payload: null,
    timesheetSite: site,
    timesheetShift: shift,
  });
};

export const recallTimeSheetRequest = (state, action) => {
  let data = action.payload;
  let site = "";
  let shift = "";

  return state.merge({
    fetching: true,
    data,
    payload: null,
    timesheetSite: site,
    timesheetShift: shift,
  });
};

export const saveTimeSheetRequest = (state, action) => {
  let data = action.payload;
  let timeSheet = {
    ...data?.time_sheet,
    tempId: data.tempId,
  };
  let site = "";
  let shift = "";
  let savedTimeSheets = state.savedTimeSheets
    ? state.savedTimeSheets.asMutable()
    : [];

  if (timeSheet) {
    timeSheet.status = "draft";
    if (!timeSheet.tempId) {
      savedTimeSheets.push({ ...timeSheet, tempId: uuid() });
    } else {
      let index = savedTimeSheets.findIndex(
        (ts) => ts.tempId === timeSheet.tempId
      );
      if (index >= 0) {
        savedTimeSheets[index] = timeSheet;
      } else {
        savedTimeSheets.push(timeSheet);
      }
    }
    if (!timeSheet.id) {
      site = timeSheet.time_sheet
        ? timeSheet.time_sheet.site
        : timeSheet.timesheetSite;
      shift = timeSheet.time_sheet
        ? timeSheet.time_sheet.shift
        : timeSheet.timesheetShift;
    }
  }

  return state.merge({
    fetching: false,
    data,
    payload: null,
    timesheetSite: site,
    timesheetShift: shift,
    savedTimeSheets,
  });
};

export const deleteSavedTimeSheetRequest = (state, action) => {
  let data = action.payload;
  let tempId = data?.time_sheet?.tempId;
  let site = "";
  let shift = "";
  let savedTimeSheets = state.savedTimeSheets ? [...state.savedTimeSheets] : [];

  if (tempId) {
    savedTimeSheets = savedTimeSheets.filter((ts) => ts.tempId != tempId);
  }

  return state.merge({
    fetching: false,
    data,
    payload: null,
    timesheetSite: site,
    timesheetShift: shift,
    savedTimeSheets,
  });
};

// successful api lookup
export const success = (state, action) => {
  const { payload } = action;
  let timesheets = [];
  let needRefresh = false;
  if (Array.isArray(payload.data)) {
    // get all timesheets api is called
    timesheets = payload.data;
  } else if (payload.data.id) {
    needRefresh = true;
    if (payload.data.status === "pending") {
      // user has submitted new time sheet
      timesheets = state.timesheets.asMutable();
      if (payload.data.original_time_sheet_id) {
        timesheets = timesheets.filter(
          (timesheet) => timesheet.id !== payload.data.original_time_sheet_id
        );
      }
      timesheets =
        timesheets && timesheets.length
          ? [payload.data, ...timesheets]
          : [payload.data];
    } else if (payload.data.status === "recalled") {
      // replace recalled timesheet
      timesheets = state.timesheets.asMutable();
      let index = -1;
      for (let i = 0; i < timesheets.length; i++) {
        let ts = timesheets[i];
        if (ts.id === payload.data.id) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        timesheets[index] = payload.data;
      }
    } else if (
      payload.data.status === "approved" ||
      payload.method === "delete"
    ) {
      // remove approved or deleted timesheet
      timesheets = state.timesheets.asMutable();
      timesheets = timesheets.filter(
        (timesheet) => timesheet.id !== payload.data.id
      );
    }
  }

  return state.merge({
    fetching: false,
    error: null,
    errorData: null,
    payload,
    method: payload.method,
    timesheets,
    isOffline: payload.isOffline,
    lastGetTime: state.getStartTime,
    needRefresh,
  });
};

// Something went wrong somewhere.
export const failure = (state, { errorDictionary }) => {
  const errorData = errorDictionary.error;
  const method = errorDictionary.method;
  return state.merge({
    fetching: false,
    error: true,
    errorData,
    method,
    payload: null,
  });
};

export const reset = (state) =>
  state.merge({
    error: false,
    errorData: null,
    payload: null,
    timesheets: [],
    method: null,
    timesheetSite: "",
    timesheetShift: "",
    offlineSubmittedTimeSheets: [],
  });

export const resetTimeSheetCreation = (state) =>
  state.merge({
    error: false,
    errorData: null,
    payload: null,
    method: null,
    isOffline: false,
  });

export const resetTimesheetError = (state) =>
  state.merge({ error: false, errorData: null, payload: null, method: null });

export const resetOfflineSubmittedTimesheets = (state) =>
  state.merge({ offlineSubmittedTimeSheets: [] });

export const completeTransition = (state) => state.set("needRefresh", true);

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_TIME_SHEETS]: request,
  [Types.POST_TIME_SHEET]: postAndPutTimeSheetRequest,
  [Types.PUT_TIME_SHEET]: postAndPutTimeSheetRequest,
  [Types.DELETE_TIME_SHEET]: deleteTimeSheetRequest,
  [Types.RECALL_TIME_SHEET]: recallTimeSheetRequest,
  [Types.SAVE_TIME_SHEET]: saveTimeSheetRequest,
  [Types.DELETE_SAVED_TIME_SHEET]: deleteSavedTimeSheetRequest,
  [Types.SET_OFFLINE_APPROVED_SHEETS]: setOfflineApprovedSheets,
  [Types.SET_OFFLINE_SUBMITTED_SHEETS]: setOfflineSubmittedSheets,
  [Types.TIME_SHEET_SUCCESS]: success,
  [Types.TIME_SHEET_FAILURE]: failure,
  [Types.RESET_TIMESHEET]: reset,
  [Types.RESET_TIMESHEET_ERROR]: resetTimesheetError,
  [Types.RESET_TIMESHEET_CREATION]: resetTimeSheetCreation,
  [Types.RESET_OFFLINE_SUBMITTED_TIMESHEETS]: resetOfflineSubmittedTimesheets,
  ["Navigation/BACK"]: completeTransition,
});
