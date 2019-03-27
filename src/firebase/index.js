import firebase from 'firebase'

try {
  var config = {
    apiKey: "AIzaSyDBAFzOiHBrhUaBdciv-d-jCVn5KqKMFrg",
    authDomain: "social-network-69ccd.firebaseapp.com",
    databaseURL: "https://social-network-69ccd.firebaseio.com",
    projectId: "social-network-69ccd",
    storageBucket: "social-network-69ccd.appspot.com",
    messagingSenderId: "121119380874"
    }

  firebase.initializeApp(config)
} catch (e) {

}

// - Storage reference
export var storageRef = firebase.storage().ref()

// - Database authorize
export var firebaseAuth = firebase.auth
export var firebaseRef = firebase.database().ref()

// - Firebase default
export default firebase
