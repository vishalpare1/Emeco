import React, { Component } from 'react'
import { SafeAreaView, ImageBackground, Text, Alert } from 'react-native'
import { connect } from 'react-redux'
import TermsAndConditionsActions from '../Redux/TermsAndConditionsRedux'
import LoginActions from '../Redux/LoginRedux'
import styles from './Styles/TermsAndConditionsScreenStyle'
import TermsAndConditionsComponent from '../Components/TermsAndConditionsComponent'
import { Images } from '../Themes'
import Loader from '../Components/Loader';

class TermsAndConditionsScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      fetchingTerms: null,
      errorTerms: null,
      responseTerms: null,
      alertPresent: false,
      isTermsAccepted: false
    }

    this._updateUser = this._updateUser.bind(this)
  }

  componentDidMount () {
    this.props.getLatestTerms()
  }

  componentWillReceiveProps (nextProps) {
    const { fetchingTerms, errorTerms, responseTerms, response, errorUpdating, errorMessage, resetLoginState } = nextProps

    if (errorUpdating && errorMessage !== '' && !this.state.alertPresent) {
      this.setState({ alertPresent: true })
      Alert.alert(
        'Error',
        errorMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              this.setState({ alertPresent: false })
              resetLoginState()
            }
          }
        ],
        { cancelable: false }
      )
    } else if (responseTerms && this.state.isTermsAccepted) {
      this.props.navigation.navigate('TimesheetsListScreen')
    }

    this.setState({
      fetchingTerms,
      errorTerms,
      responseTerms
    })
  }

  _updateUser () {
    const { response, responseTerms, updateUser, navigation } = this.props
    const { getParam } = navigation
    const deprecated_privacy = getParam('deprecated_privacy')

    let data = {
      eula_id: responseTerms.id
    }

    const staffId = response.data.id

    if (deprecated_privacy) {
      navigation.navigate('PrivacyPolicyScreen', {eula_id: responseTerms.id})
    } else {
      updateUser(data, staffId, response.headers)
      this.setState({
        isTermsAccepted: true
      })
    }
  }

  render () {
    const { fetchingTerms, errorTerms, responseTerms } = this.state

    return (
      <SafeAreaView style={styles.mainContainer}>
        <ImageBackground source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        { fetchingTerms && <Loader isLoading={fetchingTerms} />}
        { responseTerms &&

          <TermsAndConditionsComponent
            acceptTerms={this._updateUser}
            fetching={fetchingTerms}
            error={errorTerms}
            title={'Terms & Conditions'}
            acceptButtonText={'Yes, I Accept'}
            response={responseTerms.eula_text}
          />
        }
        {
            errorTerms && <Text> Sorry! An error occured while trying to fetch Terms &amp; Conditions</Text>
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ termsAndConditions, login }) => {
  return {
    fetchingTerms: termsAndConditions.fetching,
    errorTerms: termsAndConditions.error,
    responseTerms: termsAndConditions.payload,

    fetchingUser: login.fetching,
    errorUpdating: login.error,
    errorMessage: login.errorMsg,

    response: login.payload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getLatestTerms: () => dispatch(TermsAndConditionsActions.getTerms()),
    updateUser: (data, staffId, headers) => dispatch(LoginActions.updateUser(data, staffId, headers)),
    resetLoginState: () => dispatch(LoginActions.resetLoginState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditionsScreen)
