import { StyleSheet } from 'react-native'
import { Fonts, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    ...Fonts.style.fontWeight600,
    fontSize: 16,
    padding: 10,
    color: Colors.text
  },
  labelText: {
    ...Fonts.style.description,
    paddingVertical: Metrics.baseMargin,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    fontWeight: 'bold'
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.46)'
  }
})
