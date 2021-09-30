import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Animated, Keyboard, Platform } from 'react-native'
import styles from './Styles/KeyboardAccessoryStyle'
import KeyboardToolbar from './KeyboardToolbar'

export default class KeyboardAccessory extends Component {
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
      bottomOffset: new Animated.Value(0.1),
      height: 0,
      keyboardHeight: 0,
      keyboardIsShown: false,
      pickerIsShown: false
    }
  }

  componentWillMount () {
    if (Platform.OS == 'ios') {
      this.keyboardShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow)
      this.keyboardHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide)
    } else {
      this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
      this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    }
  }

  componentWillUnmount () {
    this.keyboardShowListener.remove()
    this.keyboardHideListener.remove()
  }

  _keyboardWillShow = (event) => {
    if (!this.state.keyboardIsShown) {
      Animated.timing(this.state.bottomOffset, {
        toValue: event.endCoordinates.height,
        duration: (event && event.duration) || 200
      }).start(() => {
        this.setState({keyboardHeight: event.endCoordinates.height, keyboardIsShown: true})
      })
    }
  }

  _keyboardWillHide = (event) => {
    Animated.timing(this.state.bottomOffset, {
      toValue: 0,
      duration: (event && event.duration) || 200
    }).start(() => {
      this.setState({keyboardHeight: 0, keyboardIsShown: false})
    })
  }

  _keyboardDidShow = (event) => {
    Animated.timing(this.state.bottomOffset, {
      toValue: 0.1,
      duration: (event && event.duration) || 200
    }).start(() => {
      this.setState({keyboardHeight: event.endCoordinates.height, keyboardIsShown: true})
    })
  }

  _keyboardDidHide = (event) => {
    Animated.timing(this.state.bottomOffset, {
      toValue: 0.1,
      duration: (event && event.duration) || 200
    }).start(() => {
      this.setState({keyboardHeight: 0, keyboardIsShown: false})
    })
  }

  renderToolbar = () => (
    <KeyboardToolbar activeIndex={this.props.activeIndex} totalFields={this.props.totalFields} onPreviousPress={this.props.onPreviousPress} onNextPress={this.props.onNextPress} onDonePress={this.props.onDonePress} />
  )

  render () {
    const { onStartShouldSetResponderCapture } = this.props
    const { keyboardIsShown } = this.state
    let containerHeight = Platform.OS === 'ios'
    ? (keyboardIsShown ? this.state.height - this.state.keyboardHeight - 50 : this.state.height)
    : (keyboardIsShown ? this.state.height - 50 : this.state.height)

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
        onLayout={({nativeEvent}) => { this.setState({height: nativeEvent.layout.height}) }}
        onStartShouldSetResponderCapture={() => onStartShouldSetResponderCapture && onStartShouldSetResponderCapture()}
      >
        <View style={[this.props.contentContainerStyle, {width: '100%', height: containerHeight}]}>
          {this.props.children}
        </View>
        <Animated.View style={[styles.toolbarContainer, {bottom: this.state.bottomOffset, opacity: keyboardIsShown ? 1 : 0}]} pointerEvents={keyboardIsShown ? 'auto' : 'none'}>
          {this.renderToolbar()}
        </Animated.View>
      </View>
    )
  }
}
