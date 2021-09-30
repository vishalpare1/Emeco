import React, { Component } from 'react'
import { View, Text, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import styles from './Styles/TermsAndConditionsComponentStyle'
import ButtonOutlined from '../Components/ButtonOutlined'

export default class TermsAndConditionsComponent extends Component {
  render () {
    const { acceptTerms, title, acceptButtonText, response } = this.props
    let html = '<html><head><meta name="viewport" content="width=500, initial-scale=1"/></head><body><div style="color: white; padding: 17px; background-color: rgba(0, 0, 0, 0.49)">' + response + '</div></body></html>'

    return (
      <View style={styles.container}>
        <Text style={styles.termsAndConditionsTitleText}> { title } </Text>
        <View style={styles.termsAndConditionsContainer}>
          <WebView
            source={{html: html}}
            style={styles.webView}
            scalesPageToFit={(Platform.OS === 'ios') ? false : true}
          />
        </View>
        <ButtonOutlined
          text={acceptButtonText}
          onPress={() => acceptTerms()}
          style={styles.acceptButton}
          textStyle={styles.acceptButtonText}
        />
      </View>
    )
  }
}
