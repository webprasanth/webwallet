import { PENDING } from '../action-types';
import { commonActions } from '../common/actions';
import PendingService from './pending-service';

export const pendingActions = {
    setActiveTab(tabId) {
        return { type: PENDING.SET_ACTIVE_TAB, data: tabId };
    },
    getMoreRequest(pageSettings) {
        let {date_from, date_to, type, start, size = 10, status = [0]} = pageSettings;

        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            PendingService.singleton().getRequests(pageSettings).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(pendingActions.getMoreRequestSuccess(resp));
                    dispatch({ type: PENDING.NEED_UPDATE_PENDING_NUMBER, data: resp });
                } else {
                    dispatch(pendingActions.getMoreRequestFailed(resp));
                }
            });
        };
    },
    getMoreRequestSuccess(resp) {
        return { type: PENDING.GET_MORE_REQUEST_SUCCESS, data: resp };
    },
    getMoreRequestFailed(resp) {
        return { type: PENDING.GET_MORE_REQUEST_FAILED, data: resp };
    },
    markRejectedMoneyRequests(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            PendingService.singleton().markRejectedMoneyRequests(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(pendingActions.markRejectedMoneyRequestsSuccess(resp));
                } else {
                    dispatch(pendingActions.markRejectedMoneyRequestsFailed(resp));
                }
            });
        };
    },
    markRejectedMoneyRequestsSuccess(resp) {
        return { type: PENDING.MARK_REJECTED_MONEY_REQUESTS_SUCCESS, data: resp };
    },
    markRejectedMoneyRequestsFailed(resp) {
        return { type: PENDING.MARK_REJECTED_MONEY_REQUESTS_FAILED, data: resp };
    },
    markCancelledMoneyRequests(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            PendingService.singleton().markCancelledMoneyRequests(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(pendingActions.markCancelledMoneyRequestsSuccess(resp));
                } else {
                    dispatch(pendingActions.markCancelledMoneyRequestsFailed(resp));
                }
            });
        };
    },
    markCancelledMoneyRequestsSuccess(resp) {
        return { type: PENDING.MARK_CANCELLED_MONEY_REQUESTS_SUCCESS, data: resp };
    },
    markCancelledMoneyRequestsFailed(resp) {
        return { type: PENDING.MARK_CANCELLED_MONEY_REQUESTS_FAILED, data: resp };
    },
};
