import { StyleSheet, Dimensions } from 'react-native'
import Fonts from '../../Themes/Fonts'
const { height } = Dimensions.get('window')

export default StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: height * 0.25,
    paddingHorizontal: '15%',
    justifyContent: 'flex-end'
  },
  logo: {
    // marginTop: 114
  },
  text: {
    ...Fonts.style.h1,
    color: '#FFFFFF',
    fontWeight: '300',
    marginLeft: 6,
    marginBottom: 30
  }
})
