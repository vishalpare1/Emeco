import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import styles from './Styles/ProfileInputFieldStyle'

export default class ProfileInputField extends Component {
  // Prop type warnings
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,
    isEditable: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
    showUpdateButton: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    setRef: PropTypes.func,
    updatePassword: PropTypes.func,
    labelStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    placeholderTextColor: PropTypes.string
  }

  // Defaults for props
  static defaultProps = {
    label: '',
    placeholder: '',
    placeholderTextColor: '#BD889B',
    keyboardType: 'default',
    isEditable: true,
    secureTextEntry: false,
    showUpdateButton: false,
    value: ''
  }

  render () {
    const {
      value,
      isEditable,
      label,
      keyboardType,
      secureTextEntry,
      onChange,
      updatePassword,
      showUpdateButton,
      labelStyle,
      placeholder,
      inputStyle,
      placeholderTextColor,
      onFocus,
      setRef
    } = this.props

    return (
      <View style={styles.container}>
        {
          value !== '' &&
          <Text style={{...styles.label, ...labelStyle}}> { label } </Text>
        }

        <View style={styles.inputView}>
          <TextInput
            autoCorrect={false}
            style={{...styles.textInput, ...inputStyle}}
            onChangeText={(val) => onChange(val)}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            editable={isEditable}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onFocus={(event: Event) => onFocus && onFocus(event)}
            ref={(ref) => setRef && setRef(ref)}
          />
          {
            showUpdateButton &&
            <TouchableOpacity onPress={() => updatePassword()}>
              <Text style={styles.updateText}> UPDATE </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
}
