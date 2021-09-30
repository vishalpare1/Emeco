import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import styles from './Styles/SwitcherComponentStyle'
import RadioButtonComponent from './RadioButtonComponent'
import { Images } from '../Themes'
import { shiftDayNight } from '../Lib/Constants'

export default class SwitcherComponent extends Component {
  _onPress (selectedShift, isEditable) {
    if (isEditable) {
      if (selectedShift === 'day') {
        this.props.onSwitch(shiftDayNight.day)
      } else {
        this.props.onSwitch(shiftDayNight.night)
      }
    }
  }

  render () {
    const { label, selectedShift, isEditable } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.labelTextView}>
          <Text style={styles.labelText}> { label } </Text>
        </View>

        <View style={styles.buttonView}>
          <RadioButtonComponent
            label={'Day'}
            image={selectedShift === shiftDayNight.day ? Images.dayIconSelected : Images.dayIcon}
            onPress={() => this._onPress('day', isEditable)}
            active={selectedShift === shiftDayNight.day}
          />

          <RadioButtonComponent
            label={'Night'}
            image={selectedShift === shiftDayNight.night ? Images.nightIconSelected : Images.nightIcon}
            onPress={() => this._onPress('night', isEditable)}
            active={selectedShift === shiftDayNight.night}
          />
        </View>
      </View>
    )
  }
}
