import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import styles from './Styles/LoaderStyle'

const Loader = ({isLoading, top, style}) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator
      animating={isLoading}
      color={'#EFEFEF'}
      size={'small'} />
  </View>
)

export default Loader
