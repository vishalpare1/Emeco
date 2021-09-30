import { StyleSheet, Platform } from 'react-native'
import Colors from '../../Themes/Colors'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {

  },
  label: {
    ...Fonts.style.small,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  textInput: {
    ...Fonts.style.fontWeight600,
    color: Colors.snow,
    borderBottomColor: Colors.snow,
    borderBottomWidth: 0.5,
    padding: Platform.OS === 'ios' ? 8 : 0
  },
  itemStyle: {
    padding: 10,
    backgroundColor: '#EF4E2C',
    borderColor: '#F7A694',
    borderWidth: 1
  },
  itemTextStyle: {
    ...Fonts.style.fontWeight600,
    color: '#FFFFFF'
  },
  textInputStyle: {
    ...Fonts.style.fontWeight600,
    padding: 8,
    color: '#FFFFFF'
  }
})
