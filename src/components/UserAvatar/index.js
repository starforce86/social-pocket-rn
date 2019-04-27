import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    ImageBackground,
    Text
} from 'react-native';
import {
  Thumbnail
} from "native-base";

import styles from "./styles";


export class UserAvatar extends Component {

  static propTypes = {
    /**
     * Use for getting url address from server
     */
    fileName: PropTypes.string,
    /**
     * User full name
     */
    fullName: PropTypes.string,
    /**
     * Avatar style
     */
    style: PropTypes.object,
    /**
     * Avatar size
     */
    size: PropTypes.number
  }

  constructor(props) {
    super(props)

    // Defaul state
    this.state = {
    }
  }

  render() {
    let { fileName, fullName, style, size } = this.props

    return (
      (fileName && fileName !== '' && fileName !== 'noImage')
        ? (
          <Thumbnail source={{ uri: fileName ? fileName : ' ' }} style={{ ...style, backgroundColor: '#ffffff', width: size || 56, height: size || 56 }} />
        )
        : (
          <ImageBackground style={{ ...style, backgroundColor: '#00bcd4', borderRadius: size / 2 || 28, width: size || 56, height: size || 56 }} >
            <Text style={{ color: 'white', fontSize: size / 2 || 28, textAlign: 'center', paddingTop: 6 }}>{fullName ? fullName.slice(0, 1) : ''}</Text>
          </ImageBackground>
        )
    );
  }

}

const mapStateToProps = ({ authorize, user }) => {
  const { uid } = authorize

  return {
      uid
  }
}

export default connect(mapStateToProps)(UserAvatar)