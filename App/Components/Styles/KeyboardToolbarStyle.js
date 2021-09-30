import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  toolbar: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  toolbarLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toolbarItemText: {
    fontSize: 16,
    color: '#007FFF'
  },
  toolbarItemDisabledText: {
    fontSize: 16,
    color: 'grey',
    padding: 10
  },
  nextButton: {
    padding: 10
  },
  prevButton: {
    padding: 10
  }
})
