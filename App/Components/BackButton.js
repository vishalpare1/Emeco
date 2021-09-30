import React, { Component } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import Images from '../Themes/Images'
import { withNavigation } from 'react-navigation'

class BackButton extends Component {

  render () {
    const { icon, style } = this.props
    return (
      <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
        <Image source={icon ? icon : Images.backButton} style={style} />
      </TouchableOpacity>
    )
  }
}

export default withNavigation(BackButton)
