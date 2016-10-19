import AndamanService from '../andaman-service';

export default class SendService {
    private static _instance: SendService;

    static singleton() {
        if (!SendService._instance) {
            SendService._instance = new SendService();
        }

        return SendService._instance;
    }

    createRawTx(to, amount, message) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then((opts) => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                let params = {
                    to_address: to,
                    amount: amount,
                    message: message
                };

                andaman.create_unsigned_raw_txn(pipe, params, (resp) => {
                    resolve(resp);
                });
            });
        });
    }

    addTxn(txn_info, wallet) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;
                andaman.add_txn(pipe, txn_info, resp => {
                    resolve(resp);
                });
            }).catch(reason => {
                console.log(reason);
            });
        });
    }

    markSentMoneyRequests(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.mark_sent_money_requests(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    addToRoster(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.add_to_roster(pipe, params, resp => {
                    resolve(resp);
                });
            });
        })
    }

    getTxnById(txn_info) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.get_txn_by_id(pipe, txn_info, resp => {
                    resolve(resp);
                });
            });
        })
    }
}

