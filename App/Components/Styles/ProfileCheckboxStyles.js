import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  checkbox: {
    alignSelf: "center",
    marginLeft: -6,
  },
  label: {
    ...Fonts.style.fontWeight600,
    margin: 8,
    color: Colors.gary,
  },
});
