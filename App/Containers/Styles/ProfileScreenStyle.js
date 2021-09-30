import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  profileView: {
    marginHorizontal: 26,
    marginTop: 38
  },
  mainHeading: {
    ...Fonts.style.titleFont,
    fontSize: 32,
    color: Colors.snow,
    marginTop: 6,
    marginLeft: 15
  },
  saveButton: {
    borderWidth: 2,
    borderColor: Colors.snow,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 30,
    alignSelf: 'flex-start'
  },
  saveButtonText: {
    ...Fonts.style.input,
    color: Colors.snow,
    fontWeight: 'bold'
  },
  backButtonImage: {
  },
  profileContainer: {
		flex: 1,
    height: '100%'
  },
  inputStyle: {
    color: Colors.snow
  },
  labelStyle: {
    color: '#BD889B'
  },
  dateLabelStyle: {
    paddingLeft: 3,
    color: '#BD889B'
  },
  version: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
  },
})
