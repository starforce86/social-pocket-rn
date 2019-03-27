import * as redux from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducers from '../reducers';
import { navMiddleware } from '../routes/AppNavigator';

const logger = createLogger();

var initialState = {
}

var store = redux.createStore(reducers, initialState, redux.compose(
  redux.applyMiddleware(logger, thunk, navMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

export default store;
