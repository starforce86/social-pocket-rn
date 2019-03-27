import React from "react";
import { Provider } from "react-redux";
import { StyleProvider, Root } from "native-base";

import store from './config/store';
import AppWithNavigationState from './routes/AppNavigator';
import getTheme from "../native-base-theme/components";
import variables from "../native-base-theme/variables/commonColor";

export default () =>
  <StyleProvider style={getTheme(variables)}>
    <Provider store={store}>
      <Root>
        <AppWithNavigationState />
      </Root>
    </Provider>
  </StyleProvider>;

