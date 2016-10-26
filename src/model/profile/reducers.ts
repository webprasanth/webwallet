import { PROFILE } from '../action-types';

export default function profileReducer(state = { wallet: {} }, action) {

    switch (action.type) {
        case PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS:
            return Object.assign({}, state, { wallet: action.data });
        default:
            return state;
    }
}