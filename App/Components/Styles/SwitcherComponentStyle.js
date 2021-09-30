import { StyleSheet } from 'react-native'
import { Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 1,
    paddingBottom: 2
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  labelText: {
    ...Fonts.style.fontWeight600,
    color: 'white'
  },
  labelTextView: {
    justifyContent: 'center'
  }
})
