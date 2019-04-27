// @flow
import React, { Component } from "react";
import { connect } from 'react-redux'
import { ImageBackground, TouchableOpacity } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import {
  Container,
  Content,
  Text,
  Icon,
  ListItem,
  Thumbnail,
  View
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";

import UserAvatar from '../../components/UserAvatar'

import styles from "./style";

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Login" })]
});

class SideBar extends Component {
  render() {
    const navigation = this.props.navigation;
    const { avatar, displayName } = this.props;

    return (
      <Container>
        <ImageBackground
          source={require("../../../assets/sidebar-transparent.png")}
          style={styles.background}
        >
          <Content style={styles.drawerContent}>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Home");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-home" style={{ color: "#fff" }} />
              <Text style={styles.linkText}>HOME</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Profile");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-person" style={{ color: "#fff" }} />
              <Text style={styles.linkText}> PROFILE</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Friend");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-people" style={{ color: "#fff" }} />
              <Text style={styles.linkText}>FRIEND</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Settings");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-keypad" style={{ color: "#fff" }} />
              <Text style={styles.linkText}>CHANGE PASSWORD</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Feedback");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-chatboxes" style={{ color: "#fff" }} />
              <Text style={styles.linkText}>FEEDBACK</Text>
            </ListItem>
          </Content>
          <View style={styles.logoutContainer}>
            <View style={styles.logoutbtn} foregroundColor={"white"}>
              <Grid>
                <Col>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.dispatch(resetAction);
                    }}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "transparent"
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                      LOG OUT
                    </Text>
                    <Text note style={{ color: "#fff" }}>
                      {displayName}
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      navigation.navigate("Profile");
                    }}
                  >
                    <UserAvatar fullName={displayName} fileName={avatar} style={styles.profilePic} size={40} />
                  </TouchableOpacity>
                </Col>
              </Grid>
            </View>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { uid } = state.authorize
  const avatar = state.user.info && state.user.info[uid] ? state.user.info[uid].avatar || '' : ''
  return {
    avatar,
    displayName: state.user.info && state.user.info[uid] ? state.user.info[uid].fullName || '' : '',
  }
}

export default connect(mapStateToProps)(SideBar);
