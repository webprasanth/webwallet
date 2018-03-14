import store from '../store';
import AppService from '../app-service';

export default class ResetPassService {
  constructor() {}

  private static _instance: ResetPassService;

  static singleton() {
    if (!ResetPassService._instance) {
      ResetPassService._instance = new ResetPassService();
    }

    return ResetPassService._instance;
  }

  ssoResetPasswordMail(params) {
    return new Promise(resolve => {
      AppService.getInstance().resetPasswordMail(params, resp => {
        resolve(resp);
      });
    });
  }

  getRecoveryKeys(params) {
    return new Promise(resolve => {
      AppService.getInstance().getRecoveryKeys(params, resp => {
        resolve(resp);
      });
    });
  }

  enableAccount(params) {
    return new Promise(resolve => {
      AppService.getInstance().enableAccount(params, resp => {
        resolve(resp);
      });
    });
  }

  ssoResetPassword(params) {
    return new Promise(resolve => {
      AppService.getInstance().resetPassword(params, resp => {
        resolve(resp);
      });
    });
  }
}
