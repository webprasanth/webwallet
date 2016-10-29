import AndamanService from '../andaman-service';
import store from '../store';
import * as actions from './actions';
import { storeUserKey, getUserKey } from '../utils';

export default class UserService {
    constructor() { }

    private static _instance: UserService;

    static singleton() {
        if (!UserService._instance) {
            UserService._instance = new UserService();
        }

        return UserService._instance;
    }

    signup(params) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.create_account_easy(pipe, params, function (resp) {
                    resolve(resp);
                });
            });
        });
    }

    ssoLogin() {
        return new Promise((resolve, reject) => {
            let userKey = getUserKey();
            if (userKey) {
                AndamanService.ready().then((opts) => {
                    let andaman = opts.andaman;
                    let pipe = opts.pipe;

                    let params = {
                        idToken: userKey.idToken,
                        res: 'web'
                    };

                    andaman.get_session_token_v2(pipe, params, function (resp) {
                        if (resp.rc == 1) {
                            pipe.setAuthInfo(resp.profile.auth_version, resp.profile.sessionToken);
                        }

                        resolve(resp);
                    });
                });
            }
            else {
                resolve();
            }
        });
    }

    login(email, password) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                var credentials = {
                    email: email,
                    password: password,
                    res: 'web',
                };

                andaman.sso_login_v2(pipe, credentials, function (resp) {
                    if (resp.rc == 1) {
                        pipe.setAuthInfo(resp.profile.auth_version, resp.profile.sessionToken);
                        let userKey = {
                            idToken: resp.profile.idToken,
                            encryptedPrivKey: resp.profile.privateKey,
                            publicKey: resp.profile.publicKey
                        };
                        storeUserKey(userKey);
                    }

                    resolve(resp);
                });
            });
        });
    }

    getProfile() {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.get_profile(pipe, {}, function (resp) {
                    resolve(resp);
                });
            });
        });
    }

    check2faCode(params) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.check_tfa_code(pipe, params, function (resp) {
                    if (resp.rc == 1) {
                        pipe.setSessionToken(resp.profile.sessionToken);
                    }
                    resolve(resp);
                });
            });
        });
    }

    getMyWallets() {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;
                andaman.get_my_wallets(pipe, {}, function (resp) {
                    resolve(resp);
                });
            });
        });
    }

    createFlashWallet(sessionToken, publicKey) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;
                andaman.get_my_wallets(pipe, {}, function (resp) {
                    resolve(resp);
                });
            });
        });
    }

    getWalletSecret(idToken) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.get_wallet_secret(pipe, { idToken: idToken }, resp => {
                    resolve(resp);
                });
            });
        });
    }

    getBalance() {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.get_balance(pipe, {}, resp => {
                    resolve(resp);
                });
            });
        });
    }
}