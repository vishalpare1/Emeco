import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, TextInput, Text, Platform } from 'react-native'
import styles from './Styles/DropDownComponentStyle'
import Fonts from '../Themes/Fonts'
import SearchableDropdown from 'react-native-searchable-dropdown'

export default class DropDownComponent extends Component {
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

  constructor (props) {
    super(props)
    this.state = {
      textChanged: false
    }
  }

  render () {
    const {
      label,
      data,
      onChange,
      onChangeText,
      disabled,
      value,
      containerStyle,
      inputFieldMargin,
      placeholder,
      onFocusDropdown,
      onLayout,
      isClosed,
      setRef,
      setEnableScrollViewScrollState,
      multiline,
      numberOfLines,
      width
    } =
     this.props

    return (
      <View style={styles.container} onLayout={(nativeEvent) => onLayout && onLayout(nativeEvent)}>
        {
          value ?
          <Text style={{...styles.label,
            marginLeft: inputFieldMargin === 'left' && disabled ? 10 : 0,
            marginRight: inputFieldMargin === 'right' && disabled ? 10 : 0
          }}> { label } </Text> : null
        }
        {
          !disabled &&
          <SearchableDropdown
            onItemSelect={item => {
              if (onChangeText) {
                onChangeText(item.name)
              }
              if (onChange) {
                onChange(item)
              }
              this.setState({textChanged: false})
            }}
            containerStyle={containerStyle}
            textInputStyle={styles.textInputStyle}
            itemStyle={styles.itemStyle}
            itemTextStyle={styles.itemTextStyle}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={data}
            placeholder={value ? value : placeholder}
            resetValue={!value && !this.state.textChanged}
            underlineColorAndroid='transparent'
            placeholderTextColor={value ? '#fff' : '#999999'}
            onFocus={(event) => { onFocusDropdown && onFocusDropdown(event) }}
            ref={ref => setRef && setRef(ref && ref.input)}
            setEnableScrollViewScrollState={state => setEnableScrollViewScrollState(state)}
            onTextChange={text => {
              if (text !== value) {
                this.setState({textChanged: true})
              }
            }}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
        }
        {
          disabled &&
          <TextInput
            style={[styles.textInput,
              {
                marginLeft: inputFieldMargin === 'left' ? 10 : 0,
                marginRight: inputFieldMargin === 'right' ? 10 : 0,
                marginTop: Platform.OS === 'ios' ? 10 : 0,
                width: typeof width === 'number' ? width - 5 : width,
              }]}
            value={value}
            editable={false}
            multiline={multiline}
            numberOfLines={numberOfLines}
          />
        }

      </View>
    )
  }
}
