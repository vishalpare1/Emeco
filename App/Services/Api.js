// a library to wrap and simplify api calls
import apisauce from "apisauce";
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

// 30 second timeout...
const TIMEOUT = 30000;

// our "constructor"

const requestTimeout = (promise, axiosConfig) => {
  const timeout = TIMEOUT;
  const config = { ...axiosConfig };
  const duration = (parseInt(config.timeout, 10) || timeout) + 1000;
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          ok: false,
          problem: "TIMEOUT_ERROR",
          originalError: "REQUEST_TIMEOUT_ERROR",
          data: null,
          status: null,
          headers: null,
          config,
          duration,
        }),
      duration
    )
  );
  return Promise.race([timeoutPromise, promise]);
};

// const create = (baseURL = "http://localhost:3000/api/v1/") => {
const create = (baseURL = 'https://timesheetadmintest.emecogroup.com/api/v1/') => {
  // const create = (baseURL = 'https://timesheetadmin.emecogroup.com/api/v1/') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      "Cache-Control": "no-cache",
    },
    timeout: TIMEOUT,
  });

  const axiosConfig = api.axiosInstance.defaults;
  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const getRoot = () => api.get("");
  const getRate = () => api.get("rate_limit");
  const getUser = (username) => api.get("search/users", { q: username });
  const postLogin = (data) =>
    requestTimeout(api.post("auth/sign_in.json", { ...data }), axiosConfig);
  const postSignup = (data) =>
    requestTimeout(api.post("auth.json", { ...data }), axiosConfig);
  const getTermsAndConditions = () =>
    requestTimeout(api.get("eula/latest.json"), axiosConfig);
  const postResetPassword = (email) =>
    requestTimeout(
      api.post("auth/password.json", { email, redirect_url: "/" }),
      axiosConfig
    );
  const postUpdateDefaultPassword = (data) =>
    requestTimeout(api.get("staffs/79.json", { password: data }), axiosConfig);
  const getPrivacyPolicy = () =>
    requestTimeout(api.get("privacy/latest.json"), axiosConfig);
  const deleteTask = (id, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(api.delete("tasks/" + id), axiosConfig);
  };
  const postTimeSheet = (data) => {
    let apiHeaders = parseHeaders(data.headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(
      api.post("time_sheets.json", {
        original_time_sheet_id: data.original_time_sheet_id,
        time_sheet: data.time_sheet,
      }),
      axiosConfig
    );
  };
  const putTimeSheet = (data) => {
    let apiHeaders = parseHeaders(data.headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(
      api.put("time_sheets/" + data.id, { time_sheet: data.time_sheet }),
      axiosConfig
    );
  };
  const deleteTimeSheet = (data) => {
    let apiHeaders = parseHeaders(data.headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(api.delete("time_sheets/" + data.id), axiosConfig);
  };
  const recallTimeSheet = (data) => {
    let apiHeaders = parseHeaders(data.headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(
      api.put("time_sheets/" + data.id + "/recall"),
      axiosConfig
    );
  };
  const getUserProfile = (headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(api.get("users/current.json"), axiosConfig);
  };
  const putUpdateUser = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(
      api.put("users/current.json", { user: data }),
      axiosConfig
    );
  };
  const getTimeSheets = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);

    let url = "time_sheets.json";

    if (data) {
      url = `${url}?date_range[from]=${data.from}&date_range[to]=${data.to}`;
    }

    return requestTimeout(api.get(url, null, axiosConfig));
  };
  const getTimeSheetSites = (headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);

    return requestTimeout(api.get("time_sheet_sites.json"), axiosConfig);
  };
  const getTimeSheetFleets = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);

    return requestTimeout(
      api.get("time_sheet_equipments.json", { ...data, headers }),
      axiosConfig
    );
  };
  const getTimeSheetWos = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);

    return requestTimeout(
      api.get("time_sheet_work_orders.json", { ...data, headers }),
      axiosConfig
    );
  };
  const getTimeSheetTasks = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);

    return requestTimeout(
      api.get("time_sheet_branch_tasks.json", { ...data, headers }),
      axiosConfig
    );
  };
  const getTimeSheetGlEntry = (headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);

    return requestTimeout(
      api.get("un_billed_time_sheet_gl_codes"),
      axiosConfig
    );
  };
  const getTimeSheetDivisions = (headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(
      api.get("job_cost_time_sheet_divisions.json"),
      axiosConfig
    );
  };
  const getTimeSheetJobs = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(
      api.get("job_cost_time_sheet_job_numbers.json", { ...data, headers }),
      axiosConfig
    );
  };
  const getTimeSheetCostCodes = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);
    return requestTimeout(
      api.get("job_cost_time_sheet_cost_codes.json", { ...data, headers }),
      axiosConfig
    );
  };
  const getManuals = (data, headers) => {
    let apiHeaders = parseHeaders(headers);
    api.setHeaders(apiHeaders);

    let url = "manuals.json";

    return requestTimeout(api.get(url, null, axiosConfig));
  };
  const deleteLogout = (headers) =>
    requestTimeout(
      api.delete("auth/sign_out.json", {}, { headers: parseHeaders(headers) }),
      axiosConfig
    );

  const parseHeaders = (headers) => {
    const apiHeaders = {
      "Content-Type": headers["content-type"],
      "access-token": headers["access-token"],
      client: headers["client"],
      uid: headers["uid"],
      "token-type": headers["token-type"],
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
    };

    return apiHeaders;
  };

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getRoot,
    getRate,
    getUser,
    postLogin,
    postSignup,
    getTermsAndConditions,
    postResetPassword,
    postUpdateDefaultPassword,
    getUserProfile,
    putUpdateUser,
    getPrivacyPolicy,
    getTimeSheets,
    postTimeSheet,
    deleteTask,
    putTimeSheet,
    deleteTimeSheet,
    recallTimeSheet,
    getTimeSheetSites,
    getTimeSheetFleets,
    getTimeSheetWos,
    getTimeSheetTasks,
    getTimeSheetDivisions,
    getTimeSheetJobs,
    getTimeSheetCostCodes,
    getTimeSheetGlEntry,
    getManuals,
    deleteLogout,
  };
};

const api = DebugConfig.useFixtures ? FixtureAPI : create();

// let's return back our create method as the default.
export default {
  api,
  create,
};
