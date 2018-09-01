/**
 * Profile actions
 */
import { PROFILE, PENDING, ACTIVITIES } from '../action-types';
import ProfileService from './service';
import CommonService from '../common/common-service';
import { commonActions } from '../common/actions';

export const profileActions = {
  getWalletsByEmail(params) {
    return dispatch => {
      CommonService.singleton()
        .getWalletsByEmail(params)
        .then((resp: any) => {
          if (resp.rc == 1 && resp.results.length > 0) {
            dispatch(profileActions.getWalletsByEmailSuccess(resp));
          } else {
            dispatch(profileActions.getWalletsByEmailFailed(resp));
          }
        });
    };
  },

  getWalletsByEmailSuccess(resp) {
    return {
      type: PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS,
      data: resp.results[0],
    };
  },

  getWalletsByEmailFailed(resp) {
    return { type: PROFILE.GET_WALLETS_BY_EMAIL_FAILED, data: resp };
  },

  updateAvatar(file) {
    return dispatch => {
      ProfileService.singleton()
        .updateAvatar(file)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.updateAvatarSuccess(resp));
          } else {
            dispatch(profileActions.updateAvatarFailed(resp));
          }
        });
    };
  },

  updateAvatarSuccess(resp) {
    return { type: PROFILE.UPDATE_AVATAR_SUCCESS, data: resp.token };
  },

  updateAvatarFailed(resp) {
    return { type: PROFILE.UPDATE_AVATAR_FAILED, data: resp };
  },

  updateProfile(dataType, params) {
    return dispatch => {
      ProfileService.singleton()
        .updateProfile(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(
              profileActions.updateProfileSuccess({ profile: resp.profile })
            );

            // Need to reload all transaction logs (activities) and pending if user update timezone
            if (params.timezone) {
              dispatch({
                type: PENDING.NEED_UPDATE_PENDING_REQUESTS,
                data: null,
              });
              dispatch({ type: ACTIVITIES.NEED_UPDATE_ACTIVITIES, data: null });
            }
          } else {
            dispatch(profileActions.updateProfileFailed({ dataType, resp }));
          }
        });
    };
  },

  updateProfileSuccess(data) {
    return { type: PROFILE.UPDATE_PROFILE_SUCCESS, data: data };
  },

  updateProfileFailed(data) {
    return { type: PROFILE.UPDATE_PROFILE_FAILED, data: data };
  },

  getSSOKeypair(params) {
    return dispatch => {
      ProfileService.singleton()
        .getSSOKeypair(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.getSSOKeypairSuccess(resp));
          } else {
            dispatch(profileActions.getSSOKeypairFailed(resp));
          }
        });
    };
  },

  getSSOKeypairSuccess(resp) {
    return { type: PROFILE.GET_SSO_KEYPAIR_SUCCESS, data: resp };
  },

  getSSOKeypairFailed(resp) {
    return { type: PROFILE.GET_SSO_KEYPAIR_FAILED, data: resp };
  },

  changePassword(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      ProfileService.singleton()
        .changePassword(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc == 1) {
            dispatch(profileActions.changePasswordSuccess(params));
          } else {
            dispatch(profileActions.changePasswordFailed(resp));
          }
        });
    };
  },

  changePasswordSuccess(resp) {
    return { type: PROFILE.CHANGE_PASSWORD_SUCCESS, data: resp };
  },

  changePasswordFailed(resp) {
    return { type: PROFILE.CHANGE_PASSWORD_FAILED, data: resp };
  },

  enable2FA(params) {
    return dispatch => {
      ProfileService.singleton()
        .enable2FA(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.enable2FASuccess(resp));
          } else {
            dispatch(profileActions.enable2FAFailed(resp));
          }
        });
    };
  },

  enable2FASuccess(resp) {
    return { type: PROFILE.ENABLE_2FA_SUCCESS, data: resp.info };
  },

  enable2FAFailed(resp) {
    return { type: PROFILE.ENABLE_2FA_FAILED, data: resp };
  },

  disable2FA(params) {
    return dispatch => {
      ProfileService.singleton()
        .disable2FA(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.disable2FASuccess(params));
          } else {
            dispatch(profileActions.disable2FAFailed(resp));
          }
        });
    };
  },

  disable2FASuccess(resp) {
    return { type: PROFILE.DISABLE_2FA_SUCCESS, data: resp };
  },

  disable2FAFailed(resp) {
    return { type: PROFILE.DISABLE_2FA_FAILED, data: resp };
  },

  confirm2FACode(params) {
    return dispatch => {
      ProfileService.singleton()
        .confirm2FACode(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.confirm2FACodeSuccess(resp));
          } else {
            dispatch(profileActions.confirm2FACodeFailed(resp));
          }
        });
    };
  },

  confirm2FACodeSuccess(resp) {
    return { type: PROFILE.CONFIRM_2FA_CODE_SUCCESS, data: resp };
  },

  confirm2FACodeFailed(resp) {
    return { type: PROFILE.CONFIRM_2FA_CODE_FAILED, data: resp };
  },

  enableFountain(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      ProfileService.singleton()
        .enableFountain(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc == 1) {
            dispatch(profileActions.enableFountainSuccess(resp));
          } else {
            dispatch(profileActions.enableFountainFailed(resp));
          }
        });
    };
  },

  enableFountainSuccess(resp) {
    return { type: PROFILE.ENABLE_FOUNTAIN_SUCCESS, data: resp };
  },

  enableFountainFailed(resp) {
    return { type: PROFILE.ENABLE_FOUNTAIN_FAILED, data: resp };
  },

  updateFountain(params) {
    return dispatch => {
      ProfileService.singleton()
        .updateFountain(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.updateFountainSuccess(resp));
          } else {
            dispatch(profileActions.updateFountainFailed(resp));
          }
        });
    };
  },

  updateFountainSuccess(resp) {
    return { type: PROFILE.UPDATE_FOUNTAIN_SUCCESS, data: resp };
  },

  updateFountainFailed(resp) {
    return { type: PROFILE.UPDATE_FOUNTAIN_FAILED, data: resp };
  },

  disableFountain(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      ProfileService.singleton()
        .disableFountain(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc == 1) {
            dispatch(profileActions.disableFountainSuccess(resp));
          } else {
            dispatch(profileActions.disableFountainFailed(resp));
          }
        });
    };
  },

  disableFountainSuccess(resp) {
    return { type: PROFILE.DISABLE_FOUNTAIN_SUCCESS, data: resp };
  },

  disableFountainFailed(resp) {
    return { type: PROFILE.DISABLE_FOUNTAIN_FAILED, data: resp };
  },

  getFountain(params) {
    return dispatch => {
      ProfileService.singleton()
        .getFountain(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.getFountainSuccess(resp));
          } else {
            dispatch(profileActions.getFountainFailed(resp));
          }
        });
    };
  },

  getFountainSuccess(resp) {
    return { type: PROFILE.GET_FOUNTAIN_SUCCESS, data: resp };
  },

  getFountainFailed(resp) {
    return { type: PROFILE.GET_FOUNTAIN_FAILED, data: resp };
  },

  sendVerificationSms(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      ProfileService.singleton()
        .sendVerificationSms(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc == 1) {
            dispatch(profileActions.sendVerificationSmsSuccess(resp));
          } else {
            dispatch(profileActions.sendVerificationSmsFailed(resp));
          }
        });
    };
  },
  sendVerificationSmsSuccess(resp) {
    return { type: PROFILE.SEND_VERIFICATION_SMS_SUCCESS, data: resp };
  },

  sendVerificationSmsFailed(resp) {
    return { type: PROFILE.SEND_VERIFICATION_SMS_FAILED, data: resp };
  },

  verifyPhone(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      ProfileService.singleton()
        .verifyPhone(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc == 1) {
            dispatch(profileActions.verifyPhoneSuccess(resp));
          } else {
            dispatch(profileActions.verifyPhoneFailed(resp));
          }
        });
    };
  },
  verifyPhoneSuccess(resp) {
    return { type: PROFILE.VERIFY_PHONE_SUCCESS, data: resp };
  },

  verifyPhoneFailed(resp) {
    return { type: PROFILE.VERIFY_PHONE_FAILED, data: resp };
  },

  addSharecoinDetails(params) {
    return dispatch => {
      ProfileService.singleton()
        .addSharecoinDetails(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.addSharecoinDetailsSuccess(resp));
          } else {
            dispatch(profileActions.addSharecoinDetailsFailed(resp));
          }
        });
    };
  },

  addSharecoinDetailsSuccess(resp) {
    return { type: PROFILE.ADD_SHARECOIN_SUCCESS, data: resp };
  },

  addSharecoinDetailsFailed(resp) {
    return { type: PROFILE.ADD_SHARECOIN_FAILED, data: resp };
  },

  updateSharecoinDetails(params) {
    return dispatch => {
      ProfileService.singleton()
        .updateSharecoinDetails(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.updateSharecoinDetailsSuccess(resp));
          } else {
            dispatch(profileActions.updateSharecoinDetailsFailed(resp));
          }
        });
    };
  },

  updateSharecoinDetailsSuccess(resp) {
    return { type: PROFILE.UPDATE_SHARECOIN_SUCCESS, data: resp };
  },

  updateSharecoinDetailsFailed(resp) {
    return { type: PROFILE.UPDATE_SHARECOIN_FAILED, data: resp };
  },

  getSharingCode(params) {
    return dispatch => {
      ProfileService.singleton()
        .getSharingCode(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.getSharingCodeSuccess(resp));
          } else {
            dispatch(profileActions.getSharingCodeFailed(resp));
          }
        });
    };
  },

  getSharingCodeSuccess(resp) {
    return { type: PROFILE.GET_SHARECODE_SUCCESS, data: resp };
  },

  getSharingCodeFailed(resp) {
    return { type: PROFILE.GET_SHARECODE_FAILED, data: resp };
  },

  addPayoutCode(params) {
    return dispatch => {
      ProfileService.singleton()
        .addPayoutCode(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.addPayoutCodeSuccess(resp));
          } else {
            dispatch(profileActions.addPayoutCodeFailed(resp));
          }
        });
    };
  },

  addPayoutCodeSuccess(resp) {
    return { type: PROFILE.ADD_PAYOUTCODE_SUCCESS, data: resp };
  },

  addPayoutCodeFailed(resp) {
    return { type: PROFILE.ADD_PAYOUTCODE_FAILED, data: resp };
  },

  getCurrentPayoutCode(params) {
    return dispatch => {
      ProfileService.singleton()
        .getCurrentPayoutCode(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.getCurrentPayoutCodeSuccess(resp));
          } else {
            dispatch(profileActions.getCurrentPayoutCodeFailed(resp));
          }
        });
    };
  },

  getCurrentPayoutCodeSuccess(resp) {
    return { type: PROFILE.GET_PAYOUTCODE_SUCCESS, data: resp };
  },

  getCurrentPayoutCodeFailed(resp) {
    return { type: PROFILE.GET_PAYOUTCODE_FAILED, data: resp };
  },

  removePayoutCode(params) {
    return dispatch => {
      ProfileService.singleton()
        .removePayoutCode(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.removePayoutCodeSuccess(resp));
          } else {
            dispatch(profileActions.removePayoutCodeFailed(resp));
          }
        });
    };
  },

  removePayoutCodeSuccess(resp) {
    return { type: PROFILE.REMOVE_PAYOUTCODE_SUCCESS, data: resp };
  },

  removePayoutCodeFailed(resp) {
    return { type: PROFILE.REMOVE_PAYOUTCODE_FAILED, data: resp };
  },

  validateNewSharingCode(params) {
    return dispatch => {
      ProfileService.singleton()
        .validateNewSharingCode(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.validateNewSharingCodeSuccess(resp));
          } else {
            dispatch(profileActions.validateNewSharingCodeFailed(resp));
          }
        });
    };
  },

  validateNewSharingCodeSuccess(resp) {
    return { type: PROFILE.GET_NEW_SHARECODE_SUCCESS, data: resp };
  },

  validateNewSharingCodeFailed(resp) {
    return { type: PROFILE.GET_NEW_SHARECODE_FAILED, data: resp };
  },

  getERC20Tokens(params) {
    return dispatch => {
      ProfileService.singleton()
        .getERC20Tokens(params)
        .then((resp: any) => {
          if (resp.rc == 1) {
            dispatch(profileActions.getERC20TokensSuccess(resp));
          } else {
            dispatch(profileActions.getERC20TokensFailed(resp));
          }
        });
    };
  },

  getERC20TokensSuccess(resp) {
    return { type: PROFILE.GET_ERC20_TOKENS_SUCCESS, data: resp };
  },

  getERC20TokensFailed(resp) {
    return { type: PROFILE.GET_ERC20_TOKENS_FAILED, data: resp };
  },

  updateERC20Tokens(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      ProfileService.singleton()
        .updateERC20Tokens(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc == 1) {
            dispatch(profileActions.updateERC20TokensSuccess(resp));
          } else {
            dispatch(profileActions.updateERC20TokensFailed(resp));
          }
        });
    };
  },

  updateERC20TokensSuccess(resp) {
    return { type: PROFILE.UPDATE_ERC20_TOKENS_SUCCESS, data: resp };
  },

  updateERC20TokensFailed(resp) {
    return { type: PROFILE.UPDATE_ERC20_TOKENS_FAILED, data: resp };
  },
};
