import { StyleSheet } from 'react-native'
import { Metrics } from '../../Themes/'
import ApplicationStyles from '../../Themes/ApplicationStyles'

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  loginScreenBackground: {
    width: '100%',
    height: '100%'
  },
  inputField: {
    backgroundColor: '#540D12',
    height: 48,
    marginVertical: 15,
    color: 'white'
  },
  subContainer: {
    marginLeft: '10%',
    marginRight: '10%'
  },
  forgetPasswordButton: {
    height: 48,
    width: 130,
    alignItems: 'center',
    marginTop: Metrics.doubleBaseMargin
  },
  loginFooterView: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40
  },
  separatorView: {
    height: 1,
    backgroundColor: 'black',
    marginTop: 20
  },
  buttonUnderline: {
    backgroundColor: 'white',
    height: 1
  },
  iconsView: {
    flexDirection: 'row',
    marginVertical: 40
  },
  footerIcon: {
    marginLeft: 30
  },
  signupButton: {
    height: 40,
    justifyContent: 'center'
  },
  keyboardView: {
    marginHorizontal: '15%'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 31
  },
  loginButtonText: {
    fontWeight: 'bold'
  },
  textField: {
    height: 48
	},
	scrollViewContainer: {
		flex: 1
	},
  version: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  ...ApplicationStyles.screen
})
