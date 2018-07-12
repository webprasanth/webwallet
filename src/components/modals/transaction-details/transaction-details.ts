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
  formatAmountInput,
  getDisplayDateTime,
  localizeFlash,
  weiToEth,
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
  private total_amount = 0;

  satoshiToFlash = satoshiToFlash;
  satoshiToBtc = satoshiToBtc;
  litoshiToLtc = litoshiToLtc;
  duffToDash = duffToDash;
  formatCurrency = formatCurrency;
  decimalFormat = decimalFormat;
  getDisplayDateTime = getDisplayDateTime;
  localizeFlash = localizeFlash;
  formatAmountInput = formatAmountInput;

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
      case CURRENCY_TYPE.ETH:
        this.txnDetail.fee = weiToEth(this.txnDetail.fee);
        this.showConfirmationNotice = true;
        break;
      case CURRENCY_TYPE.FLASH:
      default:
        this.txnDetail.fee = satoshiToFlash(this.txnDetail.fee);
        break;
    }

    let total_amount = this.meta.amount;
    if (this.meta.type == 1) {
      total_amount = parseFloat((total_amount + this.txnDetail.fee).toFixed(8));
      if (this.meta.sharing_fee > 0)
        total_amount = parseFloat(
          (total_amount + this.meta.sharing_fee).toFixed(8)
        );
    }
    this.total_amount = total_amount;

    this.update();

    $('#txDetailDlg').modal('show');
    $('#txDetailDlg').on('hidden.bs.modal', function() {
      if (self.opts.cb) {
        self.opts.cb();
      }
    });
  }
}
