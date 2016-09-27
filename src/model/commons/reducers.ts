import {COMMONS} from '../action-types';

export default function commonReducer(state = { isLoading: false }, action) {
    switch (action.type) {
        case COMMONS.TOGGLE_LOADING:
            return Object.assign({}, state, { isLoading: action.data });
        default:
            return state;
    }
}