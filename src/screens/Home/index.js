// - Import react components
import React, { Component } from "react";
import {
  Image,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import _ from 'lodash';
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Spinner,
} from "native-base";

// - Import Actions
import * as postActions from './../../actions/postActions'
import * as userActions from './../../actions/userActions'
import * as commentActions from './../../actions/commentActions'
import * as voteActions from './../../actions/voteActions'
import * as notifyActions from './../../actions/notifyActions'
import * as circleActions from './../../actions/circleActions'
import * as imageGalleryActions from './../../actions/imageGalleryActions'

// - Import API 
import CircleAPI from './../../api/CircleAPI'
import PostAPI from './../../api/PostAPI'

// - Import app components
import WritePostButton from '../../components/WritePostButton';
import Post from '../../components/Post';

// - Import component styles 
import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;
const headerLogo = require("../../../assets/header-logo.png");

class Home extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { loadData } = this.props;
    loadData();
  }

  componentDidMount() {
  }

  fetchPosts = () => {
    const { mergedPosts } = this.props
    const posts = PostAPI.sortObjectsDate(mergedPosts)
    return _.map(posts, (post, index) => {

      return <Post
        body={post.body}
        commentCounter={post.commentCounter}
        creationDate={post.creationDate}
        id={post.id}
        key={post.id}
        image={post.image}
        lastEditDate={post.lastEditDate}
        ownerDisplayName={post.ownerDisplayName}
        ownerUserId={post.ownerUserId}
        ownerAvatar={post.ownerAvatar}
        postTypeId={post.postTypeId}
        score={post.score}
        tags={post.tags}
        video={post.video}
        disableComments={post.disableComments}
        disableSharing={post.disableSharing}
        viewCount={post.viewCount}
        pictureState={true} />
    })
  }

  render() {
    const { loaded, navigation } = this.props
    const { navigate } = navigation

    if (!loaded) {
      return <Spinner />;
    } else {
      return (
        <Container>
          <Header>
            <Left>
              <Button
                transparent
                onPress={() => navigation.openDrawer()}
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

            <WritePostButton openRequest={() => navigate('CreatePost')} />

            {this.fetchPosts()}

          </Content>
        </Container>
      );
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {

  return {
    loadData: () => {
      dispatch(commentActions.dbGetComments())
      dispatch(imageGalleryActions.downloadForImageGallery())
      dispatch(postActions.dbGetPosts())
      dispatch(userActions.dbGetUserInfo())
      dispatch(voteActions.dbGetVotes())
      dispatch(notifyActions.dbGetNotifies())
      dispatch(circleActions.dbGetCircles())

    },
    // clearData: () => {
    //   dispatch(imageGalleryActions.clearAllData())
    //   dispatch(postActions.clearAllData())
    //   dispatch(userActions.clearAllData())
    //   dispatch(commentActions.clearAllComments())
    //   dispatch(voteActions.clearAllvotes())
    //   dispatch(notifyActions.clearAllNotifications())
    //   dispatch(circleActions.clearAllCircles())

    // }
  }
}

const mapStateToProps = ({ authorize, global, user, post, comment, imageGallery, vote, notify, circle }) => {
  const { uid } = authorize
  let mergedPosts = {}
  const circles = circle ? (circle.userCircles[uid] || {}) : {}
  const followingUsers = CircleAPI.getFollowingUsers(circles)
  const posts = post.userPosts ? post.userPosts[uid] : {}
  Object.keys(followingUsers).forEach((userId) => {
    let newPosts = post.userPosts ? post.userPosts[userId] : {}
    _.merge(mergedPosts, newPosts)
  })
  _.merge(mergedPosts, posts)
  const loaded = user.loaded && post.loaded && comment.loaded && imageGallery.loaded && vote.loaded && notify.loaded && circle.loaded

  return {
    mergedPosts,
    guest: authorize.guest,
    name: user.info && user.info[uid] ? user.info[uid].fullName || '' : '',
    avatar: user.info && user.info[uid] ? user.info[uid].avatar || '' : '',
    authed: authorize.authed,
    // progress: global.progress,
    // global: global,
    loaded,
    uid
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)