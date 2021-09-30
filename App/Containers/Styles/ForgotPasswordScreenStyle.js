import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'
import Metrics from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  backButton: {
    height: 48,
    marginTop: Metrics.doubleBaseMargin
  }
})
