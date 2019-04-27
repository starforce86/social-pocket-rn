// - Import react components
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Platform, ScrollView, TextInput, Image, TouchableOpacity, Keyboard, KeyboardAvoidingView } from 'react-native'
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  Item,
  Input,
  View,
  Thumbnail
} from "native-base";
import uuid from 'uuid'
import _ from 'lodash'
import { connect } from 'react-redux'
import moment from 'moment'
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'react-native-fetch-blob'

// - Import component styles 
import styles from './styles'

// - Import app API
import FileAPI from '../../api/FileAPI'
import PostAPI from '../../api/PostAPI'

// - Import app components
// import CommentList from './../CommentList'

// - Import actions
import * as postActions from '../../actions/postActions'

// Prepare Blob support
export const tempWindowXMLHttpRequest = window.XMLHttpRequest;

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export class CreatePost extends Component {

  /**
   * Creates an instance of CreatePost.
   * @param {any} props 
   * @memberof CreatePost
   */
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      keyboardVisible: false,
      imageSource: null,
      imageHeight: 0,
      imageWidth: 0,
      imageName: '',
      disableComments: false,
      disableSharing: false
    }

  }

  componentWillMount() {
    // this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    // this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount() {
    // this.keyboardWillShowSub.remove()
    // this.keyboardWillHideSub.remove()
  }
  componentDidMount() {
    const { navigation } = this.props
    navigation.setParams({ handleSavePost: this.savePost })
    navigation.setParams({ enableSavePost: false })
  }

  /**
   * On Changing input text
   * 
   * @memberof CreatePost
   */
  changeText = (text) => {

    const { navigation } = this.props
    navigation.setParams({ enableSavePost: false })
    this.setState({
      text: text
    })
    navigation.setParams({ enableSavePost: (_.trim(text) !== '') })
  }

  /**
   * Delete post image
   * 
   * @memberof CreatePost
   */
  deleteImage = () => {
    this.setState({
      imageSource: null,
      imageHeight: 0,
      imageWidth: 0,
      imageName: ''
    })
  }

  showGallery = () => {

    // More info on all the options is below in the README...just some common use cases shown here
    var options = {
      title: 'Select an Image',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };


    /**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          text: '',
          imageSource: source,
          imageHeight: response.height,
          imageWidth: response.width,
          imageName: response.fileName
        });
      }
    });
  }

  /**
   * Resize and conver image
   * 
   * @memberof CreatePost
   */
  handleImage = () => {
    const mime = 'application/octet-stream'
    const { imageHeight, imageWidth, imageName, imageSource } = this.state
    const { saveImage } = this.props

    if (imageSource === null)
      return

    let max_size = 986;
    let width = imageWidth
    let height = imageHeight
    if (width > height) {
      if (width > max_size) {
        height *= max_size / width
        width = max_size;
      }
    } else {
      if (height > max_size) {
        width *= max_size / height
        height = max_size
      }
    }
    return new Promise((resolve, reject) => {
      ImageResizer.createResizedImage(imageSource.uri, width, height, 'JPEG', 80).then((response) => {
        let { uri } = response

        const extension = FileAPI.getExtension(response.name)
        const fileName = (`${uuid()}.${extension}`)
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null


        fs.readFile(uploadUri, 'base64')
          .then((data) => {
            return Blob.build(data, { type: `${mime};BASE64` })
          })
          .then((image) => {
            resolve({ image, fileName })
          })

      }).catch((error) => {
        reject(error)
      })
    })
  }

  /**
   * Save a post
   * 
   * @memberof CreatePost
   */
  savePost = () => {
    const { navigation, post, avatar, name,saveImageGallery } = this.props
    const { params = {} } = navigation.state

    const { imageSource, text, disableComments, disableSharing } = this.state

    if (!params.enableSavePost) {
      return
    }


    var tags = PostAPI.getContentTags(text)


    if (imageSource !== null) {
      this.handleImage().then((result) => {
        console.log(result);

        const { image, fileName } = result

        FileAPI.uploadImage(image, fileName, (percent, status) => {
          console.log('============= Upload progress ===============');
          console.log(percent);
          console.log('====================================');
        }).then((result) => {
        console.log(result);

          /* Save post */
          post({
            body: text,
            tags: tags,
            avatar: avatar,
            name: name,
            disableComments: disableComments,
            disableSharing: disableSharing,
            image: result.downloadURL,
            imageFullPath: result.metadata.fullPath
          })

          /* Add image to image gallery */
          saveImageGallery(result.downloadURL,result.metadata.fullPath)

        })

      }).catch((error) => {
        console.log('=============Error==================');
        console.log(error);
        console.log('====================================');
      })
    }
    else {
      post({
        body: text,
        tags: tags,
        avatar: avatar,
        name: name,
        disableComments: disableComments,
        disableSharing: disableSharing
      })
    }
  }

  render() {
    const { avatar, name, banner, navigation } = this.props
    const { keyboardVisible, imageSource, imageHeight, text } = this.state

    return (
      <Container>
        <Content
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff" }}
        >

          <View style={styles.headerContainer}>
            <Thumbnail source={{uri: avatar}} style={{ alignSelf: "flex-start" }} />
            <Text style={{ color: "white", marginLeft: 20 }}>{name}</Text>
            <Text note style={{ color: "white" }}> | public</Text>

          </View>

          <View style={styles.contentContainer}>
            <Item regular style={{ marginTop: 10 }}>
              <Input
                placeholder="What's new with you?"
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={styles.inputBox}
                multiline
                returnKeyType="default"
                onChangeText={this.changeText}
                value={text}
              />
            </Item>
            <View style={{ marginTop: 10 }}>
              <Button transparent
                onPress={this.showGallery}
              >
                <Icon name="ios-camera" style={styles.iconCamera} />
              </Button>
            </View>
            <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "flex-end" }}>
              <Button
                style={{ height: 40 }}
                onPress={() => navigation.goBack()}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                style={{ marginLeft: 20, height: 40 }}
                onPress={() => navigation.state.params.handleSavePost()}
                disabled={imageHeight > 0 ? false : true}
              >
                <Text>Post</Text>
              </Button>
            </View>
            <View style={{ marginTop: 10, marginBottom: 20 }}>
              {imageHeight > 0 ? (
                <View>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('CreatePost')}>
                    <Button transparent
                      onPress={this.deleteImage}
                    >
                      <Icon name="ios-remove-circle" style={styles.iconCamera} />
                    </Button>
                  </TouchableOpacity>
                  <Image style={{ width: null, height: imageHeight < 380 ? imageHeight : 380 }} source={imageSource} />
                </View>
              ) : <Text></Text>}
            </View>
          </View>

        </Content>
      </Container>
    )
  }
}

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // deleteImage: (id) => {
    //   dispatch(imageGalleryActions.dbDeleteImage(id))
    // },
    post: (post) => dispatch(postActions.dbAddPost(post)),
    saveImageGallery: (imageURL,imageFullPath) => dispatch(imageGalleryActions.dbSaveImage(imageURL,imageFullPath))
  }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
  const { uid } = state.authorize
  return {
    avatar: state.user.info && state.user.info[uid] ? state.user.info[uid].avatar || '' : '',
    name: state.user.info && state.user.info[uid] ? state.user.info[uid].fullName || '' : '',
    banner: state.user.info && state.user.info[uid] ? state.user.info[uid].banner || '' : '',
    posts: state.post.userPosts ? state.post.userPosts[uid] : {},
    uid,
  }
}

/**
 * Connect component to redux store
 */
export default connect(mapStateToProps, mapDispatchToProps)(CreatePost)