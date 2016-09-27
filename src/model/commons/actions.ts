import {COMMONS} from '../action-types';

export const commonActions = {
    toggleLoading(isLoading){
        return {type: COMMONS.TOGGLE_LOADING, data: isLoading};
    }
};