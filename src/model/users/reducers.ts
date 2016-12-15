import { USERS, PROFILE } from '../action-types';

export default function userReducer(state = { user: null, wallets: [], loginData: null, signupData: null }, action) {
    let oldProfile = null;
    let newProfile = null;

    switch (action.type) {
        case USERS.SIGNUP_SUCCESS:
        case USERS.SIGNUP_FAILED:
            return Object.assign({}, state, { signupData: action.data });
        case USERS.LOGIN_SUCCESS:
            return Object.assign({}, state, { user: action.data });
        case USERS.SET_PASSWORD_SUCCESS:
            return Object.assign({}, state, { user: action.data });
        case USERS.SET_PASSWORD_FAILED:
            return Object.assign({}, state, { loginData: action.data });
        case USERS.LOGOUT:
            return Object.assign({}, state, { user: null });
        case PROFILE.DISABLE_2FA_SUCCESS:
            oldProfile = state.user;
            oldProfile.totp_enabled = 0;
            return Object.assign({}, state, { user: oldProfile });
        case PROFILE.UPDATE_PROFILE_SUCCESS:
            return Object.assign({}, state, { user: action.data.profile });
        case USERS.GET_PROFILE_SUCCESS:
            oldProfile = state.user;
            newProfile = Object.assign({}, oldProfile, action.data);
            return Object.assign({}, state, { user: newProfile });
        case USERS.GET_MY_WALLETS_SUCCESS:
            return Object.assign({}, state, { wallets: action.data });
        case USERS.NEED_VERIFY_GOOGLE_2FA:
            return Object.assign({}, state, { loginData: action.data });
        case USERS.GET_BALANCE_SUCCESS:
            oldProfile = state.user;
            oldProfile.balance = action.data;
            return Object.assign({}, state, { user: oldProfile });
        case USERS.STORE_FOUNTAIN_SECRET:
            oldProfile = state.user;
            oldProfile.fountainSecret = action.data;
            return Object.assign({}, state, { user: oldProfile });
        case USERS.REMEMBER_ME:
            return Object.assign({}, state, { rememberMe: action.data });
        default:
            return state;
    }
}