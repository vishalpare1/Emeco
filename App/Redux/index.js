import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import configureStore from "./CreateStore";
import rootSaga from "../Sagas/";
import ReduxPersist from "../Config/ReduxPersist";
import { reducer as network } from "react-native-offline";

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
	nav: require("./NavigationRedux").reducer,
	github: require("./GithubRedux").reducer,
	search: require("./SearchRedux").reducer,
	login: require("./LoginRedux").reducer,
	signUp: require("./SignupRedux").reducer,
	termsAndConditions: require("./TermsAndConditionsRedux").reducer,
	privacyPolicy: require("./PrivacyPolicyRedux").reducer,

	resetPassword: require("./ResetPasswordRedux").reducer,
	updateDefaultPassword: require("./UpdateDefaultPasswordRedux").reducer,
	timeSheets: require("./TimeSheetRedux").reducer,

	timeSheetFilters: require("./TimeSheetFiltersRedux").reducer,
	syncData: require("./SyncDataRedux").reducer,
	network,
});

export default () => {
	let finalReducers = reducers;
	// NOTE: If rehydration is on use persistReducer otherwise default combineReducers
	if (ReduxPersist.active) {
		const persistConfig = ReduxPersist.storeConfig;
		finalReducers = persistReducer(persistConfig, reducers);
	}

	let { store, sagasManager, sagaMiddleware } = configureStore(
		finalReducers,
		rootSaga
	);

	if (module.hot) {
		module.hot.accept(() => {
			const nextRootReducer = require("./").reducers;
			store.replaceReducer(nextRootReducer);

			const newYieldedSagas = require("../Sagas").default;
			sagasManager.cancel();
			sagasManager.done.then(() => {
				sagasManager = sagaMiddleware.run(newYieldedSagas);
			});
		});
	}

	return store;
};
