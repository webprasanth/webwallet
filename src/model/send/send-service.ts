import AppService from '../app-service';

export default class SendService {
  private static _instance: SendService;

  static singleton() {
    if (!SendService._instance) {
      SendService._instance = new SendService();
    }

    return SendService._instance;
  }

  createRawTx(to, amount, custom_fee, message) {
    return new Promise((resolve, reject) => {
      var userSelectedCurrency = localStorage.getItem('currency_type');
      let params = {
        publicAddress: to,
        amount: amount,
        message: message,
        currency_type: userSelectedCurrency,
        custom_fee: custom_fee
      };

      AppService.getInstance().rawTransaction(params, resp => {
        resolve(resp);
      });
    });
  }

  addTxn(params, wallet) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().addTransaction(params, resp => {
        resolve(resp);
      });
    });
  }

  markSentMoneyRequests(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().markSentMoneyRequests(params, resp => {
        resolve(resp);
      });
    });
  }

  addToRoster(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().rosterAdd(params, resp => {
        resolve(resp);
      });
    });
  }

  getTxnById(txn_info) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().transactionById(txn_info, resp => {
        resolve(resp);
      });
    });
  }

  getEthTransactionCount(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().getEthTransactionCount(params, resp => {
        resolve(resp);
      });
    });
  }
}
