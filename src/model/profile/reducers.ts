import { PROFILE } from '../action-types';

export default function profileReducer(state = { wallet: {} }, action) {

    switch (action.type) {
        case PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS:
            return Object.assign({}, state, { wallet: action.data });
        case PROFILE.UPDATE_AVATAR_SUCCESS:
            return Object.assign({}, state, { avatarToken: action.data });
        case PROFILE.GET_SSO_KEYPAIR_SUCCESS:
            return Object.assign({}, state, { keypair: action.data });
        default:
            return state;
    }
}