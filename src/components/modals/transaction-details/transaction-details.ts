import { riot, template, Element } from '../../riot-ts';
import TransactionDetailsTemplate from './transaction-details.html!text';
import store from '../../../model/store';
import Constants from '../../../model/constants';
import {
  decimalFormat,
  satoshiToFlash,
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

  satoshiToFlash = satoshiToFlash;
  formatCurrency = formatCurrency;
  decimalFormat = decimalFormat;
  getDisplayDateTime = getDisplayDateTime;
  localizeFlash = localizeFlash;

  constructor() {
    super();
  }

  mounted() {
    var self = this;
    $('#txDetailDlg').modal('show');
    $('#txDetailDlg').on('hidden.bs.modal', function() {
      if (self.opts.cb) {
        self.opts.cb();
      }
    });
  }
}
