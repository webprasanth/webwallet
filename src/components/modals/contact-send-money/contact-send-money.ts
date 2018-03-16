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
  private processing_duration: number = 2.0;
  private title = this.getText('send_payment_message');
  private errorMessage = null;
  private static unsubscribe = null;
  private bcMedianTxSize = 250;
  private BTCSatoshiPerByte = 20;

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
        tag.BTCSatoshiPerByte = parseInt(resp.fastestFee);
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

    let fee = utils.calcFee(amount, tag.bcMedianTxSize, tag.BTCSatoshiPerByte);

    if (amount < 1) {
      return (tag.errorMessage = this.getText(
        'common_alert_minimum_cash_unit'
      ));
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
