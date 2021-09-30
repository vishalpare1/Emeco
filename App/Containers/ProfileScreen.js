import React, { Component } from 'react'
import { Text, View, Image, Alert, TouchableOpacity, Keyboard, Platform
} from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/ProfileScreenStyle'
import ProfileInputField from '../Components/ProfileInputField'
import ButtonOutlined from '../Components/ButtonOutlined'
import { Images, ApplicationStyles } from '../Themes'
import LoginActions from '../Redux/LoginRedux'
import LinearGradient from 'react-native-linear-gradient'
import Loader from '../Components/Loader'
import KeyboardAccessory from '../Components/KeyboardAccessory'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePickerComponent from '../Components/DatePickerComponent'
import moment from 'moment'
import Device from 'react-native-device-info'
import ProfileCheckbox from '../Components/ProfileCheckbox'
class ProfileScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      loading: false,
      activeIndex: 0,
      isAlertPresent: false,
      isAlternateChecked: false,
    }

    this.navigateTo = this.navigateTo.bind(this)
    this.updatePassword = this.updatePassword.bind(this)
    this.goBack = this.goBack.bind(this)
    this.saveUserProfile = this.saveUserProfile.bind(this)
    this.getPasswordString = this.getPasswordString.bind(this)
    this.setStateData = this.setStateData.bind(this)

    this.currentFocusable = null
    this.focusables = {}
  }

  componentDidMount () {
    const { response, passwordLength } = this.props

    this.setStateData(response, passwordLength)
    const headers = response && response.headers
    this.props.getUserProfile(headers);
  }

  goBack () {
    this.props.navigation.goBack()
  }

  navigateTo (screenName) {
    this.props.navigation.navigate(screenName)
  }

  updatePassword () {
    this.navigateTo('UpdateDefaultPasswordScreen')
  }

  getPasswordString (len) {
    const str = '*'
    return str.repeat(len)
  }

  setStateData (response, passwordLength, updatingUser) {
    let userPassword = this.getPasswordString(passwordLength)
    let defaultStartTimeText = (response && response.data && response.data.default_start_time) || '06:00'
    let date = new Date()
    let defaultStartTime = moment(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${defaultStartTimeText}`, 'Y-MM-DD HH:mm').toDate()

    this.setState({
      firstName: response && response.data ? response.data.first_name : '',
      lastName: response && response.data ? response.data.last_name : '',
      email: response && response.data ? response.data.email : '',
      password: userPassword,
      loading: updatingUser,
      defaultStartTime: defaultStartTime,
      isAlternateChecked: response && response.data ? response.data.is_alternate_checked : '',
    })
  }

  componentWillReceiveProps (nextProps) {
    const {
      errorUpdating,
      errorMessage,
      updatingUser,
      method,
      response,
      isReset,
      passwordLength
    } = nextProps

    if (errorUpdating && !updatingUser) {
      this.setState({isAlertPresent: true})
      Alert.alert(
        'Error',
        errorMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              this.props.resetLoginState()
              this.setState({isAlertPresent: false})
            }
          }
        ],
        { cancelable: false }
      )
    } else if (response && method === 'put' && !updatingUser && !isReset) {
      if (!this.state.isAlertPresent) {
        this.setState({isAlertPresent: true})
        Alert.alert(
          '',
          'Your profile has been updated successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                this.props.resetLoginState()
                this.goBack()
              }
            }
          ],
          { cancelable: false }
        )
      }
    }

    if (this.props.isConnected === nextProps.isConnected) {
      this.setStateData(response, updatingUser)
    }

    if (updatingUser) {
      this.setState({loading: updatingUser})
    }
  }

  saveUserProfile () {
    const { firstName, lastName, email, defaultStartTime, isAlternateChecked } = this.state
    const { response, updateUser } = this.props

    let data = {
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'default_start_time': moment(defaultStartTime).format('Y-MM-DD HH:mm'),
      'is_alternate_checked': isAlternateChecked
    }

    const staffId = response && response.data && response.data.id
    const headers = response && response.headers
    updateUser(data, staffId, headers)
  }

  onFocus (index) {
    this.setState({activeIndex: index})
    this.currentFocusable = { index, ...this.focusables[index] }
  }

  focus (from, toIndex) {
    const to = this.focusables[toIndex]
    if (to) {
      to.focus()
    }
  }

  onPreviousPress = () => {
    let toIndex = toIndex = this.currentFocusable.index - 1
    this.focus(this.currentFocusable, toIndex)
  }

  onNextPress = () => {
    let toIndex = toIndex = this.currentFocusable.index + 1
    this.focus(this.currentFocusable, toIndex)
  }

  onDonePress = () => {
    Keyboard.dismiss()
  }

  scrollToInput = (reactNode: any) => {
		// Add a 'scroll' ref to your ScrollView

    if (Platform.OS == 'android') {
      this.scroll.props.scrollToFocusedInput(reactNode)
    }
  }

  renderHeader () {
    return (
      <View style={{...ApplicationStyles.topContainer, alignItems: 'flex-end', padding: 20}}>
        <TouchableOpacity onPress={() => this.goBack()}>
          <Image style={styles.backButtonImage} source={Images.whiteBackIcon} />
        </TouchableOpacity>
        <Text style={styles.mainHeading}>My Profile</Text>
      </View>
    )
  }

  render () {
    return (
      <KeyboardAccessory
        onPreviousPress={this.onPreviousPress}
        onNextPress={this.onNextPress}
        onDonePress={this.onDonePress}
        activeIndex={this.state.activeIndex}
        totalFields={3}
      >
        <View style={{flex: 1}}>
          { Platform.OS == 'ios' && this.renderHeader() }
          <LinearGradient useAngle angle={0} colors={['#FB5825', '#A41B21', '#630C43']} style={styles.profileContainer}>
            <KeyboardAwareScrollView
              contentContainerStyle={{flexGrow: 1}}
              style={styles.container}
              innerRef={ref => {
                this.scroll = ref
              }}
              enableAutomaticScroll={false}
          >
              { Platform.OS == 'android' && this.renderHeader() }

              <View style={styles.profileView}>
                <ProfileInputField
                  label={'FIRST NAME'}
                  value={this.state.firstName}
                  placeholder={'First Name'}
                  onChange={firstName => this.setState({ firstName })}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(0) }}
                  setRef={ref => this.focusables[0] = ref}
                />

                <ProfileInputField
                  label={'LAST NAME'}
                  value={this.state.lastName}
                  placeholder={'Last Name'}
                  onChange={lastName => this.setState({ lastName })}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(1) }}
                  setRef={ref => this.focusables[1] = ref}
                />

                <ProfileInputField
                  keyboardType={'email-address'}
                  label={'EMAIL ADDRESS'}
                  placeholder={'Email Address'}
                  value={this.state.email}
                  onChange={email => this.setState({ email })}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(2) }}
                  setRef={ref => this.focusables[2] = ref}
                />

                <DatePickerComponent
                  date={this.state.defaultStartTime}
                  onDateChange={defaultStartTime => this.setState({defaultStartTime})}
                  title={'START TIME'}
                  titleStyle={styles.dateLabelStyle}
                  // dateStyle={styles.datePicker}
                  mode={'time'}
                  placeholder='Select time'
                  margin={'right'}
                  // placeholderTextStyle={styles.datePickerPlaceholder}
                  // dateInputStyle={styles.dateInputStyle}
                />    

                <ProfileInputField
                  label={'PASSWORD'}
                  value={this.state.password}
                  placeholder={'Password'}
                  onChange={password => this.setState({password})}
                  showUpdateButton
                  updatePassword={this.updatePassword}
                  isEditable={false}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                />

                <ProfileCheckbox
                  value={this.state.isAlternateChecked}
                  onChange={(isAlternateChecked) =>
                    this.setState({ isAlternateChecked })
                  }
                />

                <ButtonOutlined
                  onPress={() => this.saveUserProfile()}
                  text={'Save Profile'}
                  style={styles.saveButton}
                  textStyle={styles.saveButtonText}
                />

              </View>
            </KeyboardAwareScrollView>
            <Text style={styles.version}>{`${Device.getVersion()} (${Device.getBuildNumber()})`}</Text>
          </LinearGradient>
          { this.state.loading && <Loader isLoading={this.state.loading} /> }
        </View>
      </KeyboardAccessory>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    response: state.login.payload,
    method: state.login.method,
    isReset: state.login.isReset,
    passwordLength: state.login.passwordLength,
    updatingUser: state.login.fetching,
    errorUpdating: state.login.error,
    errorMessage: state.login.errorMsg,
    isConnected: state.network.isConnected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProfile: (headers) => dispatch(LoginActions.getUserProfile(headers)),
    updateUser: (data, staffId, headers) => dispatch(LoginActions.updateUser(data, staffId, headers)),
    resetLoginState: () => dispatch(LoginActions.resetLoginState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
