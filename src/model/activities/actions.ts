import {ACTIVITIES} from '../action-types';
import {commonActions} from '../commons/actions';
import ActivityService from './activity-service';

export const activityActions = {
    setActiveTab(tabId){
        return {type: ACTIVITIES.SET_ACTIVE_TAB, data: tabId};
    },
    getMoreTxns(pageSettings){
        let {date_from, date_to, type, start, size = 10, order = 'desc'} = pageSettings;
        
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ActivityService.singleton().getTransList(pageSettings).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if(resp.rc == 1){
                    dispatch(activityActions.getMoreTxnsSuccess(resp));
                }
                else{
                    dispatch(activityActions.getMoreTxnsFailed(resp));
                }
            });
        };
    },
    getMoreTxnsSuccess(resp){
        return {type: ACTIVITIES.GET_MORE_TXN_SUCCESS, data: resp};
    },
    getMoreTxnsFailed(resp){
        return {type: ACTIVITIES.GET_MORE_TXN_FAILED, data: resp};
    }
};
