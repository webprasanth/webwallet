import {TABS} from '../action-types';

export const tabActions = {
    setActive(id){
        return {type: TABS.SET_ACTIVE, data: id};
    }
};