import { StyleSheet } from 'react-native'
import Fonts from '../../Themes/Fonts'
import Colors from '../../Themes/Colors'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  label: {
    ...Fonts.style.small,
    color: 'rgba(255, 255, 255, 0.5)'
  },
  textInput: {
    ...Fonts.style.fontWeight600,
    color: Colors.snow,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 1,
    padding: 5
  }
})
