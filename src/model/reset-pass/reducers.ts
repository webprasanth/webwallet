import { RESET_PASS } from '../action-types';

export default function resetPassReducer(state = { keys: {}, resetPassErrReason: '' }, action) {
    switch (action.type) {
        case RESET_PASS.GET_RECOVERY_KEYS_SUCCESS:
            return Object.assign({}, state, { keys: action.data });
        case RESET_PASS.SSO_RESET_PASSWORD_FAILED:
            return Object.assign({}, state, { resetPassErrReason: action.data })
        default:
            return state;
    }
}