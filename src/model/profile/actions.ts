/**
 * Profile actions
 * author: Ba Ban
 */
import { PROFILE } from '../action-types';
import ProfileService from './service';
import CommonService from '../common/common-service';

export const profileActions = {

    getWalletsByEmail(params) {
        return (dispatch) => {
            CommonService.singleton().getWalletsByEmail(params).then((resp: any) => {
                if (resp.rc == 1 && resp.results.length > 0) {
                    dispatch(profileActions.getWalletsByEmailSuccess(resp));
                } else {
                    dispatch(profileActions.getWalletsByEmailFailed(resp));
                }
            });
        };
    },

    getWalletsByEmailSuccess(resp) {
        return { type: PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS, data: resp.results[0] };
    },

    getWalletsByEmailFailed(resp) {
        return { type: PROFILE.GET_WALLETS_BY_EMAIL_FAILED, data: resp };
    },

    updateAvatar(file) {
        return (dispatch) => {
            ProfileService.singleton().updateAvatar(file).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.updateAvatarSuccess(resp));
                } else {
                    dispatch(profileActions.updateAvatarFailed(resp));
                }
            });
        };
    },

    updateAvatarSuccess(resp) {
        return { type: PROFILE.UPDATE_AVATAR_SUCCESS, data: resp.token};
    },

    updateAvatarFailed(resp) {
        return { type: PROFILE.UPDATE_AVATAR_FAILED, data: resp };
    },
};