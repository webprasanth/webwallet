import { USERS } from '../action-types';
import { commonActions } from '../commons/actions';
import store from '../store';
import UserService from './user-service';
import { riot } from '../../components/riot-ts';
import * as utils from '../utils';
import Premium from 'Premium';
import Wallet from '../wallet';
import base64 from 'crypto-js';
import nacl from 'tweetnacl';

export const userActions = {
    login(email, password) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().login(email, password).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc === 1) {
                    dispatch(userActions.loginSuccess(resp.profile));
                    dispatch(userActions.getProfile());
                    dispatch(userActions.getMyWallets(resp.profile.auth_version, password));
                } else {
                    dispatch(userActions.loginFailed(resp));
                }
            });
        };
    },
    loginFailed(error) {
        return { type: USERS.LOGIN_FAILED, data: { error } };
    },
    loginSuccess(user) {
        return { type: USERS.LOGIN_SUCCESS, data: user };
    },
    logout() {
        return (dispatch) => {
            utils.removeUserKey();
            dispatch(userActions._logout());
        };
    },
    _logout() {
        return { type: USERS.LOGOUT };
    },
    getProfile() {
        return (dispatch) => {
            UserService.singleton().getProfile().then((resp: any) => {
                console.log('+++++ get_profile resp = ' + JSON.stringify(resp));

                if (resp.rc === 1) {
                    dispatch(userActions.getProfileSuccess(resp.profile));
                } else {
                    dispatch(userActions.getProfileFailed(resp));
                }
            });
        };
    },
    getProfileSuccess(profile) {
        return { type: USERS.GET_PROFILE_SUCCESS, data: profile };
    },
    getProfileFailed(resp) {
        return { type: USERS.GET_PROFILE_FAILED, data: resp };
    },
    getMyWallets(auth_version?, password = '1111') {
        return (dispatch) => {
            UserService.singleton().getMyWallets().then((resp: any) => {
                if (resp.rc === 1) {
                    if (resp.my_wallets.length > 0) {
                        decryptWallets(dispatch, resp.my_wallets, auth_version, password);
                    } else {
                        let userProfile = store.getState().userData.user;
                        let userKey = utils.getUserKey();
                        UserService.singleton().createFlashWallet(userProfile.sessionToken, userKey.publicKey).then((resp: any) => {
                            if (resp.rc === 1) {
                                console.log('createFlashWallet success');
                                UserService.singleton().getMyWallets().then((resp: any) => {
                                    if (resp.rc === 1) {
                                        decryptWallets(dispatch, resp.my_wallets, auth_version, password);
                                    } else {
                                        dispatch(userActions.getMyWalletsFailed(resp));
                                    }
                                });
                            } else {
                                console.log('createFlashWallet failed, reason:', resp);
                            }
                        });
                    }
                } else {
                    dispatch(userActions.getMyWalletsFailed(resp));
                }
            });
        };
    },
    getMyWalletsSuccess(wallets) {
        return { type: USERS.GET_MY_WALLETS_SUCCESS, data: wallets };
    },
    getMyWalletsFailed(resp) {
        return { type: USERS.GET_MY_WALLETS_FAILED, data: resp };
    },
    rememberMe(remember) {
        return { type: USERS.REMEMBER_ME, data: remember };
    },
    ssoLogin() {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().ssoLogin().then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp) {
                    if (resp.rc == 1) {
                        dispatch(userActions.ssoLoginSuccess(resp.profile));
                        dispatch(userActions.getProfile());
                        dispatch(userActions.getMyWallets(resp.profile.auth_version));;
                    } else {
                        dispatch(userActions.ssoLoginFailed(resp));
                    }
                }
            });
        };
    },
    ssoLoginSuccess(profile) {
        return { type: USERS.SSO_LOGIN_SUCCESS, data: profile };
    },
    ssoLoginFailed(resp) {
        return { type: USERS.SSO_LOGIN_FAILED, data: resp };
    },
    saveAccessToken() {
        var state = store.getState();
        var user = state.userData.user;

        if (user) {
            localStorage.setItem('access_token', user.idToken);
        }

        return { type: USERS.SAVE_ACCESS_TOKEN };
    },
    removeAccessToken() {
        localStorage.removeItem('access_token');

        return { type: USERS.REMOVE_ACCESS_TOKEN };
    },
    forgotPassword() {
        let clientHost = window.location.host;

        riot.route("reset_password?token=");
        return { type: USERS.FORGOT_PASSWORD };
    }
};

function decryptWallets(dispatch, wallets, auth_version, password) {
    if (auth_version === 3) {
        decryptPassphraseV1(dispatch, wallets);
    } else {
        decryptPassphraseV2(dispatch, wallets, password);
    }
}

function decryptPassphraseV1(dispatch, wallets) {
    let userProfile = store.getState().userData.user;
    let userKey = utils.getUserKey();
    UserService.singleton().getWalletSecret(userKey.idToken).then((resp: any) => {
        if (resp.rc === 1) {
            let decryptedWallets = wallets.map(w => {
                let str = utils.b64DecodeUnicode(w.passphrase);
                w.pure_passphrase = Premium.xaesDecrypt(resp.wallet.secret, str);
                w.email = userProfile.email;
                return new Wallet().openWallet(w);
            });
            dispatch(userActions.getMyWalletsSuccess(decryptedWallets));
        }
    });
}

function decryptPassphraseV2(dispatch, wallets, password) {
    let userProfile = store.getState().userData.user;
    let userKey = utils.getUserKey();
    let nonce = 'nnfyPFFbK7NdGtf73uGwt+CsS6mHAmAq';
    let casPubKey = 'vjPu6e8nhoxfLNxmNzNxXYr++1onlC1XuAt3VdxLISQ=';
    let box = null;
    let originMessage = null;
    let privKeyHex = Premium.xaesDecrypt(password, userKey.encryptedPrivKey);
    let privKeyBase64 = utils.hexToBase64(privKeyHex);

    let keyPair = nacl.box.keyPair.fromSecretKey(utils.decodeBase64(privKeyBase64));

    if (!keyPair) {
        return;
    }

    let decryptedWallets = wallets.map(w => {
        box = utils.decodeBase64(w.passphrase);
        originMessage = nacl.box.open(box, utils.decodeBase64(nonce), utils.decodeBase64(casPubKey), keyPair.secretKey);
        w.pure_passphrase = utils.strFromUtf8Ab(originMessage);
        w.email = userProfile.email;
        return new Wallet().openWallet(w);
    });

    dispatch(userActions.getMyWalletsSuccess(decryptedWallets));
}