// @flow
import React, { Component } from "react";
import {
  Platform,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  FlatList,
  View as RNView
} from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  View,
  Spinner,
  Card,
  CardItem,
  Thumbnail
} from "native-base";

import { Grid, Col } from "react-native-easy-grid";

import { itemsFetchData } from "../../actions";
import datas from "./data.json";

import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;
const headerLogo = require("../../../assets/header-logo.png");

class Home extends Component {
  componentDidMount() {
    this.props.fetchData(datas);
  }
  _renderItem = ({ item }) => {
    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail source={require("../../../assets/Contacts/atul.png")} />
            <Body>
              <Text>Maxim Martynenko</Text>
              <Text note>19 days ago | public</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image source={require("../../../assets/live_user_tsm_daequan-400x225.jpg")} style={{ height: 200, width: null, flex: 1 }} />
        </CardItem>
        <CardItem>
          <Body>
            <Text>League of Legends</Text>
          </Body>
        </CardItem>
        <CardItem>
          <Left>
            <TouchableOpacity onPress={() => { }}>
              <Icon name="ios-heart-empty" style={styles.iconHeart} />
            </TouchableOpacity>
            <Text> 4 </Text>

          </Left>
          <Right style={{flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
            <TouchableOpacity onPress={() => { }}>
              <Icon name="ios-chatboxes" style={styles.iconHeart} />
            </TouchableOpacity>
            <Text style={{marginLeft: 10}}> 6 </Text>
          </Right>
        </CardItem>
      </Card>
    );
  };
  render() {
    if (this.props.isLoading) {
      return <Spinner />;
    } else {
      return (
        <Container>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.openDrawer()}
              >
                <Icon active name="menu" />
              </Button>
            </Left>
            <Body>
              <Image source={headerLogo} style={styles.imageHeader} />
            </Body>
            <Right />
          </Header>
          <Content
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#fff" }}
          >

            <TouchableOpacity onPress={() => this.props.navigation.navigate('CreatePost')}>
              <Card>
                <CardItem>
                  <Thumbnail source={require("../../../assets/Contacts/atul.png")} />
                  <Text note style={{ marginLeft: 20 }}>What's new with you?</Text>
                  <Right>
                    <Icon name="ios-camera" style={styles.iconCamera} />
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>

            <FlatList
              data={this.props.items}
              renderItem={this._renderItem}
              keyExtractor={item => item.id}
            />
          </Content>
        </Container>
      );
    }
  }
}

export default Home;
