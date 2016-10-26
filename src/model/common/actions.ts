import { COMMON } from '../action-types';
import CommonService from './common-service';

export const commonActions = {
    toggleLoading(isLoading) {
        return { type: COMMON.TOGGLE_LOADING, data: isLoading };
    },
    getWalletsByEmail(params) {
        return (dispatch) => {
            CommonService.singleton().getWalletsByEmail(params).then((resp: any) => {
                if (resp.rc == 1 && resp.results.length > 0) {
                    dispatch(commonActions.getWalletsByEmailSuccess(resp));
                } else {
                    dispatch(commonActions.getWalletsByEmailFailed(resp));
                }
            });
        };
    },
    getWalletsByEmailSuccess(resp) {
        return { type: COMMON.GET_WALLETS_BY_EMAIL_SUCCESS, data: resp };
    },
    getWalletsByEmailFailed(resp) {
        return { type: COMMON.GET_WALLETS_BY_EMAIL_FAILED, data: resp };
    },

};