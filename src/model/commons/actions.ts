import {COMMONS} from '../action-types';

export const commonActions = {
    toggleLoading(isLoading){
        return {type: COMMONS.TOGGLE_LOADING, data: isLoading};
    },
    showError(content: {title: string, message: string}) {
        return {type: COMMONS.SHOW_ERROR, data: content};
    }
};