import { takeLatest, all, fork } from 'redux-saga/effects'
import API from '../Services/Api'
import { networkSaga } from 'react-native-offline'

/* ------------- Types ------------- */

import { ResetPasswordTypes } from '../Redux/ResetPasswordRedux'
import { UpdateDefaultPasswordTypes } from '../Redux/UpdateDefaultPasswordRedux'
import { LoginTypes } from '../Redux/LoginRedux'
import { SignupTypes } from '../Redux/SignupRedux'
import { TermsAndConditionsTypes } from '../Redux/TermsAndConditionsRedux'

import { PrivacyPolicyTypes } from '../Redux/PrivacyPolicyRedux'
import { TimeSheetTypes } from '../Redux/TimeSheetRedux'
import { TimeSheetFiltersTypes } from '../Redux/TimeSheetFiltersRedux'
import { SyncDataTypes } from '../Redux/SyncDataRedux'
/* ------------- Sagas ------------- */

import { postResetPassword } from './ResetPasswordSagas'
import { getUpdateDefaultPassword } from './UpdateDefaultPasswordSagas'
import { postLogin, getUserProfile, putUpdateUser, deleteLogout } from './LoginSagas'
import { postSignup } from './SignupSaga'
import { getTermsAndConditions } from './TermsAndConditionsSagas'
import { getPrivacyPolicy } from './PrivacyPolicySagas'
import { getTimeSheets, postTimeSheet, putTimeSheet, deleteTimeSheet, recallTimeSheet, saveTimeSheet } from './TimeSheetSagas'
import { downloadData } from './SyncDataSagas'
import { getTimeSheetSites, getTimeSheetFleets, getTimeSheetWos, getTimeSheetTasks,
 getTimeSheetDivisions, getTimeSheetJobs, getTimeSheetCostCodes, getTimeSheetGlEntry} from './TimeSheetFiltersSagas'
/* ------------- API ------------- */

// NOTE: The API we use is only used from Sagas, so we create it here and pass along to the sagas which need it.
const api = API.api;

/* ------------- Connect Types To Sagas ------------- */

export default function * rootSaga () {
  yield all([
    fork(networkSaga, {pingInterval: 30000}), // NOTE: This will check for network connection every 30 seconds
    yield takeLatest(LoginTypes.LOGIN_REQUEST, postLogin, api),
    yield takeLatest(SignupTypes.SIGNUP_REQUEST, postSignup, api),
    yield takeLatest(TermsAndConditionsTypes.GET_TERMS, getTermsAndConditions, api),
    yield takeLatest(ResetPasswordTypes.RESET_PASSWORD_REQUEST, postResetPassword, api),
    yield takeLatest(UpdateDefaultPasswordTypes.UPDATE_DEFAULT_PASSWORD_REQUEST, getUpdateDefaultPassword, api),
    yield takeLatest(PrivacyPolicyTypes.GET_PRIVACY_POLICY, getPrivacyPolicy, api),
    yield takeLatest(LoginTypes.GET_USER_PROFILE, getUserProfile, api),
    yield takeLatest(LoginTypes.UPDATE_USER, putUpdateUser, api),
    yield takeLatest(TimeSheetTypes.GET_TIME_SHEETS, getTimeSheets, api),
    yield takeLatest(TimeSheetTypes.POST_TIME_SHEET, postTimeSheet, api),
    yield takeLatest(TimeSheetTypes.PUT_TIME_SHEET, putTimeSheet, api),
    yield takeLatest(TimeSheetTypes.DELETE_TIME_SHEET, deleteTimeSheet, api),
    yield takeLatest(TimeSheetTypes.RECALL_TIME_SHEET, recallTimeSheet, api),
    yield takeLatest(TimeSheetTypes.SAVE_TIME_SHEET, saveTimeSheet, api),
    yield takeLatest(LoginTypes.LOGOUT_REQUEST, deleteLogout, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_SITES, getTimeSheetSites, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_FLEETS, getTimeSheetFleets, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_WOS, getTimeSheetWos, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_TASKS, getTimeSheetTasks, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_DIVISIONS, getTimeSheetDivisions, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_JOBS, getTimeSheetJobs, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_COST_CODES, getTimeSheetCostCodes, api),
    yield takeLatest(TimeSheetFiltersTypes.GET_TIME_SHEET_GL_ENTRY, getTimeSheetGlEntry, api),
    yield takeLatest(SyncDataTypes.DOWNLOAD_DATA, downloadData, api)
  ])
}
