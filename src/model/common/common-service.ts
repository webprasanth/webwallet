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
}
