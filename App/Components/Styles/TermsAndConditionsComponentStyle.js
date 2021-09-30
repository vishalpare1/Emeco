import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  termsAndConditionsTitleText: {
    color: Colors.snow,
    alignSelf: 'center',
    fontSize: Fonts.size.h4,
    fontWeight: 'bold',
    marginTop: Metrics.doubleSection
  },
  termsAndConditionsContainer: {
    flex: 1
  },
  webView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: Metrics.section,
    backgroundColor: 'transparent'
  },
  termsAndConditionsScollView: {
    backgroundColor: 'rgba(84, 13, 14, 0.5)',
    flex: 1,
    marginHorizontal: 30,
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.doubleBaseMargin
  },
  text: {
    color: Colors.snow
  },
  acceptButton: {
    marginTop: Metrics.doubleBaseMargin,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginBottom: Metrics.section
  },
  acceptButtonText: {
    fontWeight: 'bold'
  }
})
