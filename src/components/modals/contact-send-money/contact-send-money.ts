import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import ContactSendMoneyTemplate from './contact-send-money.html!text';
import * as utils from '../../../model/utils';
import Constants from '../../../model/constants';
import { sendActions } from '../../../model/send/actions';
import { SEND } from '../../../model/action-types';
import BaseElement from '../../base-element';
import { CURRENCY_TYPE } from '../../../model/currency';
import CommonService from '../../../model/common/common-service';

let tag = null;

@template(ContactSendMoneyTemplate)
export default class ContactSendMoney extends BaseElement {
  private AvatarServer = Constants.AvatarServer;
  private formEnabled: boolean = true;
  private success: boolean = false;
  private confirmed: boolean = false;
  private processing_duration: number = 2.0;
  private title = this.getText('send_payment_message');
  private errorMessage = null;
  private static unsubscribe = null;
  private bcMedianTxSize = 250;
  private SatoshiPerByte = 20;
  private thresholdAmount = 0.00001 ;
  private fixedTxnFee = 0.00002;
  
  constructor() {
    super();
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.activityData;
    let actionType = state.lastAction.type;

    if (actionType === SEND.SEND_TXN_SUCCESSFUL) {
      this.formEnabled = false;
      this.success = true;
      this.processing_duration = state.sendData.processing_duration;
      this.title = this.getText('send_success_message');
      if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH)
        this.confirmed = true;
    } else if (actionType == SEND.SEND_TXN_FAILED) {
      super.showError('', state.lastAction.data);
    }

    this.update();
  }

  mounted() {
    tag = this;

    if (ContactSendMoney.unsubscribe) ContactSendMoney.unsubscribe();
    ContactSendMoney.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );

    if (parseInt(localStorage.getItem('currency_type')) != CURRENCY_TYPE.FLASH) {
      CommonService.singleton()
      .getThresHoldAmount()
      .then((resp: any) => {
        if (resp.rc === 1 && resp.threshold_amount) {
          tag.thresholdAmount = resp.threshold_amount;
        }
      });
    }

    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.BTC) {
      CommonService.singleton()
      .getBCMedianTxSize()
      .then((resp: any) => {
        if (resp.rc === 1 && resp.median_tx_size) {
          tag.bcMedianTxSize = resp.median_tx_size;
        }
      });
      CommonService.singleton()
        .getBTCSatoshiPerByte()
        .then((resp: any) => {
          tag.SatoshiPerByte = parseInt(resp.fastestFee);
        });
    }

    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.LTC) {
      CommonService.singleton()
        .getBCMedianTxSize()
        .then((resp: any) => {
          if (resp.rc === 1 && resp.median_tx_size) {
            tag.bcMedianTxSize = resp.median_tx_size;
          }
        });
      CommonService.singleton()
        .getLTCSatoshiPerByte()
        .then((resp: any) => {
          tag.SatoshiPerByte = parseInt(resp.high_fee_per_kb);
        });
    }

    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.DASH) {
      CommonService.singleton()
        .getBCMedianTxSize()
        .then((resp: any) => {
          if (resp.rc === 1 && resp.median_tx_size) {
            tag.bcMedianTxSize = resp.median_tx_size;
          }
        });
      CommonService.singleton()
        .getFixedTransactionFee()
        .then((resp: any) => {
          tag.fixedTxnFee = resp.fixed_txn_fee;
        });
    }

    $('#sendByContact').modal('show');
    $('#contact-send-amount').keypress(utils.filterNumberEdit);
    $('#contact-send-amount').blur(utils.formatAmountInput);
    $('#contact-send-bt').on('blur', this.resetErrorMessages);
  }

  sendMoney() {
    let amount = $('#contact-send-amount').val();
    amount = utils.toOrginalNumber(amount);

    if (!amount.toString().match(/^(\d+\.?\d*|\.\d+)$/)) {
      tag.errorMessage = this.getText('common_alert_int_cash_unit');
      return;
    }
    let fee = 0;
    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.DASH) {
      fee = tag.fixedTxnFee;
    } else {
      fee = utils.calcFee(amount, tag.bcMedianTxSize, tag.SatoshiPerByte);
    }

    if (amount < 1 && parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH) {
      return (tag.errorMessage = this.getText(
        'common_alert_minimum_cash_unit'
      ));
    }

    if(amount < this.thresholdAmount ){
      return (tag.errorMessage = this.getText('common_alert_threshold_amount'));
	}

    let balance = store.getState().userData.user.balance;

    if (balance >= amount && balance < amount + fee) {
      return (tag.errorMessage = this.getText('send_not_enough_fee_error'));
    }

    if (balance < amount + fee) {
      return (tag.errorMessage = this.getText('send_not_enough_fund_error'));
    }

    this.opts.sendAddr.memo = $('#Note').val();

    $('#sendByContact').modal('hide');

    riot.mount('#confirm-send', 'send-money-confirm', {
      to: this.opts.sendAddr.address,
      amount: amount,
      fee: fee,
      wallet: this.opts.sendAddr,
    });
    //store.dispatch(sendActions.createRawTx(this.opts.sendAddr, amount, memo));
  }

  resetErrorMessages() {
    tag.errorMessage = '';
    tag.update();
  }
}
