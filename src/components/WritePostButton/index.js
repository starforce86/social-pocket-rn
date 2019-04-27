import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  TouchableOpacity
} from 'react-native'
import {
  Text,
  Icon,
  Right,
  Card,
  CardItem,
  Thumbnail
} from "native-base";

import styles from "./styles";
import { UserAvatar } from '../UserAvatar';


export class WritePostButton extends Component {

  static propTypes = {
    /**
     * A call back function for opening the write post page
     */
    openRequest: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { avatar, displayName, openRequest } = this.props;

    return (
      <TouchableOpacity onPress={openRequest}>
        <Card>
          <CardItem>
            <UserAvatar fullName={displayName} fileName={avatar} />
            <Text note style={{ marginLeft: 20 }}>What's new with you?</Text>
            <Right>
              <Icon name="ios-camera" style={styles.iconCamera} />
            </Right>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }

}

// const mapStateToProps = ({ authorize, global, user, post, comment, imageGallery, vote, notify, circle }) => {
const mapStateToProps = ({ authorize, user }) => {
  const { uid } = authorize

  return {
    // name: user.info && user.info[uid] ? user.info[uid].fullName || '' : '',
    avatar: user.info && user.info[uid] ? user.info[uid].avatar || '' : '',
    displayName: user.info && user.info[uid] ? user.info[uid].fullName || '' : '',
    // authed: authorize.authed,
    // global: global,
    // uid
  }
}

export default connect(mapStateToProps)(WritePostButton)