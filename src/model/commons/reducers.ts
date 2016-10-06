import {COMMONS} from '../action-types';

export default function commonReducer(state = { isLoading: false, errorContent: {}}, action) {
    switch (action.type) {
        case COMMONS.TOGGLE_LOADING:
            return Object.assign({}, state, { isLoading: action.data });
        case COMMONS.SHOW_ERROR:
            return Object.assign({}, state, {errorContent: action.data});
        default:
            return state;
    }
}