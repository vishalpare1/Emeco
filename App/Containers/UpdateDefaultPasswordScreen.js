import React, { Component } from 'react'
import { Image, View, Text, TouchableOpacity, Alert, Keyboard, Platform } from 'react-native'
import { connect } from 'react-redux'
import UpdateDefaultPasswordActions from '../Redux/UpdateDefaultPasswordRedux'
import styles from './Styles/UpdateDefaultPasswordScreenStyle'
import Images from '../Themes/Images'
import ButtonOutlined from '../Components/ButtonOutlined'
import { ApplicationStyles } from '../Themes'
import ProfileInputField from '../Components/ProfileInputField'
import LinearGradient from 'react-native-linear-gradient'
import { isNullSafe, isValidPassword } from '../Lib/Helpers'
import Loader from '../Components/Loader'
import KeyboardAccessory from '../Components/KeyboardAccessory'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class UpdateDefaultPasswordScreen extends Component {
  constructor (props) {
    let isUpdatingDefaultPassword = props.navigation.getParam('isUpdatingDefaultPassword')

    super(props)
    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
      alertPresent: false,
      activeIndex: 0,
      isUpdatingDefaultPassword: isUpdatingDefaultPassword
    }

    this.goBack = this.goBack.bind(this)
    this.updatePassword = this.updatePassword.bind(this)

    this.currentFocusable = null
    this.focusables = {}
  }

  showAlertWithMessageAndPopScreen (message, resetChangePasswordState, popScreen) {
    let that = this
    that.setState({ alertPresent: true })
    Alert.alert(
      '',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            if (popScreen) {
              that.props.navigation.pop()
            }
            resetChangePasswordState()
            that.setState({ alertPresent: false })
          }
        }
      ],
      { cancelable: false }
    )
  }

  componentWillReceiveProps (nextProps) {
    const { response, isFetching, errorMsg, resetChangePasswordState } = nextProps

    if (errorMsg && !this.state.alertPresent) {
      this.showAlertWithMessageAndPopScreen(errorMsg, resetChangePasswordState, false)
    } else {
      if (response && !this.state.alertPresent) {
        this.showAlertWithMessageAndPopScreen('Your password has been updated successfully', resetChangePasswordState, true)
      }
    }
    this.setState({ response, isFetching, errorMsg })
  }

  goBack () {
    this.props.navigation.goBack()
  }

  updatePassword () {
    const { oldPassword, newPassword, newPasswordAgain } = this.state

    if (isNullSafe(oldPassword) && isNullSafe(newPassword) && isNullSafe(newPasswordAgain)) {
      if (isValidPassword(newPassword)) {
        if (newPassword === newPasswordAgain) {
          const { loginResponse, updatePassword } = this.props

          let data = {
            'current_password': oldPassword,
            'password': newPassword,
            'password_confirmation': newPasswordAgain
          }

          const staffId = loginResponse && loginResponse.data && loginResponse.data.id
          const headers = loginResponse && loginResponse.headers
          updatePassword(data, staffId, headers)
        } else {
          Alert.alert('New password and confirm password are not same')
        }
      } else {
        Alert.alert('Password must be eight digits long')
      }
    } else {
      Alert.alert('All fields are mandatory')
    }
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

		// if (Platform.OS == 'android') {
    this.scroll.props.scrollToFocusedInput(reactNode)
		// }
  }

  renderHeader () {
    return (
      <View style={{...ApplicationStyles.topContainer, alignItems: 'flex-end', padding: 20}}>
        {
          !this.state.isUpdatingDefaultPassword &&
          <TouchableOpacity onPress={() => this.goBack()}>
            <Image source={Images.whiteBackIcon} />
          </TouchableOpacity>
        }
        <Text style={styles.mainHeading}>Password</Text>
      </View>
    )
  }

  render () {
    const { isFetching } = this.state
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
              style={styles.scrollContainer}
              innerRef={ref => {
                this.scroll = ref
              }}
              enableAutomaticScroll={false}
              extraHeight={247}
            >
              { Platform.OS == 'android' && this.renderHeader() }

              <View style={styles.inputView} >
                <ProfileInputField
                  label={'OLD PASSWORD'}
                  placeholder={'Old password'}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  value={this.state.oldPassword}
                  onChange={oldPassword => this.setState({ oldPassword })}
                  secureTextEntry
                  onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(0) }}
                  setRef={ref => this.focusables[0] = ref}
              />
                <ProfileInputField
                  label={'NEW PASSWORD'}
                  placeholder={'New password'}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  value={this.state.newPassword}
                  onChange={newPassword => this.setState({ newPassword })}
                  secureTextEntry
                  onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(1) }}
                  setRef={ref => this.focusables[1] = ref}
              />
                <ProfileInputField
                  label={'NEW PASSWORD AGAIN'}
                  placeholder={'New password again'}
                  inputStyle={styles.inputStyle}
                  labelStyle={styles.labelStyle}
                  value={this.state.newPasswordAgain}
                  onChange={newPasswordAgain => this.setState({ newPasswordAgain })}
                  secureTextEntry
                  onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(2) }}
                  setRef={ref => this.focusables[2] = ref}
              />

                <ButtonOutlined
                  onPress={() => this.updatePassword()}
                  text={'Update'}
                  style={styles.updateButton}
                  textStyle={styles.updateButtonText}
              />
              </View>
            </KeyboardAwareScrollView>
          </LinearGradient>
          { isFetching && <Loader isLoading={isFetching} />}
        </View>
      </KeyboardAccessory>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loginResponse: state.login.payload,
    isFetching: state.updateDefaultPassword.fetching,
    errorMsg: state.updateDefaultPassword.error,
    response: state.updateDefaultPassword.payload,
    isConnected: state.network.isConnected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePassword: (data, staffId, headers) => dispatch(UpdateDefaultPasswordActions.updateDefaultPasswordRequest(data, staffId, headers)),
    resetChangePasswordState: () => dispatch(UpdateDefaultPasswordActions.resetChangePasswordState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateDefaultPasswordScreen)
