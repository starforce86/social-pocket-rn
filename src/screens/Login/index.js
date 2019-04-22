import React, { Component } from "react";
import { NavigationActions, StackActions } from "react-navigation";
import { Image, ImageBackground, Platform, StatusBar } from "react-native";
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Text,
  Item,
  Input,
  Button,
  Icon,
  View,
  Left,
  Right,
  Toast
} from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";

import styles from "./styles";
// import commonColor from "../../theme/variables/commonColor";
import * as authorizeActions from '../../actions/authorizeActions';

const bg = require("../../../assets/bg.png");
const logo = require("../../../assets/logo.png");

const required = value => (value ? undefined : "Required");
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength15 = maxLength(15);
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
const minLength6 = minLength(6);
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address"
    : undefined;
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? "Only alphanumeric characters"
    : undefined;

class LoginForm extends Component {

  renderInput({ input, label, type, meta: { touched, error, warning } }) {
    return (
      <View>
        <Item error={error && touched} rounded style={styles.inputGrp}>
          <Icon
            active
            name={input.name === "email" ? "mail" : "unlock"}
            style={{ color: "#fff" }}
          />
          <Input
            ref={c => (this.textInput = c)}
            placeholderTextColor="#FFF"
            style={styles.input}
            placeholder={input.name === "email" ? "Email" : "Password"}
            secureTextEntry={input.name === "password" ? true : false}
            {...input}
          />
          {touched && error ? (
            <Icon
              active
              style={styles.formErrorIcon}
              onPress={() => this.textInput._root.clear()}
              name="close"
            />
          ) : (
              <Text />
            )}
        </Item>
        {touched && error ? (
          <Text style={styles.formErrorText1}>{error}</Text>
        ) : (
            <Text style={styles.formErrorText2}>error here</Text>
          )}
      </View>
    );
  }

  renderButton() {
    const { loading } = this.props;
    if (loading) {
      return (
        <Button
          rounded
          primary
          block
          large
          style={styles.loginBtn}
          disabled
        >
          <Text
            style={
              Platform.OS === "android"
                ? { fontSize: 16, textAlign: "center" }
                : { fontSize: 16, fontWeight: "900" }
            }
          >
            Loading...
          </Text>
        </Button>
      )
    }
    else {
      return (
        <Button
          rounded
          primary
          block
          large
          style={styles.loginBtn}
          onPress={() => this.login()}
        >
          <Text
            style={
              Platform.OS === "android"
                ? { fontSize: 16, textAlign: "center" }
                : { fontSize: 16, fontWeight: "900" }
            }
          >
            Log In
          </Text>
        </Button>
      )
    }
  }

  login() {
    const { login, email, password } = this.props;

    if (this.props.valid) {
      login(email, password)
    } else {
      Toast.show({
        text: "Enter Valid Username & password!",
        duration: 2500,
        position: "top",
        textStyle: { textAlign: "center" }
      });
    }
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={bg} style={styles.background}>
          <Content contentContainerStyle={{ flex: 1 }}>
            <View style={styles.container}>
              {/* <Image source={logo} style={styles.logo} /> */}
              <Text style={styles.appTitle}>Social Network</Text>
            </View>
            <View style={styles.container}>
              <View style={styles.form}>
                <Field
                  name="email"
                  component={this.renderInput}
                  type="email"
                  // validate={[email, required]}
                />
                <Field
                  name="password"
                  component={this.renderInput}
                  type="password"
                  // validate={[alphaNumeric, minLength6, maxLength15, required]}
                />

                {this.renderButton()}

                <View style={styles.otherLinksContainer}>
                  <Left>
                    <Button
                      small
                      transparent
                      style={{ alignSelf: "flex-start" }}
                      onPress={() => navigation.navigate("SignUp")}
                    >
                      <Text style={styles.helpBtns}>Create An Account</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button
                      small
                      transparent
                      style={{ alignSelf: "flex-end" }}
                      onPress={() => navigation.navigate("ForgotPassword")}
                    >
                      <Text style={styles.helpBtns}>Forgot Password</Text>
                    </Button>
                  </Right>
                </View>
              </View>
            </View>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

let Login = reduxForm({
  form: "login"
})(LoginForm);

const selector = formValueSelector('login');
Login = connect(state => {
  // const email = selector(state, 'email');
  // const password = selector(state, 'password');
  const email = "starforce86714@gmail.com";
  const password = "123456";
  return {
    email,
    password
  }
})(Login)

const mapStateToProps = ({ global }) => {
  const { loading } = global
  return { loading }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    login: (email, password) => dispatch(authorizeActions.dbLogin(email, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
