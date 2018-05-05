import { riot, template, Element } from '../../riot-ts';
import TransactionDetailsTemplate from './transaction-details.html!text';
import store from '../../../model/store';
import Constants from '../../../model/constants';
import {
  decimalFormat,
  satoshiToFlash,
  satoshiToBtc,
  litoshiToLtc,
  duffToDash,
  formatCurrency,
  getDisplayDateTime,
  localizeFlash,
} from '../../../model/utils';

import { getText } from '../../localise';
import { CURRENCY_TYPE, getCurrencyUnitUpcase } from '../../../model/currency';

@template(TransactionDetailsTemplate)
export default class TransactionDetails extends Element {
  private txnDetail = store.getState().activityData.txn_detail;
  private meta = store.getState().activityData.txn_detail.meta;
  private getText = getText;
  private getCurrencyUnitUpcase = getCurrencyUnitUpcase;
  private AvatarServer = Constants.AvatarServer;
  private CURRENCY_TYPE = CURRENCY_TYPE;
  private showConfirmationNotice = false;

  satoshiToFlash = satoshiToFlash;
  satoshiToBtc = satoshiToBtc;
  litoshiToLtc = litoshiToLtc;
  duffToDash = duffToDash;
  formatCurrency = formatCurrency;
  decimalFormat = decimalFormat;
  getDisplayDateTime = getDisplayDateTime;
  localizeFlash = localizeFlash;

  constructor() {
    super();
  }

  mounted() {
    var self = this;

    let currency_type = parseInt(localStorage.getItem('currency_type'));
    switch (currency_type) {
      case CURRENCY_TYPE.BTC:
        this.txnDetail.fee = satoshiToBtc(this.txnDetail.fee);
        this.showConfirmationNotice = true;
        break;
      case CURRENCY_TYPE.LTC:
        this.txnDetail.fee = litoshiToLtc(this.txnDetail.fee);
        this.showConfirmationNotice = true;
        break;
      case CURRENCY_TYPE.DASH:
        this.txnDetail.fee = duffToDash(this.txnDetail.fee);
        this.showConfirmationNotice = true;
        break;
      case CURRENCY_TYPE.FLASH:
      default:
        this.txnDetail.fee = satoshiToFlash(this.txnDetail.fee);
        break;
    }
    this.update();

    $('#txDetailDlg').modal('show');
    $('#txDetailDlg').on('hidden.bs.modal', function() {
      if (self.opts.cb) {
        self.opts.cb();
      }
    });
  }
}
