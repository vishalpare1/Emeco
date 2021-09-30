import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import styles from './Styles/EmecoIconHeaderComponentStyle'
import Images from '../Themes/Images'

export default class EmecoIconHeaderComponent extends Component {
  // Prop type warnings
  static propTypes = {
    // someProperty: PropTypes.object,
    // someSetting: PropTypes.bool.isRequired,
  }

  // Defaults for props
  static defaultProps = {
    // someSetting: false
  }

  render () {
    return (
      <View style={styles.container}>
        <Image source={Images.emecoLogo} style={styles.logo} />
        <Text style={styles.text}>TIMESHEETS</Text>
      </View>
    )
  }
}
