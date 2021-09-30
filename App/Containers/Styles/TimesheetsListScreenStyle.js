import { Platform, StyleSheet } from "react-native";
import { Colors } from "../../Themes";
import Fonts from "../../Themes/Fonts";
const Dimensions = require("Dimensions");
let { width, height } = Dimensions.get("window");
const ACTUAL_WITDTH = width < height ? width : height;
const CELL_WIDTH = (ACTUAL_WITDTH - 70) / 2;
const DROP_DOWN_OFFSET = ACTUAL_WITDTH / 2;
const ADD_TIME_SHEET_VIEW_WIDTH = ACTUAL_WITDTH - 52;

const statusBadge = {
  marginTop: 6,
  paddingHorizontal: 12,
  paddingVertical: 4,
  alignSelf: "flex-start",
  maxWidth: "100%",
  borderRadius: 2,
};

export default StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: "#F4F4F4",
  },
  topHeadercontainer: {
    alignItems: "flex-start",
    flex: 1,
    marginLeft: 30,
    justifyContent: "center",
  },
  headerText: {
    ...Fonts.style.fontWeight600,
    fontSize: 17,
    color: Colors.snow,
    borderBottomColor: Colors.snow,
    borderBottomWidth: 0.5,
    textAlign: 'right',
    marginRight: 8,
  },
  headerCaret: {
    alignSelf: "center",
  },
  welcomeView: {
    flexDirection: "row",
  },
  dropdownItem: {
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 1,
    paddingTop: 5,
  },
  emptyNoteView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  leftHeader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  rightHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginRight: 20,
  },
  addImage: {
    width: 34,
    height: 34,
  },
  greeting: {
    ...Fonts.style.description,
    color: "white",
    fontWeight: "bold",
    marginTop: 7,
  },
  syncTextView: {
    flexDirection: "column",
  },
  syncText: {
    ...Fonts.style.small,
    color: "white",
    marginTop: 3,
    opacity: 0.6,
    textAlign: "right",
  },
  syncImageView: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  syncImage: {
    width: 22,
    height: 22,
  },
  unSyncedSheet: {
    width: 18,
    height: 16,
  },
  pageTitle: {
    ...Fonts.style.fontWeight900,
    color: "white",
    alignSelf: "center",
  },
  dropdown: {
    width: "50%",
    marginLeft: 20,
  },
  pickerItemStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#808080",
  },
  profileContainer: {
    width: 20,
  },
  profileDropdown: {
    ...Fonts.style.fontWeight600,
    height: 10,
    fontSize: 17,
    color: Colors.snow,
  },
  profileInputContainer: {
    width: 60,
    height: 20,
    alignItems: "flex-start",
    borderBottomColor: "transparent",
  },
  filterInputContainer: {
    alignItems: "flex-start",
    borderBottomColor: "transparent",
  },
  scrollView: {
    paddingBottom: 220,
    backgroundColor: "transparent",
  },
  timesheetsContainter: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    height: "100%",
    marginHorizontal: 15,
  },
  timeSheetView: {
    flexDirection: "row",
    width: ADD_TIME_SHEET_VIEW_WIDTH,
    justifyContent: "space-between",
  },
  supervisorTimesheet: {
    backgroundColor: "rgba(0,0,0,0.4)",
    marginBottom: 20,
    marginHorizontal: 10,
    padding: 14,
    width: CELL_WIDTH,
    ...Platform.select({
      ios: {
        height: 127,
      },
      android: {
        height: 140,
      },
    }),
  },
  staffTimesheet: {
    backgroundColor: "rgba(0,0,0,0.4)",
    marginBottom: 20,
    marginHorizontal: 10,
    padding: 14,
    width: CELL_WIDTH,
    ...Platform.select({
      ios: {
        height: 165,
      },
      android: {
        height: 172,
      },
    }),
  },
  timesheetDate: {
    ...Fonts.style.extraSmall,
    color: Colors.snow,
    opacity: 0.7,
  },
  pendingStatusBadge: {
    ...statusBadge,
    backgroundColor: "#731A51",
  },
  approvedStatusBadge: {
    ...statusBadge,
    backgroundColor: "#66A322",
  },
  recalledStatusBadge: {
    ...statusBadge,
    backgroundColor: "grey",
  },
  timeSheetTypeStatusBadge: {
    ...statusBadge,
    backgroundColor: "#000",
  },
  status: {
    ...Fonts.style.extraSmall,
    color: "white",
  },
  timesheetTitle: {
    ...Fonts.style.small,
    marginTop: 6,
    color: Colors.snow,
    textAlign: 'center',
  },
  timesheetHoursRow: {
    marginTop: 6,
    flexDirection: "row",
  },
  timesheetHours: {
    ...Fonts.style.small,
    marginLeft: 6,
    color: Colors.snow,
    alignSelf: "center",
  },
  pickerStyle: {
    marginTop: 50,
    marginLeft: 16,
    borderRadius: 4,
  },
  pickerText: {
    color: Colors.darkGray,
    fontWeight: "bold",
    fontSize: 17,
  },
  timesheetContainer: {
    flex: 1,
  },
  addImageView: {
    marginBottom: 30,
  },
  timesheetTypesContainer: {
    borderBottomColor: "transparent",
  },
  descriptionHeight: {
    height: 34,
  },
  timeSheetFilterContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
  },
  timeSheetSyncContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  filterAndSyncContainer: {
    flexDirection: "row",
    marginHorizontal: 25,
  },
  dropDownOffSet: {
    top: 15,
    left: -DROP_DOWN_OFFSET,
  },
  datePickerDateIcon: {
    position: "absolute",
    right: 10,
    height: 6,
    width: 11,
  },
  datePickerDateInput: {
    borderColor: "transparent",
    alignItems: "flex-start",
    margin: 0,
  },
  datePickerDateText: {
    color: "#FFFFFF",
    fontSize: Fonts.size.regular,
  },
  datePickerPlaceholderText: {
    color: "#FFFFFF",
    fontSize: Fonts.size.regular,
  },
  offlineTimeSheetView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    height: 16,
  },
});
