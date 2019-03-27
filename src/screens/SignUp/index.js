// @flow
import React, { Component } from "react";
import { ImageBackground, StatusBar } from "react-native";
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Text,
  Button,
  Icon,
  Item,
  Input,
  View,
  Toast,
  Left,
  Right,
  Footer
} from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";

import styles from "./styles";
import commonColor from "../../../native-base-theme/variables/commonColor";
import * as authorizeActions from '../../actions/authorizeActions';

const required = value => (value ? undefined : "Required");
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength15 = maxLength(15);
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
const minLength8 = minLength(8);
const minLength5 = minLength(5);
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address"
    : undefined;
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? "Only alphanumeric characters"
    : undefined;

class SignUpForm extends Component {
  textInput: any;
  renderInput({ input, label, type, meta: { touched, error, warning } }) {
    return (
      <View>
        <Item error={error && touched} rounded style={styles.inputGrp}>
          <Icon
            active
            name={
              input.name === "username"
                ? "person"
                : input.name === "email"
                ? "mail"
                : "unlock"
            }
            style={{ color: "#fff" }}
          />
          <Input
            ref={c => (this.textInput = c)}
            placeholderTextColor="#FFF"
            style={styles.input}
            placeholder={
              input.name === "username"
                ? "Full Name"
                : input.name === "email"
                ? "Email"
                : "Password"
            }
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
          <Text style={styles.formErrorText2}>> error here</Text>
        )}
      </View>
    );
  }
  signUp() {
    const { register, username, email, password } = this.props
    if (this.props.valid) {
      register({
        fullName: username,
        email:email,
        password: password
      });
    } else {
      Toast.show({
        text: "All the fields are compulsory!",
        duration: 2500,
        position: "top",
        textStyle: { textAlign: "center" }
      });
    }
  }

  render() {
    return (
      <Container>
        <StatusBar
          backgroundColor={commonColor.statusBarColor}
          barStyle="light-content"
        />
        <ImageBackground
          source={require("../../../assets/bg-signup.png")}
          style={styles.background}
        >
          <Content padder>
            <Text style={styles.signupHeader}>CREATE ACCOUNT</Text>
            <View style={styles.signupContainer}>
              <Field
                name="username"
                component={this.renderInput}
                type="text"
                validate={[required, alphaNumeric, minLength5]}
              />

              <Field
                name="email"
                component={this.renderInput}
                type="email"
                validate={[email, required]}
              />
              <Field
                name="password"
                component={this.renderInput}
                type="password"
                validate={[alphaNumeric, minLength8, maxLength15, required]}
              />

              <Button
                rounded
                primary
                block
                onPress={() => this.signUp()}
                style={styles.signupBtn}
              >
                <Text style={{ color: "#FFF" }}>Sign Up</Text>
              </Button>
            </View>
          </Content>
          <Footer
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              backgroundColor: "transparent"
            }}
          >
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.helpBtns}>Back To Login</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}

let SignUp = reduxForm({
  form: "signup"
})(SignUpForm);

const selector = formValueSelector('signup');
SignUp = connect(state => {
  const username = selector(state, 'username');
  const email = selector(state, 'email');
  const password = selector(state, 'password');
  return {
    username,
    email,
    password
  }
})(SignUp)

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    register: (data) => dispatch(authorizeActions.dbSignup(data))
  }
}

export default connect(null, mapDispatchToProps)(SignUp);
