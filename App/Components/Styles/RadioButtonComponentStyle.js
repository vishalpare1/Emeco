import { StyleSheet } from 'react-native'
import { Metrics } from '../../Themes'
import Fonts from '../../Themes/Fonts'

export default StyleSheet.create({
  container: {
    paddingVertical: Metrics.baseMargin,
    flexDirection: 'row',
    paddingLeft: 20
  },
  labelText: {
    ...Fonts.style.small,
    color: 'white',
    alignSelf: 'center',
    paddingLeft: 11
  },
  image: {
    width: 45,
    height: 45
  }
})
