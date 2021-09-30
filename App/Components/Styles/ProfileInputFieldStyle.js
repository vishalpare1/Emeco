import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  textInput: {
    ...Fonts.style.fontWeight600,
    flex: 4,
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  label: {
    ...Fonts.style.small,
    color: Colors.gary
  },
  inputView: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1'
  },
  updateText: {
    ...Fonts.style.fontWeight600,
    fontSize: 17,
    flex: 1,
    color: Colors.snow
  }
})
