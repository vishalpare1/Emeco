import React, { Component } from "react";
import {
  Image,
  ScrollView,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
  Alert,
  Platform,
  Animated,
  Easing,
  AppState,
} from "react-native";
import { connect } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import styles from "./Styles/TimesheetsListScreenStyle";
import SplashScreen from "react-native-splash-screen";
import images from "../Themes/Images";
import { Dropdown } from "react-native-material-dropdown";
import TimeSheetActions from "../Redux/TimeSheetRedux";
import Loader from "../Components/Loader";
import {
  getCurrentDateTime,
  getDateInFormat,
  isGreater,
  isLessThan,
  isSameTime,
  lastSyncTime,
  secondsDifference,
  getLastMonthDate,
} from "../Lib/Helpers";
import LoginActions from "../Redux/LoginRedux";
import SyncDataActions from "../Redux/SyncDataRedux";
import DatePicker from "react-native-datepicker";
import { Images, ApplicationStyles } from "../Themes";
import { timeSheetTypes } from "../Lib/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions } from "react-navigation";
import { asMutable, isImmutable } from "seamless-immutable";
import moment from "moment";
import { StyleSheet } from "react-native";
import CalendarDatePicker from "../Components/CalenderDatePicker";

let isRefreshing = false;
let syncTimer;
let syncTimeOut;
let logoutTimer;
const ROTATION_DURATION = 5000;
const AUTO_SYNC_INTERVAL = 3600000;
const SYNC_DATE_FORMAT = "hh:mm a DD MMM YYYY";
const CURRENT_TIME_FORMAT = "MMMM Do YYYY HH:mm";
const FILTER_DATE_FORMAT = "DD MMM YYYY";

function sortTimeSheet(defaultName) {
  return (a, b) => {
    let order = (a.staff ?? defaultName)?.localeCompare?.(
      b.staff ?? defaultName
    );
    if (order && order !== 0) {
      return order;
    } else {
      return moment(a.start_date, "Y-MM-DD") - moment(b.start_date, "Y-MM-DD");
    }
  };
}
class TimesheetsListScreen extends Component {
  alertPresent = false;
  alerts = [];

  constructor(props) {
    super(props);

    this.rotateValueHolder = new Animated.Value(0);

    const today = new Date(2021, 8, 31);
    const currentDate = getDateInFormat(today, "DD MMM YYYY");

    const loginDateTime = props.navigation.getParam("loginDateTime");
    let currentDateTime = getCurrentDateTime();

    this.state = {
      loggedOut: false,
      deprecatedTnCs: false,
      appState: AppState.currentState,
      freshLaunch: true,
      inactiveToActive: false,
      syncStarted: false,
      movedToTnCs: false,
      timePassed: false,
      fetching: false,
      fetchingOfflineTimesheets: false,
      syncingData: false,
      isSupervisor: false,
      filterDate: currentDate,
      filterDates: {
        startingDay: null,
        endingDay: null,
      },
      clearFilter: true,
      allSynced: true,
      timesheets: [],
      shouldSync: isSameTime(
        loginDateTime,
        currentDateTime,
        CURRENT_TIME_FORMAT
      ),
      profile: [
        {
          value: "Profile",
          icon: Images.profileIcon,
        },
        {
          value: "Manuals",
          icon: Images.documentIcon,
        },
        {
          value: "Logout",
          icon: Images.logoutIcon,
        },
      ],

      timesheetTypes: [
        {
          value: "Rental",
        },
        {
          value: "Job Cost",
        },
        {
          value: "Unbilled",
        },
      ],
      calendarVisible: false,
    };

    this.shouldApplyFilter = false;
  }

  componentDidMount() {
    SplashScreen.hide();

    AppState.addEventListener("change", this._handleAppStateChange);

    this.props.resetSyncFetchState();

    this._refreshTimesheets();

    let currentTime = lastSyncTime();

    if (this.props.lastSyncTime.length) {
      if (
        secondsDifference(
          currentTime,
          this.props.lastSyncTime,
          SYNC_DATE_FORMAT
        ) >= AUTO_SYNC_INTERVAL
      ) {
        this.syncData();
      } else {
        if (!this.syncTimer) {
          let timoutInterval =
            AUTO_SYNC_INTERVAL -
            secondsDifference(
              currentTime,
              this.props.lastSyncTime,
              SYNC_DATE_FORMAT
            );
          this.syncTimeOut = setTimeout(() => this.syncData(), timoutInterval);
        }
      }
    }
  }

