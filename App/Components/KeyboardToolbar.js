import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/KeyboardToolbarStyle'

export default class KeyboardToolbar extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    const {activeIndex, totalFields} = this.props

    var shouldShowPrev = true
    var shouldShowNext = true

    if (activeIndex === 0) {
      shouldShowPrev = false
      shouldShowNext = true
    } else if (activeIndex === totalFields - 1) {
      shouldShowPrev = true
      shouldShowNext = false
    } else {
      shouldShowPrev = true
      shouldShowNext = true
    }
    return (
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>
          {
            shouldShowPrev &&
            <TouchableOpacity onPress={this.props.onPreviousPress} style={styles.prevButton}>
              <Text style={styles.toolbarItemText}>Prev</Text>
            </TouchableOpacity>
          }
          {
            !shouldShowPrev &&
            <Text style={styles.toolbarItemDisabledText}>Prev</Text>
          }
          {
            shouldShowNext &&
            <TouchableOpacity style={styles.nextButton} onPress={this.props.onNextPress}>
              <Text style={styles.toolbarItemText}>Next</Text>
            </TouchableOpacity>
          }
          {
            !shouldShowNext &&
            <Text style={styles.toolbarItemDisabledText}>Next</Text>
          }
        </View>
        <TouchableOpacity onPress={this.props.onDonePress}>
          <Text style={styles.toolbarItemText}>Done</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
