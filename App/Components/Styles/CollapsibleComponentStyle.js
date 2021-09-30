import { StyleSheet } from 'react-native'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import Colors from '../../Themes/Colors'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  dropDownView: {
  	flexDirection: 'row',
    paddingTop: 30
  },
  textInputUnderlined: {
    ...Fonts.style.fontWeight600,
    color: Colors.snow,
    borderBottomColor: Colors.snow,
    borderBottomWidth: 0.5,
    padding: 8
  },
  pickerItemStyle: {
    fontSize: Fonts.size.regular,
    color: '#F7A694'
  },
  datePickerPlaceholder: {
    ...Fonts.style.fontWeight600,
    color: Colors.snow
  },
  dateInputStyle: {
    ...Fonts.style.fontWeight600,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)'
  },
  dateTitle: {
    ...Fonts.style.small,
    color: '#999999'
  },
	...ApplicationStyles.screen,
	startEndDate: {
		flexDirection: 'row'
	},
	jobCostDropDownContanier: {
		paddingTop: 25
	}
})
