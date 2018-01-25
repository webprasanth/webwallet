import AppService from '../app-service';

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
      AppService.getInstance().addMoneyRequest(params, resp => {
        resolve(resp);
      });
    });
  }

  rosterOperation(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().rosterOperation(params, resp => {
        resolve(resp);
      });
    });
  }
}
