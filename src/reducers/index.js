import { combineReducers } from 'redux';

import {authorizeReducer} from './authorizeReducer';
import homeReducer from "../screens/Home/reducer";

export default combineReducers({
  authorize: authorizeReducer,
  homeReducer
});