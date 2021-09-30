import { createStackNavigator, createAppContainer } from "react-navigation";
import ProfileScreen from "../Containers/ProfileScreen";
import ManualListScreen from "../Containers/ManualListScreen";
import UpdateDefaultPasswordScreen from "../Containers/UpdateDefaultPasswordScreen";
import PrivacyPolicyScreen from "../Containers/PrivacyPolicyScreen";
import SignupScreen from "../Containers/SignupScreen";
import TermsAndConditionsScreen from "../Containers/TermsAndConditionsScreen";
import ForgotPasswordScreen from "../Containers/ForgotPasswordScreen";
import TimesheetsListScreen from "../Containers/TimesheetsListScreen";
import LoginScreen from "../Containers/LoginScreen";
import NewTimeSheetScreen from "../Containers/NewTimeSheetScreen";
import LaunchScreen from "../Containers/LaunchScreen";

import styles from "./Styles/NavigationStyles";
import PDFViewerScreen from "../Containers/PDFViewerScreen";

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    ProfileScreen: { screen: ProfileScreen },
    ManualListScreen: { screen: ManualListScreen },
    PDFViewerScreen: { screen: PDFViewerScreen },
    UpdateDefaultPasswordScreen: { screen: UpdateDefaultPasswordScreen },
    PrivacyPolicyScreen: { screen: PrivacyPolicyScreen },
    SignupScreen: { screen: SignupScreen },
    TermsAndConditionsScreen: { screen: TermsAndConditionsScreen },
    ForgotPasswordScreen: { screen: ForgotPasswordScreen },
    TimesheetsListScreen: { screen: TimesheetsListScreen },
    LoginScreen: { screen: LoginScreen },
    NewTimeSheetScreen: { screen: NewTimeSheetScreen },
    LaunchScreen: { screen: LaunchScreen },
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: "LoginScreen",
    navigationOptions: {
      headerStyle: styles.header,
    },
  }
);

export default createAppContainer(PrimaryNav);
