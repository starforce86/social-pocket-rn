import React from "react";
import { Provider, connect } from "react-redux";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import { reduxifyNavigator, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { StyleProvider, Root } from "native-base";

import store from './config/store';
import getTheme from "../native-base-theme/components";
import variables from "../native-base-theme/variables/commonColor";
import Login from "./screens/Login/";
import ForgotPassword from "./screens/ForgotPassword";
import SignUp from "./screens/SignUp/";
import Home from "./screens/Home/";
import Sidebar from "./screens/Sidebar";
import Feedback from "./screens/Feedback/";
import Profile from "./screens/Profile/";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    Feedback: { screen: Feedback },
    Profile: { screen: Profile }
  },
  {
    initialRouteName: "Home",
    contentComponent: props => <Sidebar {...props} />
  }
);

export const AppNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    SignUp: { screen: SignUp },
    ForgotPassword: { screen: ForgotPassword },
    Drawer: { screen: Drawer }
  },
  {
    index: 0,
    initialRouteName: "Login",
    headerMode: "none"
  }
);

export const navMiddleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);

const App = reduxifyNavigator(AppNavigator, "root");
const mapStateToProps = state => ({
  state: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

export default () =>
  <StyleProvider style={getTheme(variables)}>
    <Provider store={store}>
      <Root>
        <AppWithNavigationState />
      </Root>
    </Provider>
  </StyleProvider>;

