import { legacy_createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import sessionReducer from './session';
import walletReducer from './wallet';
import stockReducer from './stock';

const appReducer = combineReducers({
    session: sessionReducer,
    wallet: walletReducer,
    stock: stockReducer,
});

const rootReducer = (state, action) => {
    if (action.type == 'session/removeUser') {
        return appReducer(undefined, 'RESET')
    }
    return appReducer(state, action)
}
let enhancer;

if (process.env.NODE_ENV === "production") {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = require('redux-logger').default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return legacy_createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
