import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import styles from './Styles/TimeSheetInputFieldStyle'

export default class TimeSheetInputField extends Component {
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
    updatePassword: PropTypes.func,
    labelStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    placeholderTextColor: PropTypes.string,
    ref: PropTypes.string,
    onFocus: PropTypes.func,
    setRef: PropTypes.func,
    onLayout: PropTypes.func
  }

	// Defaults for props
  static defaultProps = {
    label: '',
    placeholder: '',
    placeholderTextColor: 'rgba(255, 255, 255, 0.5)',
    keyboardType: 'default',
    isEditable: true,
    multiline: false,
    secureTextEntry: false,
    showUpdateButton: false,
    value: '',
    ref: ''
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
      multiline,
      isFromCollapsible,
      setRef,
      onFocus,
      onLayout
    } = this.props

    return (
      <View style={isFromCollapsible ? {} : styles.container}>
        {
          value !== '' &&
          <Text style={{...styles.label, ...labelStyle}}> { label } </Text>
        }

        <View style={styles.inputView} onLayout={(nativeEvent) => onLayout && onLayout(nativeEvent)}>
          <TextInput
            style={{...styles.textInput, ...inputStyle}}
            onChangeText={(val) => onChange(val)}
            value={value}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            editable={isEditable}
            placeholder={placeholder}
            autoCompleteType="off"
            autoCorrect={false}
            placeholderTextColor={placeholderTextColor}
            ref={ref => setRef && setRef(ref)}
            multiline={multiline}
            onFocus={(event: Event) => onFocus && onFocus(event)}
          />
        </View>
      </View>
    )
  }
}
