import React, { Component } from 'react'
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native'
import styles from './Styles/RadioButtonComponentStyle'

export default class RadioButtonComponent extends Component {
  render () {
    const { label, image, onPress } = this.props

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback style={styles.image} onPress={() => onPress()}>
          <Image
            style={styles.image}
            source={image}
          />
        </TouchableWithoutFeedback>

        <Text style={styles.labelText}> { label } </Text>

      </View>
    )
  }
}
