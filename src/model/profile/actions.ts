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

    enable2FA(params) {
        return (dispatch) => {
            ProfileService.singleton().enable2FA(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.enable2FASuccess(resp));
                } else {
                    dispatch(profileActions.enable2FAFailed(resp));
                }
            });
        };
    },

    enable2FASuccess(resp) {
        return { type: PROFILE.ENABLE_2FA_SUCCESS, data: resp.info};
    },

    enable2FAFailed(resp) {
        return { type: PROFILE.ENABLE_2FA_FAILED, data: resp };
    },

    disable2FA(params) {
        return (dispatch) => {
            ProfileService.singleton().disable2FA(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.disable2FASuccess(params));
                } else {
                    dispatch(profileActions.disable2FAFailed(resp));
                }
            });
        };
    },

    disable2FASuccess(resp) {
        return { type: PROFILE.DISABLE_2FA_SUCCESS, data: resp};
    },

    disable2FAFailed(resp) {
        return { type: PROFILE.DISABLE_2FA_FAILED, data: resp };
    },

    confirm2FACode(params) {
        return (dispatch) => {
            ProfileService.singleton().confirm2FACode(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.confirm2FACodeSuccess(resp));
                } else {
                    dispatch(profileActions.confirm2FACodeFailed(resp));
                }
            });
        };
    },

    confirm2FACodeSuccess(resp) {
        return { type: PROFILE.CONFIRM_2FA_CODE_SUCCESS, data: resp};
    },

    confirm2FACodeFailed(resp) {
        return { type: PROFILE.CONFIRM_2FA_CODE_FAILED, data: resp };
    },

    enableFountain(params) {
        return (dispatch) => {
            ProfileService.singleton().enableFountain(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.enableFountainSuccess(resp));
                } else {
                    dispatch(profileActions.enableFountainFailed(resp));
                }
            });
        };
    },

    enableFountainSuccess(resp) {
        return { type: PROFILE.ENABLE_FOUNTAIN_SUCCESS, data: resp};
    },

    enableFountainFailed(resp) {
        return { type: PROFILE.ENABLE_FOUNTAIN_FAILED, data: resp };
    },

    updateFountain(params) {
        return (dispatch) => {
            ProfileService.singleton().updateFountain(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.updateFountainSuccess(resp));
                } else {
                    dispatch(profileActions.updateFountainFailed(resp));
                }
            });
        };
    },

    updateFountainSuccess(resp) {
        return { type: PROFILE.UPDATE_FOUNTAIN_SUCCESS, data: resp};
    },

    updateFountainFailed(resp) {
        return { type: PROFILE.UPDATE_FOUNTAIN_FAILED, data: resp };
    },

    disableFountain(params) {
        return (dispatch) => {
            ProfileService.singleton().disableFountain(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.disableFountainSuccess(resp));
                } else {
                    dispatch(profileActions.disableFountainFailed(resp));
                }
            });
        };
    },

    disableFountainSuccess(resp) {
        return { type: PROFILE.DISABLE_FOUNTAIN_SUCCESS, data: resp};
    },

    disableFountainFailed(resp) {
        return { type: PROFILE.DISABLE_FOUNTAIN_FAILED, data: resp };
    },

    getFountain(params) {
        return (dispatch) => {
            ProfileService.singleton().getFountain(params).then((resp: any) => {
                if (resp.rc == 1) {
                    dispatch(profileActions.getFountainSuccess(resp));
                } else {
                    dispatch(profileActions.getFountainFailed(resp));
                }
            });
        };
    },

    getFountainSuccess(resp) {
        return { type: PROFILE.GET_FOUNTAIN_SUCCESS, data: resp};
    },

    getFountainFailed(resp) {
        return { type: PROFILE.GET_FOUNTAIN_FAILED, data: resp };
    },
};