import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
	ImageBackground,
	Keyboard,
	Platform
} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/LoginScreenStyle'
import Images from '../Themes/Images'
import Fonts from '../Themes/Fonts'
import { getCurrentDateTime, isNullSafe } from '../Lib/Helpers'
import LoginTypes from '../Redux/LoginRedux'
import Loader from '../Components/Loader'
import EMTextInput from '../Components/EMTextInput'
import EmecoIconHeaderComponent from '../Components/EmecoIconHeaderComponent'

import ButtonOutlined from '../Components/ButtonOutlined'
import SplashScreen from 'react-native-splash-screen'
import KeyboardAccessory from '../Components/KeyboardAccessory'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import KeyboardToolbar from '../Components/KeyboardToolbar'
import Device from 'react-native-device-info'

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      encryptedPassword: '',
      backSpacePressed: false,
      activeIndex: 0
    }
    this.login = this.login.bind(this)
    this.forgetPassword = this.forgetPassword.bind(this)
    this.signUp = this.signUp.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)

    this.currentFocusable = null
    this.focusables = {}
  }

  static isRequestDispatched = false

  componentDidMount () {
    SplashScreen.hide()

    const email = this.props.navigation.state.params && this.props.navigation.getParam('email')
    if (email) {
      this.setState({email: email})
    }
  }

  login () {
    const { email, password } = this.state
    if (isNullSafe(email) && isNullSafe(password)) {
      this.props.loginRequest({ email, password })
    } else {
      Alert.alert('Error', 'Email and password needs to be filled')
    }
  };

  forgetPassword () {
    this.props.navigation.navigate('ForgotPasswordScreen')
  }

  signUp () {
    this.props.navigation.navigate('SignupScreen')
  }

  componentWillReceiveProps (nextProps) {
    const {response, loginDateTime, error, errorMessage, fetching, method} = nextProps
    const errorMsg = error ? errorMessage : ''
    if (!fetching) {
      if (errorMsg !== '' && method === 'post') {
        Alert.alert(
          'Error',
          errorMsg,
          [
            { text: 'OK',
              onPress: () => this.props.resetLoginState()
            }
          ]
        )
      } else {
        if (response && response.data) {
          const data = response.data
          if (data.status === 'approved' || data.status === 'enabled') {
            this.props.navigation.reset([this.props.navigation.navigate('TimesheetsListScreen', {loginDateTime: loginDateTime})], 0)
          }

          this.setState({
            email: data && data.email && data.email !== '' ? response.data.email : this.state.email,
            password: '',
            encryptedPassword: ''
          })
        } else {
          this.setState({
            email: this.props.response && this.props.response.data && this.props.response.data && this.props.response.data.email !== '' && this.props.response.data.email,
            password: '',
            encryptedPassword: ''
          })
        }
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

    if (Platform.OS === 'android') {
      this.scroll.props.scrollToFocusedInput(reactNode)
    }
  }

  getPasswordString (len) {
    const str = '*'
    return str.repeat(len)
  }

  onChangePassword (password) {
    if (Platform.OS === 'ios') {
      let actualPassword = ''
      let encryptedPassword = ''

      if (!this.state.backSpacePressed) {
        let actualPasswordLastChar = password.charAt(password.length - 1)
        actualPassword = (password.length > 0) ? this.state.password + actualPasswordLastChar : ''
        encryptedPassword = this.getPasswordString(actualPassword.length)
      }			else {
        actualPassword = this.state.password.slice(0, -1)
        encryptedPassword = this.getPasswordString(actualPassword.length)
      }

      this.setState({
        password: actualPassword,
        encryptedPassword: encryptedPassword
      })
    } else {
			// for android use secureTextentry true
      this.setState({
        password: password
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
        totalFields={2}
      >
        { Platform.OS === 'ios' && <EmecoIconHeaderComponent /> }
        <SafeAreaView style={styles.mainContainer}>
          <ImageBackground source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
          <KeyboardAwareScrollView
            style={styles.scrollViewContainer}
            innerRef={ref => {
              this.scroll = ref
            }}
            enableAutomaticScroll={false}
        >
            { Platform.OS === 'android' && <EmecoIconHeaderComponent /> }
            <View style={styles.keyboardView}>
              <Text style={[Fonts.style.titleFont, {marginVertical: 20}]}>Log In</Text>
              <EMTextInput
                label={'EMAIL ADDRESS'}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                value={this.state.email}
                inputStyle={styles.textField}
                onChange={email => this.setState({ email })}
                onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(0) }}
                setRef={ref => this.focusables[0] = ref}
            />
              <EMTextInput
                label={'PASSWORD'}
                autoCapitalize={'none'}
                value={Platform.OS === 'ios' ? this.state.encryptedPassword : this.state.password}
                inputStyle={styles.textField}
                onChange={password => this.onChangePassword(password)}
                secureTextEntry={Platform.OS === 'android'}
                onFocus={(event) => { this.scrollToInput(event.target); this.onFocus(1) }}
                setRef={ref => this.focusables[1] = ref}
                onKeyPress={(value) => this.onKeyPress(value)}
            />
              <View style={styles.buttonsContainer}>
                <ButtonOutlined
                  onPress={this.login}
                  text={'Log In'}
                  style={styles.loginButton}
                  textStyle={styles.loginButtonText}
                />
                <TouchableOpacity
                  onPress={this.forgetPassword}
                  style={styles.forgetPasswordButton}
              >
                  <Text style={[Fonts.style.buttonTitle, {marginTop: 12}]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.separatorView} />

              <View style={styles.loginFooterView}>
                <Text style={Fonts.style.buttonTitle}>{`Don't have an account? `}</Text>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={this.signUp}
              >
                  <Text style={Fonts.style.buttonTitleBold}>Sign Up</Text>
                  <View style={styles.buttonUnderline} />
                </TouchableOpacity>
              </View>

              <View style={styles.iconsView}>
                <Image source={Images.footerOne} />
                <Image source={Images.footerTwo} style={styles.footerIcon} />
              </View>
              <Text style={styles.version}>{`${Device.getVersion()} (${Device.getBuildNumber()})`}</Text>
            </View>
            {
            this.props.fetching &&
            <Loader isLoading={this.props.fetching} />
          }
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </KeyboardAccessory>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching,
    response: state.login.payload,
    method: state.login.method,
    loginDateTime: state.login.loginDateTime,
    error: state.login.error,
    errorMessage: state.login.errorMsg,
    isConnected: state.network.isConnected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: data => dispatch(LoginTypes.loginRequest(data)),
    resetLoginState: () => dispatch(LoginTypes.resetLoginState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
