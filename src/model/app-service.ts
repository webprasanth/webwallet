
import { storeUserKey, getUserKey } from './utils';
const HOST_URL = "https://keys.flashcoin.io/"

export default class AppService {

    private authVersion = 4;
    private sessionToken = "";
    private static _instance: AppService;    

    constructor() { }

    static getInstance() {
        if (!AppService._instance) {
            AppService._instance = new AppService();
        }

        return AppService._instance;
    }

    searchWallet(params, cb) {
        let options = this.makeRequestOption('api/search-wallet', params, 'post', cb);
        $.ajax(options);
    }

    getWalletsByEmail(params, cb) {
        let options = this.makeRequestOption('api/get-wallets-by-email', params, 'post', cb)
        $.ajax(options);
    }

    balance(params, cb) {
        let options = this.makeRequestOption('api/balance', params, 'get', cb)
        $.ajax(options);
    }

    walletSecret(idToken, cb) {
        let options = this.makeRequestOption('api/wallet-secret', {}, 'get', cb)
        options.headers.authorization = idToken
        $.ajax(options);
    }

    myWallets(params, cb) {
        let options = this.makeRequestOption('api/my-wallets', params, 'get', cb)
        $.ajax(options);
    }

    check2faCode(params, cb) {
        let self = this
        let _cb = function(resp) {
            if (resp.rc == 1) {
                self.sessionToken = resp.profile.sessionToken
            }
            cb(resp);
        }
        let options = this.makeRequestOption('api/check-2fa-code', params, 'post', _cb)
        $.ajax(options);
    }

    profile(params, cb) {
        let options = this.makeRequestOption('api/profile', params, 'get', cb)
        $.ajax(options);
    }

    login(params, cb) {
        let self = this
        let _cb = function(resp) {
            if (resp.rc == 1) {
                self.setAuthInfo(resp.profile.auth_version, resp.profile.sessionToken);
                let userKey = {
                    idToken: resp.profile.idToken,
                    encryptedPrivKey: resp.profile.privateKey,
                    publicKey: resp.profile.publicKey
                };
                storeUserKey(userKey);
            }
            cb(resp)
        }
        let options = this.makeRequestOption('api/login', params, 'post', _cb)
        $.ajax(options);
    }

    session(params, cb) {
        let options = this.makeRequestOption('api/session', params, 'post', cb)
        $.ajax(options);
    }

    resetPassword(params, cb) {
        let options = this.makeRequestOption('api/reset-password', params, 'post', cb)
        $.ajax(options);
    }

    resetPasswordMail(params, cb) {
        let options = this.makeRequestOption('api/reset-password-mail', params, 'post', cb)
        $.ajax(options);
    }

    getRecoveryKeys(params, cb) {
        let options = this.makeRequestOption('api/getRecoveryKeys', params, 'post', cb)
        $.ajax(options);
    }

    createFlashWallet(params, cb) {
        let options = this.makeRequestOption('api/createFlashWallet', params, 'post', cb)
        $.ajax(options);
    }

    setRecoveryKeys(params, cb) {
        let options = this.makeRequestOption('api/setRecoveryKeys', params, 'post', cb)
        $.ajax(options);
    }

    setPassword(params, cb) {
        let self = this
        let _cb = function(resp) {
            if (resp.rc == 1) {
                self.setAuthInfo(resp.profile.auth_version, resp.profile.sessionToken);
            }
            cb(resp)
        }
        let options = this.makeRequestOption('api/setPassword', params, 'post', _cb)
        $.ajax(options);
    }

    createEasy(params, cb) {
        let options = this.makeRequestOption('api/createEasy', params, 'post', cb)
        $.ajax(options);
    }

    getTransactions(params, cb) {
        let options = this.makeRequestOption('api/get-transactions', params, 'post', cb)
        $.ajax(options);
    }

    getTransactionDetail(params, cb) {
        let options = this.makeRequestOption('api/transaction-detail', params, 'get', cb)
        $.ajax(options);
    }

    setAuthInfo(authVersion, sessionToken) {
        this.authVersion =  authVersion
        this.sessionToken = sessionToken
    }

    private makeRequestOption(url, params, method, cb) {
        return {
            url: HOST_URL + url,
            type: method,
            data: params,
            headers: {
                'authorization': this.sessionToken,
                'fl_auth_version': this.authVersion
            },
            dataType: 'json',
            success: function (resp) {
                cb(resp)
            }
        }
    }
}