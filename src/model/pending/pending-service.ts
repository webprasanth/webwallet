import AppService from '../app-service';

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
      AppService.getInstance().getRequests(params, resp => {
        resolve(resp);
      });
    });
  }

  markRejectedMoneyRequests(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().markRejectedMoneyRequests(params, resp => {
        resolve(resp);
      });
    });
  }

  markCancelledMoneyRequests(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().markCancelledMoneyRequests(params, resp => {
        resolve(resp);
      });
    });
  }
}
