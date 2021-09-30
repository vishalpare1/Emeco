import React, { Component } from 'react'
import {
	SafeAreaView,
	View,
	Alert,
	ImageBackground,
	Text,
	TouchableOpacity,
	Keyboard,
	Platform
} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/SignupScreenStyle'
import Images from '../Themes/Images'
import EMTextInput from '../Components/EMTextInput'
import ButtonOutlined from '../Components/ButtonOutlined'
import SignupTypes from '../Redux/SignupRedux'
import { isNullSafe } from '../Lib/Helpers'
import Loader from '../Components/Loader'
import Fonts from '../Themes/Fonts'
import EmecoIconHeaderComponent from '../Components/EmecoIconHeaderComponent'
import KeyboardAccessory from '../Components/KeyboardAccessory'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class SignupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      encryptedPassword: '',
      encryptedConfirmPassword: '',
      backSpacePressed: false,
      activeIndex: 0
    }

    this.signUp = this.signUp.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)

    this.currentFocusable = null
    this.focusables = {}
    this.focusableLayouts = {}
  }

  signUp () {
    const { firstName, lastName, email, password, confirmPassword, confirm_success_url } = this.state
    if (isNullSafe(firstName) && isNullSafe(lastName) && isNullSafe(email) && isNullSafe(password) && isNullSafe(confirmPassword)) {
      if (confirmPassword !== password) {
        Alert.alert('password and confirm password don\'t match')
      } else {
        const data = {
          'first_name': firstName,
          'last_name': lastName,
          'email': email,
          'password': password,
          'confirmPassword': confirmPassword,
          'confirm_success_url': '/'
        }
        this.props.signupRequest(data)
      }
    } else {
      Alert.alert('All fields are mandatory')
    }
  }

  componentWillReceiveProps (nextProps) {
    const { response, fetching, errorMsg, error } = nextProps
    var message = error ? errorMsg : response

    if (message && !this.state.alertPresent && !fetching) {
      let successMsg = 'A message with a confirmation link has been sent to your email address "' + this.state.email + '" Please follow the link to activate your account.'

      Alert.alert(
        error ? 'Error' : '',
        message === 'success' ? successMsg : message
      )

      if (message === 'success') {
        this.props.navigation.goBack()
      }
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

    if (Platform.OS == 'android') {
      this.scroll.props.scrollToFocusedInput(reactNode)
    }
  }

  getPasswordString (len) {
    const str = '*'
    return str.repeat(len)
  }

  onChangePassword (password, passwordKey, encryptedPasswordKey) {
    if (Platform.OS == 'ios') {
      let actualPassword = ''
      let encryptedPassword = ''

      if (!this.state.backSpacePressed) {
        let actualPasswordLastChar = password.charAt(password.length - 1)
        actualPassword = (password.length > 0) ? this.state[passwordKey] + actualPasswordLastChar : ''
        encryptedPassword = this.getPasswordString(actualPassword.length)
      } else {
        actualPassword = this.state[passwordKey].slice(0, -1)
        encryptedPassword = this.getPasswordString(actualPassword.length)
      }

      this.setState({
        [passwordKey]: actualPassword,
        [encryptedPasswordKey]: encryptedPassword
      })
    } else {
      this.setState({
        [passwordKey]: password
      })
    }
  }

  onKeyPress (key) {
    if (key === 'Backspace') {
      this.setState({backSpacePressed: true})
    } else {
      this.setState({backSpacePressed: false})
    }
  }

  render () {
    return (
      <KeyboardAccessory
        onPreviousPress={this.onPreviousPress}
        onNextPress={this.onNextPress}
        onDonePress={this.onDonePress}
        activeIndex={this.state.activeIndex}
        totalFields={5}
      >
        { Platform.OS === 'ios' && <EmecoIconHeaderComponent /> }

        <SafeAreaView style={styles.mainContainer}>
          <ImageBackground source={Images.background} style={styles.backgroundImage} resizeMode='cover' />
          <KeyboardAwareScrollView
            style={styles.scrollViewContainer}
            innerRef={ref => {
              this.scroll = ref
            }}
            enableAutomaticScroll={false}
          >
            { Platform.OS === 'android' && <EmecoIconHeaderComponent /> }
            <View style={{marginHorizontal: '15%', flex: 1}}>
              <Text style={[Fonts.style.titleFont, {marginVertical: 20}]}>Register</Text>
              <EMTextInput
                label={'FIRST NAME'}
                keyboardType={'default'}
                autoCapitalize={'none'}
                value={this.state.firstName}
                inputStyle={styles.textField}
                onChange={firstName => this.setState({ firstName })}
                onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(0) }}
                setRef={ref => this.focusables[0] = ref}
            />
              <EMTextInput
                label={'LAST NAME'}
                keyboardType={'default'}
                autoCapitalize={'none'}
                value={this.state.lastName}
                inputStyle={styles.textField}
                onChange={lastName => this.setState({ lastName })}
                onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(1) }}
                setRef={ref => this.focusables[1] = ref}
            />
              <EMTextInput
                label={'EMAIL'}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                value={this.state.email}
                inputStyle={styles.textField}
                onChange={email => this.setState({ email })}
                onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(2) }}
                setRef={ref => this.focusables[2] = ref}
            />
              <EMTextInput
                label={'PASSWORD'}
                autoCapitalize={'none'}
                value={Platform.OS == 'ios' ? this.state.encryptedPassword : this.state.password}
                inputStyle={styles.textField}
                onChange={password => this.onChangePassword(password, 'password', 'encryptedPassword')}
                onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(3) }}
                setRef={ref => this.focusables[3] = ref}
                onKeyPress={(value) => this.onKeyPress(value)}
                secureTextEntry={Platform.OS == 'android'}
            />
              <EMTextInput
                label={'CONFIRM PASSWORD'}
                autoCapitalize={'none'}
                value={Platform.OS == 'ios' ? this.state.encryptedConfirmPassword : this.state.confirmPassword}
                inputStyle={styles.textField}
                onChange={confirmPassword => this.onChangePassword(confirmPassword, 'confirmPassword', 'encryptedConfirmPassword')}
                onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(4) }}
                setRef={ref => this.focusables[4] = ref}
                onKeyPress={(value) => this.onKeyPress(value)}
                secureTextEntry={Platform.OS == 'android'}
            />
              <ButtonOutlined
                onPress={() => this.signUp()}
                text={'Submit'}
                style={styles.submitButton}
                textStyle={styles.submitButtonText}
            />

              <View style={styles.separatorView} />

              <View style={styles.signupFooterView}>
                <Text style={Fonts.style.buttonTitle}>{`Already have an account? `}</Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => { this.props.navigation.goBack() }}
              >
                  <Text style={Fonts.style.buttonTitleBold}>Log In</Text>
                  <View style={styles.buttonUnderline} />
                </TouchableOpacity>
              </View>
              <View style={{height: 50}} />
            </View>
          </KeyboardAwareScrollView>
          {
            this.props.fetching &&
            <Loader isLoading={this.props.fetching} />
          }
        </SafeAreaView>
      </KeyboardAccessory>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.signUp.fetching,
    response: state.signUp.payload,
    error: state.signUp.error,
    errorMsg: state.signUp.errorMsg
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signupRequest: data => dispatch(SignupTypes.signupRequest(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
