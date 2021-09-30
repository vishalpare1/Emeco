import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput } from 'react-native'
import styles from './Styles/TextInputStyle'

export default class EMTextInput extends Component {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    containerStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    keyboardType: PropTypes.string,
    autoCapitalize: PropTypes.string,
    value: PropTypes.string,
    editable: PropTypes.bool,
    inputContainerStyle: PropTypes.object
  }

  static defaultProps = {
    onChange: () => __DEV__ && console.log('Please pass a function for onChange event'),
    onFocus: () => __DEV__ && console.log('Please pass a function for onFocus event'),
    keyboardType: 'default',
    autoCapitalize: 'sentences',
    value: '',
    editable: true
  }

  render () {
    const { value, editable, secureTextEntry, label, placeholder, onFocus, onChange, containerStyle, labelStyle, inputStyle, keyboardType, autoCapitalize, inputContainerStyle, setRef, onLayout, onKeyPress } = this.props
    return (
      <View style={{...styles.container, ...containerStyle}} onLayout={(nativeEvent) => onLayout && onLayout(nativeEvent)}>
        {label && <Text style={{...styles.labelText, ...labelStyle}}>{label}</Text> }
        <View style={{...styles.inputContainer, ...inputContainerStyle}}>
          <TextInput
            placeholder={placeholder}
            onFocus={(event: Event) => onFocus(event)}
            onChangeText={(e) => onChange(e)}
            onKeyPress={({nativeEvent}) => onKeyPress && onKeyPress(nativeEvent.key)}
            style={{...styles.textInput, ...inputStyle}}
            autoCompleteType="off"
            autoCorrect={false}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            value={value}
            editable={editable}
            ref={(ref) => setRef && setRef(ref)}
          />
        </View>
      </View>
    )
  }
}
