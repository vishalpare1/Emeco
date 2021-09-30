import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'
import styles from './Styles/ButtonOutlinedStyle'

export default class ButtonOutlined extends Component {
  static propType = {
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
    textStyle: PropTypes.object,
    text: PropTypes.string
  }

  static defaultProps = {
    onPress: () => __DEV__ && console.log('Oops! You forgot to pass onPress prop to ButtonOutlined Component'),
    text: 'Text'
  }

  render () {
    const { onPress, style, textStyle, text } = this.props
    return (
      <TouchableOpacity onPress={() => onPress()} style={{...styles.buttonOutlined, ...style}}>
        <Text style={{...styles.buttonText, ...textStyle}}>{text}</Text>
      </TouchableOpacity>
    )
  }
}
