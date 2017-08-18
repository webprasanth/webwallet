
import AppService from '../app-service'

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
            AppService.getInstance().getWalletsByEmail(params, resp => {
                resolve(resp);
            });
        });
    }

    searchWallet(params) {
        return new Promise((resolve, reject) => {
            AppService.getInstance().searchWallet(params, resp => {
                resolve(resp);
            });
        });
    }
}
