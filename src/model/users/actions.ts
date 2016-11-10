import { USERS } from '../action-types';
import { commonActions } from '../common/actions';
import store from '../store';
import UserService from './user-service';
import { riot } from '../../components/riot-ts';
import * as utils from '../utils';
import Premium from 'Premium';
import Wallet from '../wallet';
import base64 from 'crypto-js';
import nacl from 'tweetnacl';
import AndamanService from '../andaman-service';
import secrets from 'secrets.js-grempe';

export const userActions = {

    signup(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().signup(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc === 1) {
                    dispatch(userActions.signupSuccess(resp));
                } else {
                    dispatch(userActions.signupFailed(resp));
                }
            });
        };
    },

    signupSuccess(resp) {
        return { type: USERS.SIGNUP_SUCCESS, data: resp };
    },

    signupFailed(resp) {
        return { type: USERS.SIGNUP_FAILED, data: resp };
    },

    setPassword(token: string, password: string, questionA: string, answerA: string, questionB: string, answerB: string, questionC: string, answerC: string) {
        let keypair = nacl.box.keyPair();
        let pubKey = keypair.publicKey;
        let privKey = keypair.secretKey;
        let pubKeyBase64 = utils.encodeBase64(pubKey);
        let privKeyBase64 = utils.encodeBase64(privKey);

        let privKeyHex = utils.base64ToHex(privKeyBase64);
        let keyByteSize = 256;
        let encryptedPrivKey = JSON.stringify(Premium.xaesEncrypt(keyByteSize, password, privKeyHex));

        let params = {
            password: password,
            token: token,
            privateKey: encryptedPrivKey,
            publicKey: pubKeyBase64
        };

        let sc = secrets.share(privKeyHex, 3, 2);
        let answers = [answerA, answerB, answerC];

        // May hash one more time
        let checksum = answers.join("*");
        let encryptedSc1 = JSON.stringify(Premium.xaesEncrypt(keyByteSize, checksum, sc[0]));

        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().setPassword(params).then((resp: any) => {
                console.log('++++++++++++++ babv setPassword resp = ' + JSON.stringify(resp));
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc === 1) {
                    let _params = {
                        idToken: resp.profile.idToken,
                        sc1: encryptedSc1,
                        sc2: sc[1],
                        sc3: sc[2],
                        security_question_1: questionA,
                        security_question_2: questionB,
                        security_question_3: questionC
                    };

                    let userKey = {
                        idToken: resp.profile.idToken,
                        encryptedPrivKey: encryptedPrivKey,
                        publicKey: pubKeyBase64
                    };

                    let createWalletParams = {
                        sessionToken: resp.profile.sessionToken,
                        publicKey: userKey.publicKey,
                        appId: 'flashcoin'
                    }

                    utils.storeUserKey(userKey);

                    // resp.profile.auth_version
                    dispatch(userActions.setRecoveryKeys(_params, createWalletParams, password, resp.profile));
                    dispatch(userActions.setPasswordSuccess(resp.profile));
                } else {
                    dispatch(userActions.setPasswordFailed(resp));
                }
            });
        };
    },

    setPasswordSuccess(profile) {
        return { type: USERS.SET_PASSWORD_SUCCESS, data: profile };
    },

    setPasswordFailed(resp) {
        return { type: USERS.SET_PASSWORD_FAILED, data: resp };
    },

    setRecoveryKeys(params, createWalletParams, password, profile) {

        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().setRecoveryKeys(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc === 1) {
                    UserService.singleton().createFlashWallet(createWalletParams).then((_resp: any) => {
                        if (_resp.rc === 1) {
                            UserService.singleton().getMyWallets().then((__resp: any) => {
                                dispatch(userActions.loginSuccess(profile));
                                dispatch(userActions.getProfile(profile));
                                dispatch(userActions.getMyWallets(profile.auth_version, password));
                            });
                        } else {
                            console.log('+++++ createFlashWallet failed, reason:', _resp);
                        }
                    });
                    UserService.singleton().setRecoveryKeys(params).then((___resp: any) => {
                    });
                    dispatch(userActions.setRecoveryKeysSuccess(resp));
                } else {
                    dispatch(userActions.setRecoveryKeysFailed(resp));
                }
            });
        };
    },

    setRecoveryKeysSuccess(resp) {
        return { type: USERS.GET_PROFILE_SUCCESS, data: resp };
    },

    setRecoveryKeysFailed(resp) {
        return { type: USERS.SET_RECOVERY_KEY_FAILED, data: resp };
    },

    login(email, password) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().login(email, password).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc === 1) {
                    if (resp.profile.totp_enabled === 1) {
                        let loginData = { profile: resp.profile, password: password };
                        dispatch({ type: USERS.NEED_VERIFY_GOOGLE_2FA, data: loginData });
                    } else {
                        dispatch(userActions.loginSuccess(resp.profile));
                        dispatch(userActions.getProfile(resp.profile));
                        dispatch(userActions.getMyWallets(resp.profile.auth_version, password));
                    }
                } else {
                    dispatch(userActions.loginFailed(resp));
                }
            });
        };
    },
    loginFailed(resp) {
        return { type: USERS.LOGIN_FAILED, data: resp };
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
    getProfile(data) {
        return (dispatch) => {
            UserService.singleton().getProfile().then((resp: any) => {

                if (resp.rc === 1) {
                    for (var key in resp.profile) {
                        data[key] = resp.profile[key];
                    }
                    dispatch(userActions.getProfileSuccess(data));
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
    check2faCode(params) {
        return (dispatch) => {
            UserService.singleton().check2faCode(params).then((resp: any) => {

                if (resp.rc === 1) {
                    dispatch(userActions.check2faCodeSuccess(resp));
                } else {
                    dispatch(userActions.check2faCodeFailed(resp));
                }
            });
        };
    },
    check2faCodeSuccess(resp) {
        return { type: USERS.CHECK_2FA_CODE_SUCCESS, data: resp };
    },
    check2faCodeFailed(resp) {
        return { type: USERS.CHECK_2FA_CODE_FAILED, data: resp };
    },
    getMyWallets(auth_version, password = '1111') {
        return (dispatch) => {
            UserService.singleton().getMyWallets().then((resp: any) => {
                if (resp.rc === 1) {
                    if (resp.my_wallets.length > 0) {
                        decryptWallets(dispatch, resp.my_wallets, auth_version, password);
                    } else {
                        let userProfile = store.getState().userData.user;
                        let userKey = utils.getUserKey();
                        let params = {
                            sessionToken: userProfile.sessionToken,
                            publicKey: userKey.publicKey,
                            appId: 'flashcoin'
                        }

                        UserService.singleton().createFlashWallet(params).then((resp: any) => {
                            if (resp.rc === 1) {
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
    getBalance() {
        return (dispatch) => {
            UserService.singleton().getBalance().then((resp: any) => {
                if (resp.rc === 1) {
                    dispatch(userActions.getBalanceSuccess(utils.satoshiToFlash(resp.balance)));
                } else {
                    dispatch(userActions.getBalanceFailed(resp));
                }
            });
        }
    },
    getBalanceSuccess(balance) {
        return { type: USERS.GET_BALANCE_SUCCESS, data: balance };
    },
    getBalanceFailed(resp) {
        return { type: USERS.GET_BALANCE_FAILED, data: resp };
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
                        dispatch(userActions.getProfile(resp.profile));
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
        if (!clientHost || clientHost.length === 0) {
            clientHost = AndamanService.clientHost;
        }
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
            dispatch({ type: USERS.STORE_FOUNTAIN_SECRET, data: resp.wallet.secret });
        }
    });
}

function decryptPassphraseV2(dispatch, wallets, password) {
    var userProfile = store.getState().userData.user;
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
    dispatch({ type: USERS.STORE_FOUNTAIN_SECRET, data: password });
}