
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

    setAuthInfo(authVersion, sessionToken) {
        this.authVersion =  authVersion
        this.sessionToken = sessionToken
    }

    getTransactions(params, cb) {
        let options = this.makeRequestOption('api/get-transactions', params, 'post', cb)
        $.ajax(options);
    }

    getTransactionDetail(params, cb) {
        let options = this.makeRequestOption('api/transaction-detail', params, 'get', cb)
        $.ajax(options);
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