import { USERS, PROFILE } from '../action-types';

export default function userReducer(state = { user: null, wallets: [] }, action) {
    let oldProfile = null;
    let newProfile = null;

    switch (action.type) {
        case USERS.LOGIN_SUCCESS:
        case USERS.SSO_LOGIN_SUCCESS:
            return Object.assign({}, state, { user: action.data });
        case USERS.LOGOUT:
            return Object.assign({}, state, { user: null });
        case PROFILE.UPDATE_PROFILE_SUCCESS:
        case USERS.GET_PROFILE_SUCCESS:
            oldProfile = state.user;
            newProfile = Object.assign({}, oldProfile, action.data);
            return Object.assign({}, state, { user: newProfile });
        case USERS.GET_MY_WALLETS_SUCCESS:
            return Object.assign({}, state, { wallets: action.data });
        case USERS.GET_BALANCE_SUCCESS:
            oldProfile = state.user;
            oldProfile.balance = action.data;
            return Object.assign({}, state, { user: oldProfile });
        case USERS.REMEMBER_ME:
            return Object.assign({}, state, { rememberMe: action.data });
        default:
            return state;
    }
}