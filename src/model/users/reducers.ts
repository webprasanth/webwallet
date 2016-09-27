import {USERS} from '../action-types';

export default function userReducer(state = { user: null }, action) {
    switch (action.type) {
        case USERS.LOGIN_SUCCESS:
        case USERS.SSO_LOGIN_SUCCESS:
            return Object.assign({}, state, { user: action.data });
        case USERS.LOGOUT:
            return Object.assign({}, state, { user: null });
        case USERS.GET_PROFILE_SUCCESS:
            var oldProfile = state.user;
            var newProfile = Object.assign({}, oldProfile, action.data);
            return Object.assign({}, state, { user: newProfile });
        case USERS.REMEMBER_ME:
            return Object.assign({}, state, { rememberMe: action.data });
        default:
            return state;
    }
}