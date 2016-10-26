import { RESET_PASS } from '../action-types';
import { commonActions } from '../common/actions';
import store from '../store';
import ResetPassService from './reset-pass-service';
import { riot } from '../../components/riot-ts';
import * as utils from '../utils';
import Premium from 'Premium';
import Wallet from '../wallet';
import base64 from 'crypto-js';
import nacl from 'tweetnacl';
import AndamanService from '../andaman-service';

export const resetPassActions = {
    ssoResetPasswordMail(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ResetPassService.singleton().ssoResetPasswordMail(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(resetPassActions.ssoResetPasswordMailSuccess());
                } else {
                    dispatch(resetPassActions.ssoResetPasswordMailFailed(resp));
                }
            });
        }
    },
    ssoResetPasswordMailSuccess() {
        return { type: RESET_PASS.SSO_RESET_PASSWORD_MAIL_SUCCESS };
    },
    ssoResetPasswordMailFailed(resp) {
        return { type: RESET_PASS.SSO_RESET_PASSWORD_MAIL_FAILED, data: resp.reason };
    },
    getRecoveryKeys(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ResetPassService.singleton().getRecoveryKeys(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(resetPassActions.getRecoveryKeysSuccess(resp));
                } else {
                    dispatch(resetPassActions.getRecoveryKeysFailed(resp));
                }
            });
        }
    },
    getRecoveryKeysSuccess(resp) {
        return { type: RESET_PASS.GET_RECOVERY_KEYS_SUCCESS, data: resp.keys };
    },
    getRecoveryKeysFailed(resp) {
        return { type: RESET_PASS.GET_RECOVERY_KEYS_FAILED, data: resp };
    },
    ssoResetPassword(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ResetPassService.singleton().ssoResetPassword(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(resetPassActions.ssoResetPasswordSuccess(resp));
                } else {
                    dispatch(resetPassActions.ssoResetPasswordFailed(resp));
                }
            });
        }
    },
    ssoResetPasswordSuccess(resp) {
        return { type: RESET_PASS.SSO_RESET_PASSWORD_SUCCESS, data: resp };
    },
    ssoResetPasswordFailed(resp) {
        return { type: RESET_PASS.SSO_RESET_PASSWORD_FAILED, data: resp };
    }
};

