import AndamanService from '../andaman-service';

export default class RequestService {
    private static _instance: RequestService;

    static singleton() {
        if (!RequestService._instance) {
            RequestService._instance = new RequestService();
        }

        return RequestService._instance;
    }

    requestMoney(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.request_money(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    sendRequest(email) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.send_request(pipe, email, resp => {
                    resolve(resp);
                });
            })
        });
    }
}

