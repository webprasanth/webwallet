import Big from 'big.js';
import AppService from '../app-service';

export default class ActivityService {
  private static _instance: ActivityService;
  constructor() {}
  static singleton() {
    if (!ActivityService._instance) {
      ActivityService._instance = new ActivityService();
    }

    return ActivityService._instance;
  }

  getTransList(pageSettings) {
    return new Promise(resolve => {
      let {
        date_from,
        date_to,
        type,
        start,
        size = 10,
        order = 'desc',
      } = pageSettings;
      var credentials = {
        date_from: date_from,
        date_to: date_to,
        type: type,
        start: start,
        size: size,
        order: order,
      };
      AppService.getInstance().getTransactions(credentials, resp => {
        resolve(resp);
      });
    });
  }

  getTransactionDetail(transactionId) {
    return new Promise(resolve => {
      let params = {
        transaction_id: transactionId,
      };
      AppService.getInstance().getTransactionDetail(params, resp => {
        resolve(resp);
      });
    });
  }

  convertToTnx(obj) {
    let tran = {
      id: obj.txid,
      amount: new Big(obj.vout[0].value).times(100000000),
      timestamp: obj.time,
      confirmations: obj.confirmations,
      fee: obj.fees * 100000000,
      ins: [],
      outs: [],
    };

    let temp = null;

    for (let i = 0; i < obj.vin.length; i++) {
      temp = obj.vin[i];
      tran.ins.push({
        address: temp.addr,
        amount: new Big(temp.value).times(100000000),
      });
    }

    for (let i = 0; i < obj.vout.length; i++) {
      temp = obj.vout[i];
      tran.outs.push({
        address: temp.scriptPubKey.addresses[0],
        amount: new Big(temp.value).times(100000000),
      });
    }

    return tran;
  }
}