  getTimeSheets = (
    startingDay = this.state.filterDates.startingDay,
    endingDay = this.state.filterDates.endingDay
  ) => {
    let data = null;
    const headers = this.props.response.headers;
    if (startingDay && endingDay) {
      data = { from: startingDay, to: endingDay };
    }
    return this.props.getTimeSheets(data, headers);
  };

  _refreshTimesheets = () => {
    this.getTimeSheets();
  };

  _handleAppStateChange = (nextAppState) => {
    let freshLaunch = false;
    let inactiveToActive = false;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      inactiveToActive = true;
    } else if (this.state.appState === "unknown") {
      freshLaunch = true;
    }
    this.setState({ appState: nextAppState, freshLaunch, inactiveToActive });
  };

  startImageRotateFunction() {
    this.rotateValueHolder.setValue(0);
    Animated.timing(this.rotateValueHolder, {
      toValue: 1,
      duration: ROTATION_DURATION,
      easing: Easing.linear,
    }).start(() => {
      this.startImageRotateFunction();
    });
  }

  stopImageRotateFunction() {
    this.rotateValueHolder.setValue(0);
  }

  showNextAlert() {
    if (this.alerts.length > 0) {
      let alert = this.alerts.splice(0, 1)[0];
      this.showAlert(alert.message, alert.handler);
    }
  }

  showAlert(message, handler) {
    if (this.alertPresent) {
      if (this.alerts.findIndex((alert) => alert.message === message) < 0) {
        this.alerts.push({ message, handler });
      }
      return;
    }
    this.alertPresent = true;
    Alert.alert(
      "",
      message,
      [
        {
          text: "OK",
          onPress: () => {
            this.alertPresent = false;
            if (typeof handler === "function") {
              handler();
            }
            this.showNextAlert();
          },
        },
      ],
      { cancelable: false }
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    clearInterval(this.syncTimer);
  }

  async componentWillReceiveProps(nextProps) {
    const {
      fetching,
      error,
      timesheets,
      errorData,
      resetSyncState,
      resetSyncErrorState,
      timesheetsData,
      queue,
      resetTimesheetCreation,
      offlineSubmittedTimeSheets,
      savedTimeSheets,
      response,
      termsAndConditionsAccepted,
      privacyPolicyAccepted,
      syncError,
      syncErrorMsg,
      isConnected,
      isOffline,
      offlineApprovedTimeSheetIds,
      offlineCanceledTimeSheetIds,
      offlineRecalledTimeSheetIds,
      resetTimesheet,
      method,
      loginMethod,
      errorMsg,
      resetLoginState,
      fetchingLogout,
      syncingData,
      lastSyncTime,
      lastGetTime,
      resetOfflineSubmittedTimesheets,
      resetTimesheetError,
    } = nextProps;

    let workOrders1 = ""; //await AsyncStorage.getItem('workOrdersData1')
    let workOrders2 = ""; //await AsyncStorage.getItem('workOrdersData2')
    try {
      workOrders1 = await AsyncStorage.getItem("workOrdersData1");
      workOrders2 = await AsyncStorage.getItem("workOrdersData2");
    } catch (error) {
      console.warn("workOrders", error);
    }

    const isSupervisor =
      this.props.response &&
      this.props.response.data.user_type === "supervisor";

    let states = {
      workOrders1: workOrders1,
      workOrders2: workOrders2,
      fetching: fetching || fetchingLogout,
      filterDate: null,
      clearFilter: true,
      syncingData,
      error,
    };

    if (!fetching && !fetchingLogout) {
      if (
        (this.props.termsAndConditionsAccepted !== termsAndConditionsAccepted &&
          termsAndConditionsAccepted) ||
        (this.props.privacyPolicyAccepted !== privacyPolicyAccepted &&
          privacyPolicyAccepted)
      ) {
        resetTimesheet();
      }

      // NOTE: When TnCs and Privacy Policy is accepted
      if (
        response.data.eula_id &&
        response.data.privacy_id &&
        this.state.deprecatedTnCs
      ) {
        this.getTimeSheets();
        states["shouldSync"] = false;
        states["deprecatedTnCs"] = false;
        if (!syncingData && this.state.shouldSync) {
          this.syncData();
        }

        // TODO: This will be done by adding a condition after change in login response (will be done after CSV import)
        // this.showChangePasswordScreen()
      }

      if (error && method === "get") {
        if (
          errorData &&
          (errorData.deprecated_eula || errorData.deprecated_privacy)
        ) {
          if (!this.state.movedToTnCs) {
            states["movedToTnCs"] = true;
            states["fetching"] = false;
            states["deprecatedTnCs"] = true;
            if (errorData.deprecated_eula) {
              this.props.navigation.navigate("TermsAndConditionsScreen", {
                deprecated_privacy: errorData.deprecated_privacy,
              });
            } else {
              this.props.navigation.navigate("PrivacyPolicyScreen");
            }
          }
        } else if (
          errorData &&
          typeof errorData === "string" &&
          errorData !== ""
        ) {
          this.showAlert(errorData, resetTimesheetError);
        }
      } else {
        if (this.state.shouldSync && !this.state.movedToTnCs) {
          // NOTE: There will be no syncing when TnCs are showing
          states["shouldSync"] = false;
          if (!syncingData) {
            this.syncData();
          }
        }
      }

      if (!queue.length && isOffline) {
        resetTimesheetCreation();
        this.getTimeSheets();
        states["fetchingOfflineTimesheets"] = true;
      }

      if (loginMethod === "delete" && !states.loggedOut) {
        states["timePassed"] = false;
        states["fetching"] = false;
        states["loggedOut"] = true;

        if (errorMsg && errorMsg !== "") {
          this.showAlert(errorMsg, resetLoginState);
        } else {
          clearTimeout(this.logoutTimer);
          states["timePassed"] = false;
          const email = response.data.email;
          resetLoginState();
          resetTimesheet();
          resetSyncState();

          const action = NavigationActions.navigate({
            routeName: "LoginScreen",
            params: { email: email },
          });
          this.props.navigation.reset([action], 0);
        }
      }

      if (syncError && syncErrorMsg) {
        this.showAlert(syncErrorMsg, resetSyncErrorState);
      }
    }

    if (syncingData === true && this.rotateValueHolder._value === 0) {
      this.startImageRotateFunction();
    } else if (syncingData === false) {
      this.stopImageRotateFunction();
    }

    // NOTE: For case when timesheets are not loaded from
    // getTimesheets due to network unavailability and you get them on sync.
    if (isGreater(lastSyncTime, lastGetTime, SYNC_DATE_FORMAT)) {
      states["timesheets"] = timesheetsData;
      states["filteredTimesheets"] = timesheetsData;
    } else if (timesheets) {
      states["timesheets"] = timesheets;
      states["filteredTimesheets"] = timesheets;

      if (this.state.fetchingOfflineTimesheets) {
        states["fetchingOfflineTimesheets"] = false;
        this.showAlert(
          "All offline time sheets have been uploaded successfully"
        );
        resetOfflineSubmittedTimesheets();
      }
    }

    if (isSupervisor) {
      let pendingTimeSheets = [...states["timesheets"]];
      let offlineApprovedTimeSheets = offlineApprovedTimeSheetIds;

      let allTimeSheets = pendingTimeSheets;
      let offlineIndex = 0;
      for (
        let i = offlineIndex;
        i < offlineApprovedTimeSheets?.length ?? 0;
        i++
      ) {
        for (let j = 0; j < pendingTimeSheets.length; j++) {
          if (pendingTimeSheets[j].id === offlineApprovedTimeSheets[i]) {
            allTimeSheets.splice(j, 1);
            offlineIndex++;
          }
        }
      }
      states["timesheets"] = allTimeSheets;
      states["filteredTimesheets"] = allTimeSheets;
    }

    // if (offlineCanceledTimeSheetIds && offlineCanceledTimeSheetIds.length > 0) {
    //   let pendingTimeSheets = [...states['timesheets']]
    //   let offlineCanceledTimeSheets = offlineCanceledTimeSheetIds

    //   let allTimeSheets = pendingTimeSheets
    //   let offlineIndex = 0
    //   for (let i = offlineIndex; i < offlineCanceledTimeSheets.length; i++) {
    //     for (let j = 0; j < pendingTimeSheets.length; j++) {
    //       if (pendingTimeSheets[j].id === offlineCanceledTimeSheets[i]) {
    //         allTimeSheets.splice(j, 1)
    //         offlineIndex++
    //       }
    //     }
    //   }
    //   states['timesheets'] = allTimeSheets
    //   states['filteredTimesheets'] = allTimeSheets
    // }

    if (offlineRecalledTimeSheetIds && offlineRecalledTimeSheetIds.length > 0) {
      let pendingTimeSheets = [...states["timesheets"]];
      let offlineRecalledTimeSheets = offlineRecalledTimeSheetIds;

      let allTimeSheets = pendingTimeSheets;
      let offlineIndex = 0;
      for (let i = offlineIndex; i < offlineRecalledTimeSheets.length; i++) {
        for (let j = 0; j < pendingTimeSheets.length; j++) {
          if (pendingTimeSheets[j].id === offlineRecalledTimeSheets[i]) {
            allTimeSheets.splice(j, 1);
            offlineIndex++;
          }
        }
      }
      states["timesheets"] = allTimeSheets;
      states["filteredTimesheets"] = allTimeSheets;
    }

    if (
      offlineSubmittedTimeSheets &&
      offlineSubmittedTimeSheets.length &&
      queue.length
    ) {
      let onlineTimeSheets = [...states["timesheets"]];
      let allSubmittedTimeSheets =
        offlineSubmittedTimeSheets.concat(onlineTimeSheets);
      states["timesheets"] = allSubmittedTimeSheets;
      states["filteredTimesheets"] = allSubmittedTimeSheets;
    }

    if (savedTimeSheets && savedTimeSheets.length) {
      let onlineTimeSheets = [...states["timesheets"]];
      let allTimeSheets = savedTimeSheets.concat(onlineTimeSheets);
      states["timesheets"] = allTimeSheets;
      states["filteredTimesheets"] = allTimeSheets;
    }
    let userName = nextProps.response?.data?.name;
    states["timesheets"] = (
      isImmutable(states["timesheets"])
        ? asMutable(states["timesheets"])
        : states["timesheets"]
    ).sort(sortTimeSheet(userName));
    states["filteredTimesheets"] = (
      isImmutable(states["filteredTimesheets"])
        ? asMutable(states["filteredTimesheets"])
        : states["filteredTimesheets"]
    ).sort(sortTimeSheet(userName));

    if (
      nextProps.nav.routes[nextProps.nav.index].routeName ===
        "TimesheetsListScreen" &&
      nextProps.needRefresh
    ) {
      this._refreshTimesheets();
    }

    console.log(
      nextProps.nav.routes[nextProps.nav.index].routeName,
      nextProps.needRefresh
    );

    this.setState(states);
  }

  showChangePasswordScreen() {
    this.props.navigation.navigate("UpdateDefaultPasswordScreen", {
      isUpdatingDefaultPassword: true,
    });
  }

  openTimeSheet(timesheet, isSupervisor) {
    let userId = this.props.response.data.id;
    let isRecallable =
      timesheet.staff_id === userId && timesheet.status === "pending";
    let isNewTimeSheet = false;
    if (timesheet.status === "recalled" || timesheet.status === "draft") {
      isNewTimeSheet = true;
    }
    this.props.resetTimesheetCreation();
    this.props.navigation.navigate("NewTimeSheetScreen", {
      timesheet: timesheet,
      workOrders1: this.state.workOrders1,
      workOrders2: this.state.workOrders2,
      isNewTimeSheet: isNewTimeSheet,
      timeSheetType: timeSheetTypes[timesheet.time_sheet_type],
      isSupervisor: isSupervisor,
      isRecallable: isRecallable,
    });
  }

  onProfileDropdownTextChange(value) {
    if (value === "Logout") {
      this.setState({ fetching: true });
      this.logoutTimer = setTimeout(
        () =>
          this.setState({ timePassed: true, fetching: this.props.isConnected }),
        1500
      );
      // NOTE: interval is added because when API is called,
      // modal added by the material drop down does not dismiss which disables the
      // interaction with app in case of error on logout.
    } else if (value === "Profile") {
      this.props.navigation.navigate("ProfileScreen");
    } else if (value === "Manuals") {
      this.props.navigation.navigate("ManualListScreen");
    }
  }

  clearFilterAndClose() {
    if (!this.shouldApplyFilter) {
      let filteredTimesheets = this.state.timesheets;
      this.setState(
        {
          filterDates: { startingDay: null, endingDay: null },
          clearFilter: true,
          filteredTimesheets,
        },
        () => {
          if (this.props.isConnected) {
            this.getTimeSheets();
          }
        }
      );
    }
    this.setState({ calendarVisible: false });
  }

  openPickerModal() {
    this.shouldApplyFilter = false;
    this.setState({ calendarVisible: true });
  }

  /**
   * @param {string} startingDay
   * @param {string} endingDay
   */
  onDatesChange(startingDay, endingDay) {
    if (!startingDay) {
      this.clearFilterAndClose();
      return;
    }
    this.filterTimesheetsWithRange(startingDay, endingDay);
    this.setState({ calendarVisible: false });
  }

  filterTimesheetsWithRange(startingDay, endingDay) {
    let filteredTimesheets = [];
    if (startingDay === endingDay) {
      filteredTimesheets = this.state.timesheets.filter((timesheet) => {
        return moment(timesheet.start_date).diff(startingDay, "day") === 0;
      });
    } else {
      filteredTimesheets = this.state.timesheets.filter((timesheet) => {
        return moment(timesheet.start_date).isBetween(
          startingDay,
          endingDay,
          undefined,
          "[]"
        );
      });
    }
    this.shouldApplyFilter = true;
    this.setState({
      filterDates: { startingDay, endingDay },
      clearFilter: false,
      filteredTimesheets,
    });
    if (this.props.isConnected) {
      this.getTimeSheets(startingDay, endingDay);
    }
  }

  getEmptyViewText(isSupervisor) {
    if (!this.props.error && this.props.error !== false) {
      let textForDateRange = () => {
        if (
          !this.state.filterDates.startingDay &&
          !this.state.filterDates.endingDay
        ) {
          return "Time sheets only for last 30 days will show";
        } else if (
          this.state.filterDates.startingDay ===
          this.state.filterDates.endingDay
        ) {
          return `No time sheet started on ${this.state.filterDates.startingDay}`;
        } else {
          return `No time sheet started between\n${this.state.filterDates.startingDay} and ${this.state.filterDates.endingDay}`;
        }
      };
      if (isSupervisor) {
        return this.state.clearFilter
          ? "No time sheet to be approved"
          : textForDateRange();
      } else {
        return this.state.clearFilter
          ? "You have not submitted any time sheet yet"
          : textForDateRange();
      }
    }
  }

  getTotalTimeInHours(time) {
    let t = time / 60;
    return parseFloat(t.toFixed(2));
  }

  getTimeSheetTypeText(type) {
    // TODO: We need to use humanize and Capitalize functions on type and get rid of switch statement.
    switch (type) {
      case "rental":
        return "Rental";
      case "job_cost":
        return "Job Cost";
      case "unbilled":
        return "Unbilled";
      default:
        return type;
    }
  }

  getDescription(timesheet) {
    switch (timesheet.time_sheet_type) {
      case "rental":
        return timesheet.site;
      case "job_cost":
        return timesheet.tasks[0]?.job_number;
      case "unbilled":
        return timesheet.tasks[0]?.gl_account;
      default:
        return "";
    }
  }

  getBadgeStyle(status) {
    switch (status) {
      case "approved":
        return styles.approvedStatusBadge;
      case "recalled":
        return styles.recalledStatusBadge;
      default:
        return styles.pendingStatusBadge;
    }
  }

  renderListItemForStaff(timesheet, index) {
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => this.openTimeSheet(timesheet, false)}
      >
        <View style={styles.staffTimesheet}>
          <View style={styles.offlineTimeSheetView}>
            <Text style={styles.timesheetDate}>
              {getDateInFormat(
                timesheet.start_date,
                "DD MMM YYYY"
              ).toUpperCase()}
            </Text>
            {timesheet.submittedOfflineSheet && (
              <Image
                style={styles.unSyncedSheet}
                source={images.unSyncedSheet}
              />
            )}
          </View>
          <View style={this.getBadgeStyle(timesheet.status)}>
            <Text style={styles.status}>
              {(timesheet.status || "pending").replace(/^[a-z]/, (str) =>
                str.toUpperCase()
              )}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={[styles.timesheetTitle, styles.descriptionHeight]}
          >
            {this.getDescription(timesheet)}
          </Text>
          <View style={styles.timesheetHoursRow}>
            <Image source={Images.clockIcon} />
            <Text style={styles.timesheetHours}>
              {isNaN(timesheet.total_time)
                ? "0 hrs"
                : this.getTotalTimeInHours(timesheet.total_time) + " hrs"}
            </Text>
          </View>
          <View style={styles.timeSheetTypeStatusBadge}>
            <Text style={styles.status}>
              {this.getTimeSheetTypeText(timesheet.time_sheet_type)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderListItemForSupervisor(timesheet, index) {
    let userId = this.props.response.data.id;
    let isSupervisor = timesheet.staff_id !== userId;
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => this.openTimeSheet(timesheet, isSupervisor)}
      >
        <View style={styles.supervisorTimesheet}>
          <Text style={styles.timesheetDate}>
            {getDateInFormat(timesheet.submitted_at, "DD MMM YYYY")}
          </Text>
          <View style={styles.pendingStatusBadge}>
            <Text style={styles.status}>Pending</Text>
          </View>
          <Text
            numberOfLines={2}
            style={[styles.timesheetTitle, styles.descriptionHeight]}
          >
            {timesheet.staff}
          </Text>
          <View style={styles.timeSheetTypeStatusBadge}>
            <Text style={styles.status}>
              {this.getTimeSheetTypeText(timesheet.time_sheet_type)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  getFullName(data) {
    return data.first_name + " " + data.last_name;
  }

  getSyncText(unSyncedCount) {
    if (this.state.syncingData === true) {
      return "syncing...";
    } else {
      return unSyncedCount === 0 ? "all synced" : `${unSyncedCount} un-synced`;
    }
  }

  renderSyncImage(unSyncedCount) {
    if (this.state.syncingData) {
      const spin = this.rotateValueHolder.interpolate({
        inputRange: [0, 1],
        outputRange: ["360deg", "0deg"],
      });
      return (
        <TouchableOpacity style={styles.syncImageView}>
          <Animated.Image
            style={{ transform: [{ rotate: spin }] }}
            source={images.sync}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.syncImageView}
          onPress={() => this.syncData()}
        >
          <Image
            style={styles.syncImage}
            source={unSyncedCount === 0 ? images.sync : images.unSync}
          />
        </TouchableOpacity>
      );
    }
  }

  syncData() {
    clearTimeout(this.syncTimeOut);
    clearInterval(this.syncTimer);
    this.syncTimer = setInterval(() => this.syncData(), AUTO_SYNC_INTERVAL); // NOTE: It will sync data automatically every hour.
    this.setState({ syncStarted: true });
    const headers = this.props.response.headers;
    this.props.downloadData(headers);
  }

  renderTopView() {
    return (
      <View
        style={[
          styles.filterAndSyncContainer,
          { justifyContent: "space-between" },
        ]}
      >
        {this.renderTimeSheetFilterView()}
        {this.renderSyncView()}
      </View>
    );
  }

  renderTimeSheetFilterView() {
    let { startingDay, endingDay } = this.state.filterDates;
    let text = () => {
      if (!startingDay) {
        return "All timesheets";
      } else if (startingDay === endingDay) {
        return moment(startingDay, "Y-MM-DD").format("DD MMM Y");
      } else {
        return `${moment(startingDay, "Y-MM-DD").format(
          "DD MMM Y"
        )}\nto ${moment(endingDay, "Y-MM-DD").format("DD MMM Y")}`;
      }
    };
    return (
      <TouchableOpacity onPress={() => this.openPickerModal()}>
        <View style={styles.timeSheetFilterContainer}>
          <Text adjustsFontSizeToFit style={styles.headerText}>
            {text()}
          </Text>
          <Image style={styles.headerCaret} source={Images.caretIcon} />
        </View>
      </TouchableOpacity>
    );
  }

  renderSyncView() {
    const unSyncedCount = this.props.queue.length;
    let syncText = this.getSyncText(unSyncedCount);
    return (
      <View style={styles.timeSheetSyncContainer}>
        <View style={styles.syncTextView}>
          <Text style={styles.syncText}>{syncText}</Text>
          <Text style={styles.syncText}>{this.props.lastSyncTime}</Text>
        </View>
        {this.renderSyncImage(unSyncedCount)}
      </View>
    );
  }

  renderTimeSheetAddIcon() {
    return (
      <View style={styles.addImageView}>
        <Image style={styles.addImage} source={images.addTimesheet} />
      </View>
    );
  }

  onTimeSheetTypeDropdownTextChange(type) {
    this.props.resetTimesheetCreation();

    this.props.navigation.navigate("NewTimeSheetScreen", {
      workOrders1: this.state.workOrders1,
      workOrders2: this.state.workOrders2,
      isNewTimeSheet: true,
      isSupervisor: false,
      timeSheetType: type,
    });
  }

  render() {
    const { fetching, error, filteredTimesheets } = this.state;
    const isSupervisor =
      this.props.response &&
      this.props.response.data.user_type === "supervisor";
    const canCreateTimeSheet = this.props.response.data.supervisor_id !== null;
    const userName = this.props.response && this.props.response.data.first_name;

    function title() {
      if (!isSupervisor) {
        return "My Timesheet";
      } else if (canCreateTimeSheet) {
        return "Timesheet";
      } else {
        return "Timesheet Approval";
      }
    }

    if (this.state.timePassed === true && this.logoutTimer) {
      this.setState({ timePassed: false });
      if (this.state.syncingData || this.props.queue.length) {
        this.showAlert(
          "Your data is being synced, please wait for syncing to complete.",
          () => this.setState({ fetching: false })
        );
      } else {
        const headers = this.props.response.headers;
        const { logout } = this.props;
        logout(headers);
      }
    }
    return (
      <View style={styles.container}>
        <SafeAreaView style={ApplicationStyles.topContainer}>
          <View style={styles.topHeadercontainer}>
            <View style={styles.welcomeView}>
              <Text style={styles.greeting}>
                HELLO, {userName && userName.toUpperCase()}
              </Text>
              <Dropdown
                inputContainerStyle={styles.profileInputContainer}
                containerStyle={styles.profileContainer}
                propsExtractor={({value}, index) => {
                  return {
                    style:
                      index !== this.state.profile.length - 1
                        ? styles.dropdownItem
                        : {},
                  };
                }}
                style={styles.profileDropdown}
                pickerStyle={styles.pickerStyle}
                data={this.state.profile}
                dropdownOffset={styles.dropDownOffSet}
                dropdownPosition={0.5}
                baseColor={"rgba(255, 255, 255, 0.5)"}
                onChangeText={(val, index, data) =>
                  this.onProfileDropdownTextChange(data[index].value)
                }
                valueExtractor={({ value, icon }) => {
                  return (
                    <Text>
                      <Image source={icon} />
                      <Text style={styles.pickerText}>{`  ${value}`}</Text>
                    </Text>
                  );
                }}
              />
            </View>
            <View style={styles.timeSheetView}>
              <Text style={styles.pageTitle}>{title()}</Text>
              {canCreateTimeSheet ? (
                <Dropdown
                  inputContainerStyle={styles.timesheetTypesContainer}
                  data={this.state.timesheetTypes}
                  dropdownOffset={styles.dropDownOffSet}
                  dropdownPosition={0.5}
                  baseColor={"rgba(255, 255, 255, 0.5)"}
                  onChangeText={(value) =>
                    this.onTimeSheetTypeDropdownTextChange(value)
                  }
                  renderAccessory={() => this.renderTimeSheetAddIcon()}
                />
              ) : null}
            </View>
          </View>
        </SafeAreaView>

        <LinearGradient
          useAngle
          angle={0}
          colors={["#FB5825", "#A41B21", "#630C43"]}
          style={styles.timesheetContainer}
        >
          {!fetching &&
            (!filteredTimesheets || filteredTimesheets.length === 0) && (
              <View style={styles.emptyNoteView}>
                <Text style={styles.timesheetTitle}>
                  {this.getEmptyViewText(isSupervisor)}
                </Text>
              </View>
            )}
          <SafeAreaView>
            {this.renderTopView()}
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  tintColor={"#FFFFFF"}
                  progressBackgroundColor="transparent"
                  colors={["#FFFFFF"]}
                  onRefresh={async () => {
                    isRefreshing = true;
                    this.getTimeSheets();
                    isRefreshing = false;
                  }}
                />
              }
            >
              <View style={styles.timesheetsContainter}>
                {filteredTimesheets &&
                  !filteredTimesheets.id &&
                  filteredTimesheets.map((timesheet, index) => {
                    if (!isSupervisor) {
                      return this.renderListItemForStaff(timesheet, index);
                    } else {
                      return this.renderListItemForSupervisor(timesheet, index);
                    }
                  })}
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
        {this.state.fetching && !isRefreshing && <Loader isLoading />}
        <CalendarDatePicker
          visible={this.state.calendarVisible}
          startingDay={this.state.filterDates.startingDay}
          endingDay={this.state.filterDates.endingDay}
          onDatesChange={(s, e) => this.onDatesChange(s, e)}
          onCancel={() => this.clearFilterAndClose()}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    fetching: state.timeSheets.fetching,
    fetchingLogout: state.login.fetching,
    syncingData: state.syncData.fetching,
    lastSyncTime: state.syncData.lastSyncTime,
    lastGetTime: state.timeSheets.lastGetTime,
    error: state.timeSheets.error,
    errorData: state.timeSheets.errorData,
    errorMsg: state.login.errorMsg,
    syncError: state.syncData.error,
    syncErrorMsg: state.syncData.errorMsg,
    method: state.timeSheets.method,
    needRefresh: state.timeSheets.needRefresh,
    isOffline: state.timeSheets.isOffline,
    loginMethod: state.login.method,
    timesheets: state.timeSheets.timesheets,
    offlineSubmittedTimeSheets: state.timeSheets.offlineSubmittedTimeSheets,
    savedTimeSheets: state.timeSheets.savedTimeSheets,
    downloadedData: state.syncData.downloadedData,
    timesheetsData: state.syncData.timesheetsData,
    response: state.login.payload,
    termsAndConditionsAccepted: state.termsAndConditions.payload,
    privacyPolicyAccepted: state.privacyPolicy.payload,
    isConnected: state.network.isConnected,
    offlineApprovedTimeSheetIds: state.timeSheets.offlineApprovedTimeSheetIds,
    queue: state.network.actionQueue.map((a) => a.type),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTimeSheets: (data, headers) =>
      dispatch(TimeSheetActions.getTimeSheets(data, headers)),
    resetTimesheet: () => dispatch(TimeSheetActions.resetTimesheet()),
    resetTimesheetError: () => dispatch(TimeSheetActions.resetTimesheetError()),
    resetTimesheetCreation: () =>
      dispatch(TimeSheetActions.resetTimesheetCreation()),
    resetOfflineSubmittedTimesheets: () =>
      dispatch(TimeSheetActions.resetOfflineSubmittedTimesheets()),
    logout: (headers) => dispatch(LoginActions.logoutRequest(headers)),
    downloadData: (headers) => dispatch(SyncDataActions.downloadData(headers)),
    resetLoginState: () => dispatch(LoginActions.resetLoginState()),
    resetSyncState: () => dispatch(SyncDataActions.resetSyncState()),
    resetSyncFetchState: () => dispatch(SyncDataActions.resetSyncFetchState()),
    resetSyncErrorState: () => dispatch(SyncDataActions.resetSyncErrorState()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimesheetsListScreen);
