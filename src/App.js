import React from "react";
import { Provider } from "react-redux";
import { StackNavigator, DrawerNavigator } from "react-navigation";
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

const Drawer = DrawerNavigator(
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

const App = StackNavigator(
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

export default () =>
  <StyleProvider style={getTheme(variables)}>
    <Provider store={store}>
      <Root>
        <App />
      </Root>
    </Provider>
  </StyleProvider>;

