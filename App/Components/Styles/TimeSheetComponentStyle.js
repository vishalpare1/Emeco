import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes'
import ApplicationStyles from '../../Themes/ApplicationStyles'

export default StyleSheet.create({
  timeSheetContainer: {
    flex: 1,
    marginTop: Metrics.doubleSection
    // marginHorizontal: Metrics.doubleBaseMargin
  },
  taskHeadingText: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    color: Colors.snow,
    borderBottomColor: Colors.snow,
    marginLeft: 10
  },
  textInput2: {
    ...Fonts.style.fontWeight600,
    color: '#64ABFF',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 0.5,
    // marginHorizontal: 5,
    padding: 5,
    flex: 1
  },
  closeIcon: {
    height: 20,
    width: 20
  },
  closeIconView: {
    marginVertical: Metrics.baseMargin,
    width: 40,
    height: 40
  },
  taskTitle: {
    ...Fonts.style.h5,
    fontWeight: 'bold',
    color: Colors.snow,
    borderBottomColor: Colors.snow
  },
  taskTimeIcon: {
    // height: 20,
    // width: 20,
    marginRight: 5,
    alignSelf: 'center'
  },
  datePickerPlaceholder: {
    ...Fonts.style.fontWeight600,
    color: Colors.snow
  },
  dateTitle: {
    ...Fonts.style.small,
    color: Colors.snow,
    opacity: 0.65
  },
  dateInputStyle: {
    ...Fonts.style.fontWeight600,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)'
  },
  submitButton: {
    height: 60,
    borderWidth: 2,
    marginHorizontal: Metrics.doubleBaseMargin,
    marginVertical: 30
  },
  buttons: {
    marginVertical: 30,
  },
  button: {
    height: 60,
    borderWidth: 2,
    marginHorizontal: Metrics.doubleBaseMargin,
    marginBottom: 30
  },
  cancelButton: {
    height: 60,
    borderWidth: 2,
    marginHorizontal: Metrics.doubleBaseMargin,
    marginTop: 0,
    marginBottom: 60
  },
  submitButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
	},
	scrollViewContainer: {
		flex: 1
	},
  ...ApplicationStyles.screen
})
