import { PENDING } from '../action-types';
import { commonActions } from '../commons/actions';
import PendingService from './pending-service';

export const pendingActions = {
    setActiveTab(tabId) {
        return { type: PENDING.SET_ACTIVE_TAB, data: tabId };
    },
    getMoreRequest(pageSettings) {
        let {date_from, date_to, type, start, size = 5, status = [0]} = pageSettings;

        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            PendingService.singleton().getRequests(pageSettings).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(pendingActions.getMoreRequestSuccess(resp));
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
    getWalletsByEmail(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            PendingService.singleton().getWalletsByEmail(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1 && resp.results.length > 0) {
                    dispatch(pendingActions.getWalletsByEmailSuccess(resp));
                } else {
                    dispatch(pendingActions.getWalletsByEmailFailed(resp));
                }
            });
        };
    },
    getWalletsByEmailSuccess(resp) {
        return { type: PENDING.GET_WALLETS_BY_EMAIL_SUCCESS, data: resp };
    },
    getWalletsByEmailFailed(resp) {
        return { type: PENDING.GET_WALLETS_BY_EMAIL_FAILED, data: resp };
    },
};
