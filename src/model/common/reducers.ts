import { COMMON } from '../action-types';

export default function commonReducer(state = { isLoading: false, errorContent: {} }, action) {
    switch (action.type) {
        case COMMON.TOGGLE_LOADING:
            return Object.assign({}, state, { isLoading: action.data });
        default:
            return state;
    }
}