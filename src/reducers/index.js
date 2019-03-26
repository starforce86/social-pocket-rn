import { combineReducers } from 'redux';
import { reducer as formReducer } from "redux-form";

import {authorizeReducer} from './authorizeReducer';
import homeReducer from "../screens/Home/reducer";

export default combineReducers({
  form: formReducer,
  authorize: authorizeReducer,
  homeReducer
});