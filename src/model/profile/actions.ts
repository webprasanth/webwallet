/**
 * Profile actions
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

    updateProfile(params) {
        return (dispatch) => {
            ProfileService.singleton().getUpdateProfile(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.updateProfileSuccess(params));
                } else {
                    dispatch(profileActions.updateProfileFailed(resp));
                }
            });
        };
    },

    updateProfileSuccess(resp) {
        return { type: PROFILE.UPDATE_PROFILE_SUCCESS, data: resp};
    },

    updateProfileFailed(resp) {
        return { type: PROFILE.UPDATE_PROFILE_FAILED, data: resp };
    },

    getSSOKeypair(params) {
        return (dispatch) => {
            ProfileService.singleton().getSSOKeypair(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.getSSOKeypairSuccess(resp));
                } else {
                    dispatch(profileActions.getSSOKeypairFailed(resp));
                }
            });
        };
    },

    getSSOKeypairSuccess(resp) {
        return { type: PROFILE.GET_SSO_KEYPAIR_SUCCESS, data: resp};
    },

    getSSOKeypairFailed(resp) {
        return { type: PROFILE.GET_SSO_KEYPAIR_FAILED, data: resp };
    },

    changePassword(params) {
        return (dispatch) => {
            ProfileService.singleton().changePassword(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.changePasswordSuccess(params));
                } else {
                    dispatch(profileActions.changePasswordFailed(resp));
                }
            });
        };
    },

    changePasswordSuccess(resp) {
        return { type: PROFILE.CHANGE_PASSWORD_SUCCESS, data: resp};
    },

    changePasswordFailed(resp) {
        return { type: PROFILE.CHANGE_PASSWORD_FAILED, data: resp };
    },
};