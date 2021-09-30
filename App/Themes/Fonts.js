import {Platform} from 'react-native'

const type = {
  base: 'Proxima Nova',
  bold600: 'Proxima Nova Semibold',
  bold900: 'Proxima Nova Black',
  emphasis: 'Proxima Nova Regular Italic'
}

const fontWeight900 = {
  ...Platform.select({
    ios: {
      fontWeight: '900',
      fontFamily: type.base
    },
    android: {
      fontFamily: type.bold900
    }
  })
}

const fontWeight600 = {
  ...Platform.select({
    ios: {
      fontWeight: '600',
      fontFamily: type.base
    },
    android: {
      fontFamily: type.bold600
    }
  })
}

const size = {
  h1: 36,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 17,
  medium: 16,
  small: 14,
  extraSmall: 12,
  tiny: 8.5
}

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontFamily: type.base,
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.base,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  extraSmall: {
    fontFamily: type.base,
    fontSize: size.extraSmall,
    fontWeight: 'bold'
  },
  small: {
    fontFamily: type.base,
    fontSize: size.small,
    fontWeight: 'bold'
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  },
  titleH1: {
    ...fontWeight900,
    color: 'red',
    fontSize: size.h1,
    textAlign: 'left'
  },
  titleFont: {
    ...fontWeight900,
    color: 'white',
    fontSize: size.h3,
    textAlign: 'left'
  },
  fieldTitle: {
    ...fontWeight600,
    color: 'white',
    fontSize: size.medium,
    textAlign: 'left'
  },
  buttonTitle: {
    color: 'white',
    fontFamily: type.base,
    fontSize: size.medium,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputField: {
    ...fontWeight900,
    color: 'white',
    fontSize: 30
  },
  buttonTitleBold: {
    ...fontWeight900,
    color: 'white',
    fontSize: size.medium,
    textAlign: 'center'
  },
  fontWeight600: {
    ...fontWeight600,
    fontSize: size.h5
  },
  fontWeight900: {
    ...fontWeight900,
    fontSize: size.h3
  }
}

export default {
  type,
  size,
  style
}
