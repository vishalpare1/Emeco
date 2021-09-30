import React, { Component } from 'react'
import { ScrollView, SafeAreaView, View, Text, Alert, ImageBackground, TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/ForgotPasswordScreenStyle'
import Images from '../Themes/Images'
import ButtonOutlined from '../Components/ButtonOutlined'
import EMTextInput from '../Components/EMTextInput'
import { Metrics } from '../Themes'
import ResetPasswordTypes from '../Redux/ResetPasswordRedux'
import Loader from '../Components/Loader'
import EmecoIconHeaderComponent from '../Components/EmecoIconHeaderComponent'
import Fonts from '../Themes/Fonts'

class ForgotPasswordScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: ''
    }
    this._handleResetPassword = this._handleResetPassword.bind(this)
    this._dispatchResetRequest = this._dispatchResetRequest.bind(this)
  }

  _handleResetPassword () {
    this.state.email
    ? this._dispatchResetRequest()
    : Alert.alert('Oops!', 'It seems like you forgot to enter an email address!')
  }

  _dispatchResetRequest () {
    this.props.resetPasswordRequest(this.state.email)
  }

  componentWillReceiveProps (nextProps) {
    const { response, isFetching, errorMsg } = nextProps
    this.setState({ response, isFetching, errorMsg })
    if (!isFetching) {
      if (errorMsg) {
        Alert.alert('Oops!', errorMsg)
      } else {
        Alert.alert('Success!', response.message)
        this.setState({ email: '' })
      }
    }
  }

  render () {
    const { isFetching } = this.state
    return (
      <View style={styles.mainContainer}>
        <EmecoIconHeaderComponent />
        <SafeAreaView style={styles.mainContainer}>
          <ImageBackground source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />

          <ScrollView style={styles.container}>

            <View style={{marginHorizontal: '15%'}} >
              <Text style={[Fonts.style.titleFont, {marginVertical: 20}]}>Forgot Password</Text>
              <EMTextInput
                label={'Your Email Address'}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                disabled={isFetching}
                value={this.state.email}
                inputStyle={{height: 48}}
                onChange={email => this.setState({ email })}
              />

              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15}}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => { this.props.navigation.goBack() }}>
                  <Text style={[Fonts.style.buttonTitle, {color: '#fff', marginTop: 12}]}>Go Back</Text>
                </TouchableOpacity>

                <ButtonOutlined
                  onPress={this._handleResetPassword}
                  text={'Continue'}
                  style={{marginTop: Metrics.doubleBaseMargin}}
                  textStyle={{fontWeight: 'bold'}} />
              </View>

            </View>

          </ScrollView>
          { isFetching && <Loader style={{ position: 'absolute', width: '100%', height: '100%', flex: 1 }} isLoading={isFetching} /> }
        </SafeAreaView>
      </View>
    )
  }
}

const mapStateToProps = ({ resetPassword }) => {
  return {
    isFetching: resetPassword.fetching,
    errorMsg: resetPassword.error,
    response: resetPassword.payload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetPasswordRequest: email => dispatch(ResetPasswordTypes.resetPasswordRequest(email))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen)
