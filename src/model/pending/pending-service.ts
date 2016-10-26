import AndamanService from '../andaman-service';

export default class PendingService {
    private static _instance: PendingService;

    static singleton() {
        if (!PendingService._instance) {
            PendingService._instance = new PendingService();
        }

        return PendingService._instance;
    }

    getRequests(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.get_requests(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    markRejectedMoneyRequests(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.mark_rejected_money_requests(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    markCancelledMoneyRequests(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.mark_cancelled_money_requests(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }
}

