import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  },
  text: {
    color: '#F8AD95',
    fontSize: 14,
    fontWeight: 'bold'
  },
  dateInput: {
    ...Fonts.style.fontWeight600,
    borderColor: 'transparent',
    alignItems: 'flex-start',
    margin: 0,
    borderBottomColor: '#F8AD95',
    paddingLeft: 5
  },
  dateText: {
    ...Fonts.style.fontWeight600,
    color: 'white'
  },
  dateIcon: {
    position: 'absolute',
    right: 0,
    height: 6,
    width: 11
  },
  placeholderText: {
    // color: '#F8AD95',
    fontSize: Fonts.size.h6
  },
  datePcker: {
    width: '100%'
  },
  textInput: {
    ...Fonts.style.fontWeight600,
    color: Colors.snow,
    borderBottomColor: Colors.snow,
    borderBottomWidth: 0.5,
    padding: 8
  }
})
