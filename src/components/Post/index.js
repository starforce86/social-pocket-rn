import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import { TouchableOpacity, Image, Dimensions } from 'react-native'
import {
  Text,
  Icon,
  Left,
  Body,
  Right,
  Card,
  CardItem,
  Thumbnail
} from "native-base";
import AutoHeightImage from 'react-native-auto-height-image';

// import CommentList from './../CommentList'
import UserAvatar from './../UserAvatar'

// - Import component styles 
import styles from './styles'

const win = Dimensions.get('window');

export class Post extends Component {

  constructor(props) {
    super(props);
    moment.updateLocale('en', {
      relativeTime: {
        future: "in%s",
        past: "%s",
        s: '1s',
        ss: '%ds',
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1mth",
        MM: "%dmth",
        y: "1y",
        yy: "%dy"
      }
    });
  }

  static propTypes = {

    /**
     * The context of a post
     */
    body: PropTypes.string,
    /**
     * The number of comment on a post
     */
    commentCounter: PropTypes.number,
    /**
     * Creation post date
     */
    creationDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    /**
     * Post identifier
     */
    id: PropTypes.string,
    /**
     * Post image address
     */
    image: PropTypes.string,
    /**
     * The last time date when post has was edited
     */
    lastEditDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    /**
     * The name of the user who created the post
     */
    ownerDisplayName: PropTypes.string,
    /**
     * The identifier of the user who created the post
     */
    ownerUserId: PropTypes.string,
    /**
     * The avatar address of the user who created the post
     */
    ownerAvatar: PropTypes.string,
    /**
     * If post is only [0]text, [1]whith picture, ...
     */
    postTypeId: PropTypes.number,
    /**
     * The number votes on a post
     */
    score: PropTypes.number,
    /**
     * Array of tags on a post
     */
    tags: PropTypes.array,
    /**
     * The video address of a post
     */
    video: PropTypes.string,
    /**
     * If it's true comment will be disabled on a post
     */
    disableComments: PropTypes.bool,
    /**
     * If it's true sharing will be disabled on a post
     */
    disableSharing: PropTypes.bool,
    /**
     * The number of users who has visited the post
     */
    viewCount: PropTypes.number
  }

  render() {

    const { body, ownerDisplayName, creationDate, avatar, image, comments, commentCount } = this.props

    return (
      <Animatable.View animation="slideInUp">
        <Card>
          <CardItem>
            <Left>
              <UserAvatar fullName={ownerDisplayName} fileName={avatar} />
              <Body>
                <Text note>{ownerDisplayName}</Text>
                <Text note>{moment.unix(creationDate).fromNow()} | public</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <AutoHeightImage source={{uri: image}} width={win.width-4} />
          </CardItem>
          <CardItem>
            <Body>
              <Text note>{body}</Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <TouchableOpacity onPress={() => { }}>
                <Icon name="ios-heart-empty" style={styles.iconHeart} />
              </TouchableOpacity>
              <Text note> 0 </Text>
            </Left>
            <Right style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
              <TouchableOpacity onPress={() => { }}>
                <Icon name="ios-chatboxes" style={styles.iconHeart} />
              </TouchableOpacity>
              <Text note style={{ marginLeft: 10 }}> 0 </Text>
            </Right>
          </CardItem>
        </Card>
      </Animatable.View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { uid } = state.authorize
  console.log('AAAAAAAAAAAAAAAAA', state)
  let votes = state.vote.postVotes[ownProps.id]
  const post = (state.post.userPosts[uid] ? Object.keys(state.post.userPosts[uid]).filter((key) => { return ownProps.id === key }).length : 0)
  const avatar = state.friend.allUsers && state.friend.allUsers[ownProps.ownerUserId] ? state.friend.allUsers[ownProps.ownerUserId].avatar || '' : ''
  const comments = state.comment.postComments ? state.comment.postComments[ownProps.id] : {}
  return {
    comments,
    avatar,
    commentCount: comments ? Object.keys(comments).length : 0,
    voteCount: state.vote.postVotes[ownProps.id] ? Object.keys(state.vote.postVotes[ownProps.id]).length : 0,
    userVoteStatus: votes && Object.keys(votes).filter((key) => votes[key].userId === state.authorize.uid)[0] ? true : false,
    isPostOwner: post > 0,
    ownerDisplayName: state.friend.allUsers && state.friend.allUsers[ownProps.ownerUserId] ? state.friend.allUsers[ownProps.ownerUserId].fullName || '' : '',
  }
}

export default connect(mapStateToProps)(Post)