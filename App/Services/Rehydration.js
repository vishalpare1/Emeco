import ReduxPersist from '../Config/ReduxPersist'
import AsyncStorage from '@react-native-community/async-storage'
import { persistStore } from 'redux-persist'
import StartupActions from '../Redux/StartupRedux'
import DebugConfig from '../Config/DebugConfig'

const updateReducers = async (store: Object) => {
  const reducerVersion = ReduxPersist.reducerVersion
  const startup = () => store.dispatch(StartupActions.startup())

  // Check to ensure latest reducer version
  await AsyncStorage.getItem('reducerVersion').then(async (localVersion) => {
    if (localVersion !== reducerVersion) {
      if (DebugConfig.useReactotron) {
        console.tron.display({
          name: 'PURGE',
          value: {
            'Old Version:': localVersion,
            'New Version:': reducerVersion
          },
          preview: 'Reducer Version Change Detected',
          important: true
        })
      }
      // Purge store
      persistStore(store, null, startup).purge()
      await AsyncStorage.setItem('reducerVersion', reducerVersion)
    } else {
      persistStore(store, null, startup)
    }
  }).catch(async() => {
    persistStore(store, null, startup)
    await AsyncStorage.setItem('reducerVersion', reducerVersion)
  })
}

export default { updateReducers }
