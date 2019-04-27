// - Import react components
import {db} from '../firebase'

// - Import action types
import * as types from './../constants/actionTypes'

import { tempWindowXMLHttpRequest } from '../screens/CreatePost'

export const bindFriendEvent = () => {
    return (dispatch, getState) => {
        let friendRef = db.collection(`graphs:friends`)
        friendRef.onSnapshot((snapshot) => {
            // dispatch(clearAll())
            dispatch(dbGetAllUsers())
            dispatch(dbGetFriendTies())
            dispatch(dbGetFriendRequests())
        })
    }
}

// - Get all users from database
export const dbGetAllUsers = () => {
    return (dispatch, getState) => {
        var uid = getState().authorize.uid
        if (uid) {
            let users = {}
            return db.collection('userInfo').get().then((result) => {
                result.forEach((item) => {
                    users[[item.data().id]] = item.data()
                })
                console.log('AAAAAAAAAAAAAAAAAAAA', users)
                dispatch(addAllUsers(users))
            })
                .catch(error => console.log(error))
        }
    }
}

// - Get friend ties from database
export const dbGetFriendTies = () => {
    return (dispatch, getState) => {
        var uid = getState().authorize.uid
        if (uid) {
            // const originalXMLHttpRequest = window.XMLHttpRequest
            // window.XMLHttpRequest = tempWindowXMLHttpRequest

            let tieFriends = {}
            return db.collection('graphs:friends').where('friendStatus', '==', 'accepted').where('leftNode', '==', uid).get().then((tieUsers1) => {
                tieUsers1.forEach((item) => {
                    if (item.data().leftNode === uid) {
                        tieFriends[[item.data().rightNode]] = item.data().rightMetadata
                    } else if (item.data().rightNode === uid) {
                        tieFriends[[item.data().leftNode]] = item.data().LeftMetadata
                    }
                })
                db.collection('graphs:friends').where('friendStatus', '==', 'accepted').where('rightNode', '==', uid).get().then((tieUsers2) => {
                    tieUsers2.forEach((item) => {
                        if (item.data().leftNode === uid) {
                            tieFriends[[item.data().rightNode]] = item.data().rightMetadata
                        } else if (item.data().rightNode === uid) {
                            tieFriends[[item.data().leftNode]] = item.data().LeftMetadata
                        }
                    })
                    dispatch(addFriendTies(tieFriends))
                    // window.XMLHttpRequest = originalXMLHttpRequest
                })
                    .catch(error => {
                        console.log(error)
                        // window.XMLHttpRequest = originalXMLHttpRequest
                    })
            })
                .catch(error => {
                    console.log(error)
                    // window.XMLHttpRequest = originalXMLHttpRequest
                })
        }
    }
}

// - Get friend requests from database
export const dbGetFriendRequests = () => {
    return (dispatch, getState) => {
        var uid = getState().authorize.uid
        if (uid) {
            // const originalXMLHttpRequest = window.XMLHttpRequest
            // window.XMLHttpRequest = tempWindowXMLHttpRequest

            let friendRequests = {}
            return db.collection('graphs:friends').where('friendStatus', '==', 'requested').where('leftNode', '==', uid).get().then((tieUsers1) => {
                tieUsers1.forEach((item) => {
                    if (item.data().leftNode === uid) {
                        friendRequests[[item.data().rightNode]] = item.data().rightMetadata
                    } else if (item.data().rightNode === uid) {
                        friendRequests[[item.data().leftNode]] = item.data().LeftMetadata
                    }
                })
                db.collection('graphs:friends').where('friendStatus', '==', 'requested').where('rightNode', '==', uid).get().then((tieUsers2) => {
                    tieUsers2.forEach((item) => {
                        if (item.data().leftNode === uid) {
                            friendRequests[[item.data().rightNode]] = item.data().rightMetadata
                        } else if (item.data().rightNode === uid) {
                            friendRequests[[item.data().leftNode]] = item.data().LeftMetadata
                        }
                    })
                    dispatch(addFriendRequests(friendRequests))
                    // window.XMLHttpRequest = originalXMLHttpRequest
                })
                    .catch(error => {
                        console.log(error)
                        // window.XMLHttpRequest = originalXMLHttpRequest
                    })
            })
                .catch(error => {
                    console.log(error)
                    // window.XMLHttpRequest = originalXMLHttpRequest
                })
        }
    }
}

const addAllUsers = (users) => {
    return {
        type: types.ADD_ALL_USERS_LIST,
        payload: { users }
    }
}

const addFriendTies = (friendTies) => {
    return {
        type: types.ADD_FRIEND_TIE_LIST,
        payload: { friendTies }
    }
}

const addFriendRequests = (friendRequests) => {
    return {
        type: types.ADD_FRIEND_REQUEST_LIST,
        payload: { friendRequests }
    }
}