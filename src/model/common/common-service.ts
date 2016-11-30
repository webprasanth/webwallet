import AndamanService from '../andaman-service';

export default class CommonService {
    private static _instance: CommonService;

    static singleton() {
        if (!CommonService._instance) {
            CommonService._instance = new CommonService();
        }

        return CommonService._instance;
    }

    getWalletsByEmail(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.get_wallets_by_email(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    searchWallet(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.search_wallet(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    // New transaction added handler
    onTxAdded(cb) {
        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            andaman.add_listener_add_txn(pipe, cb);
        });
    }

    onSessionExpired(cb) {
        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            andaman.add_session_invalid_listener(pipe, cb);
        });
    }

    onBeRequested(cb) {
        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            andaman.add_listener_request_money(pipe, cb);
        });
    }

    onRequestStateChanged(cb) {
        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            andaman.add_listener_mark_money_requests(pipe, cb);
        });
    }

    onDisconnect(cb) {
        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            andaman.add_disconnect_status_listener(pipe, cb);
        });
    }

    onConnect(cb) {
        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            andaman.add_connect_status_listener(pipe, cb);
        });
    }

    removeAllListeners() {
        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            andaman.remove_all_listeners(pipe);
        });
    }
}
