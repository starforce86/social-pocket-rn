// - Import react components
var uuid = require('uuid');
import moment from 'moment'
import _ from 'lodash'

// - Import action types
import * as types from './../constants/actionTypes'

/* ---------------- */


/**
 * Default State
 */
var defaultState = {
  friendTies: {},
  friendRequests: {},
  allUsers: {},
  friendTiesLoaded: false,
  friendRequestsLoaded: false,
  allUsersLoaded: false
}


/**
 * Circle reducer
 * @param {object} state 
 * @param {object} action 
 */
export var friendReducer = (state = defaultState, action) => {
  const { payload } = action
  switch (action.type) {
    case types.CLEAR_ALL_DATA_FRIEND:
      return defaultState

    case types.ADD_FRIEND_TIE_LIST:
      return {
        ...state,
        friendTies: { 
          ...state.friendTies,
          ...payload.friendTies 
        },
        friendTiesLoaded: true
      }

    case types.ADD_FRIEND_REQUEST_LIST:
      return {
        ...state,
        friendRequests: { 
          ...state.friendRequests,
          ...payload.friendRequests 
        },
        friendRequestsLoaded: true
      }

    case types.ADD_ALL_USERS_LIST:
      return {
        ...state,
        allUsers: { 
          ...state.allUsers,
          ...payload.users 
        },
        allUsersLoaded: true
      }
   
    default:
      return state;

  }
}
