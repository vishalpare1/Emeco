import { StyleSheet } from 'react-native'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Metrics from '../../Themes/Metrics'

export default StyleSheet.create({
  signupFooterView: {
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
  loginButton: {
    height: 40,
    justifyContent: 'center'
  },
  buttonUnderline: {
    backgroundColor: 'white',
    height: 1
  },
  textField: {
    height: 48
  },
  keyboardView: {
    flex: 1
  },
  submitButton: {
    marginTop: Metrics.doubleBaseMargin,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 31
  },
  submitButtonText: {
    fontWeight: 'bold'
	},
	scrollViewContainer: {
		flex: 1
	},
  ...ApplicationStyles.screen
})
