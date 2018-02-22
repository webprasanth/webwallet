import AppService from '../app-service';

export default class CommonService {
  private static _instance: CommonService;
  private getMessageIntervalId;
  private static messageHandler;

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

  addListeners(handler) {
    if (this.getMessageIntervalId != 0) {
      CommonService.messageHandler = handler;
      this.getMessageIntervalId = setInterval(this.getMessage, 60000);
    }
  }

  removeAllListeners() {
    clearInterval(this.getMessageIntervalId);
    this.getMessageIntervalId = 0;
  }

  getMessage() {
    var userSelectedCurrency = localStorage.getItem('currency_type');
    let params = {
      offset: 0,
      size: 5,
      date_from: 0,
      currency_type: userSelectedCurrency,
    };
    AppService.getInstance().getMessages(params, CommonService.messageHandler);
  }
}
