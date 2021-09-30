import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  scrollContainer: {
    flex: 1
  },
  inputView: {
    marginHorizontal: 26,
    marginTop: 38
  },
  labelStyle: {
    color: '#BD889B'
  },
  updateButton: {
    borderWidth: 2,
    borderColor: Colors.snow,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 30,
    alignSelf: 'flex-start'
  },
  updateButtonText: {
    ...Fonts.style.input,
    color: Colors.snow,
    fontWeight: 'bold'
  },
  inputStyle: {
    fontWeight: 'bold',
    color: 'white'
  },
  mainHeading: {
    ...Fonts.style.titleFont,
    fontSize: 32,
    color: Colors.snow,
    marginTop: 6,
    marginLeft: 15
  },
  profileContainer: {
		flex: 1,
    height: '100%'
  },
  ...ApplicationStyles.screen
})
