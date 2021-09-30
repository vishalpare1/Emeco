import React, { Component } from 'react'
import { Alert, SafeAreaView, Text, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/PrivacyPolicyScreenStyle'
import { Images } from '../Themes'
import TermsAndConditionsComponent from '../Components/TermsAndConditionsComponent'
import PrivacyPolicyActions from '../Redux/PrivacyPolicyRedux'
import LoginActions from '../Redux/LoginRedux'
import Loader from '../Components/Loader';

class PrivacyPolicyScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPrivacyAccepted: false,
      alertPresent: false
    }
    this._updateUser = this._updateUser.bind(this)
  }

  componentDidMount () {
    this.props.getPrivacyPolicy()
  }

  componentWillReceiveProps (nextProps) {
    const { fetchingPolicy, errorPolicy, responsePolicy, response, errorUpdating, errorMessage, resetLoginState } = nextProps

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
    } else if (response && this.state.isPrivacyAccepted) {
      this.props.navigation.navigate('TimesheetsListScreen')
    } else {
      this.setState({
        fetchingPolicy,
        errorPolicy,
        responsePolicy
      })
    }
  }

  _updateUser () {
    const { response, responsePolicy, updateUser, navigation } = this.props
    const { getParam } = navigation
    const eulaId = getParam('eula_id')

    var data = {
      privacy_id: responsePolicy.id
    }

    if (eulaId) {
      data['eula_id'] = eulaId
    }

    const staffId = response.data.id

    updateUser(data, staffId, response.headers)

    this.setState({
      isPrivacyAccepted: true
    })
  }

  render () {
    const { fetchingPolicy, errorPolicy, responsePolicy } = this.state
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ImageBackground source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        { fetchingPolicy && <Loader isLoading={fetchingPolicy} />}
        { responsePolicy &&

          <TermsAndConditionsComponent
            acceptTerms={this._updateUser}
            fetching={fetchingPolicy}
            error={errorPolicy}
            title={'Privacy Policy'}
            acceptButtonText={'Yes, I Accept'}
            response={responsePolicy.privacy_text}
          />
        }
        {
            errorPolicy && <Text> Sorry! An error occured while trying to fetch Privacy Policy</Text>
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ privacyPolicy, login }) => {
  return {
    fetchingPolicy: privacyPolicy.fetching,
    errorPolicy: privacyPolicy.error,
    responsePolicy: privacyPolicy.payload,

    updatingUser: login.fetching,
    errorUpdating: login.error,
    errorMessage: login.errorMsg,

    response: login.payload
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPrivacyPolicy: () => dispatch(PrivacyPolicyActions.getPrivacyPolicy()),
    updateUser: (data, staffId, headers) => dispatch(LoginActions.updateUser(data, staffId, headers)),
    resetLoginState: () => dispatch(LoginActions.resetLoginState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicyScreen)
