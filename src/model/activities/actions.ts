import { ACTIVITIES } from '../action-types';
import { commonActions } from '../common/actions';
import ActivityService from './activity-service';
import { TransactionDetail } from './types';

export const activityActions = {
    setActiveTab(tabId) {
        return { type: ACTIVITIES.SET_ACTIVE_TAB, data: tabId };
    },
    getMoreTxns(pageSettings) {
        let {date_from, date_to, type, start, size = 10, order = 'desc'} = pageSettings;

        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ActivityService.singleton().getTransList(pageSettings).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(activityActions.getMoreTxnsSuccess(resp));
                }
                else {
                    dispatch(activityActions.getMoreTxnsFailed(resp));
                }
            });
        };
    },
    getMoreTxnsSuccess(resp) {
        return { type: ACTIVITIES.GET_MORE_TXN_SUCCESS, data: resp };
    },
    getMoreTxnsFailed(resp) {
        return { type: ACTIVITIES.GET_MORE_TXN_FAILED, data: resp };
    },
    getTransactionDetail(txn) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ActivityService.singleton().getTransactionDetail(txn.transaction_id).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc === 1) {
                    let txData: any = ActivityService.singleton().convertToTnx(resp.transaction);
                    txData.meta = txn;
                    dispatch(activityActions.getTransactionDetailSuccess(txData));
                } else {
                    dispatch(activityActions.getTransactionDetailFailed(resp));
                }
            });
        };
    },
    getTransactionDetailSuccess(resp) {
        return { type: ACTIVITIES.GET_TXN_DETAIL_SUCCESS, data: resp };
    },
    getTransactionDetailFailed(resp) {
        return { type: ACTIVITIES.GET_TXN_DETAIL_FAILED, data: resp };
    }
};
