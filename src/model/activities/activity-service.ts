import Big from 'big.js';
import AppService from '../app-service';
import { CURRENCY_TYPE } from '../currency';
import { ethToWei, weiToEth } from '../utils';

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
      var userSelectedCurrency = localStorage.getItem('currency_type');
      var credentials = {
        date_from: date_from,
        date_to: date_to,
        type: type,
        start: start,
        size: size,
        order: order,
        currency_type: userSelectedCurrency,
      };
      AppService.getInstance().getTransactions(credentials, resp => {
        resolve(resp);
      });
    });
  }

  getTransactionDetail(transactionId) {
    return new Promise(resolve => {
      var userSelectedCurrency = localStorage.getItem('currency_type');
      let params = {
        transaction_id: transactionId,
        currency_type: userSelectedCurrency,
      };
      AppService.getInstance().getTransactionDetail(params, resp => {
        resolve(resp);
      });
    });
  }

  convertToTnx(obj) {
    var userSelectedCurrency = parseInt(localStorage.getItem('currency_type'));
    if(userSelectedCurrency == CURRENCY_TYPE.ETH)
      return this.convertToTxnFromEtherBasedTxn(obj);

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

    if(obj.status)
      tran.status = obj.status;

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

  convertToTxnFromEtherBasedTxn(obj) {
    let tran = {
      id: obj.hash,
      amount: weiToEth(obj.value),
      timestamp: '',
      confirmations: obj.confirmations,
      fee: obj.gas * parseInt(obj.gasPrice),
      ins: [],
      outs: [],
    };
    let temp = null;

    if(obj.status)
      tran.status = obj.status;

    
    tran.ins.push({
      address: obj.from,
      amount: weiToEth(obj.value),
    });
    

    tran.outs.push({
        address: obj.to,
        amount: weiToEth(obj.value),
      });

    return tran;
  }
}
