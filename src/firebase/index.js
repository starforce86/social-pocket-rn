// import firebase from 'firebase'
import firebase from '@firebase/app'
import '@firebase/firestore'
import '@firebase/database'
import '@firebase/storage'
import '@firebase/auth'
import * as RNFirebase from 'react-native-firebase';

try {
  let config = {
    apiKey: "AIzaSyCVZ97tH6a02Yh9jdJowJewXRjSePIn9s4",
    authDomain: "maxim-react-social-network-upd.firebaseapp.com",
    databaseURL: "https://maxim-react-social-network-upd.firebaseio.com",
    projectId: "maxim-react-social-network-upd",
    storageBucket: "maxim-react-social-network-upd.appspot.com",
    messagingSenderId: "512487036989"
    }

  firebase.initializeApp(config)
} catch (e) {
  console.log('=========Firebase firestore initializer==============')
  console.log(e)
  console.log('====================================')
}

// - Storage reference
export let storageRef = firebase.storage().ref()

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore()
firebase.firestore.setLogLevel('debug')
// const settings = {timestampsInSnapshots: true}
// db.settings(settings)
export {
  db
}

// - Database authorize
export let firebaseAuth = firebase.auth
export let firebaseRef = firebase.database().ref()

// - Firebase default
export let RNFirestore = RNFirebase.firestore()
export default firebase
