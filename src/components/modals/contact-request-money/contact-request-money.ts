import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import ContactRequestMoneyTemplate from './contact-request-money.html!text';
import * as utils from '../../../model/utils';
import Constants from '../../../model/constants';
import { requestActions } from '../../../model/request/actions';
import { REQUEST } from '../../../model/action-types';
import BaseElement from '../../base-element';
import { CURRENCY_TYPE } from '../../../model/currency';

let tag = null;

@template(ContactRequestMoneyTemplate)
export default class ContactRequestMoney extends BaseElement {
  private formEnabled: boolean = true;
  private requestSuccess: boolean = false;
  private formatCurrency = utils.formatCurrency;
  private AvatarServer = Constants.AvatarServer;
  private errorMessage = null;

  constructor() {
    super();
  }

  mounted() {
    tag = this;
    $('#requestByContact').modal('show');
    $('#contact-request-amount').keypress(utils.filterNumberEdit);
    $('#contact-request-amount').blur(utils.formatAmountInput);
    $('#contact-request-bt').on('blur', this.resetErrorMessages);
  }

  sendRequestDirect() {
    let amount = $('#contact-request-amount').val();
    amount = utils.toOrginalNumber(amount);

    if (!amount.toString().match(/^(\d+\.?\d*|\.\d+)$/)) {
      tag.errorMessage = this.getText('common_alert_int_cash_unit');
      return;
    }

    if (amount < 1 && parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH) {
      return (tag.errorMessage = this.getText(
        'common_alert_minimum_cash_unit'
      ));
    }

    let note = $('#Note').val();

    $('#requestByContact').modal('hide');

    riot.mount('#confirm-send', 'send-request-confirm', {
      uid: this.opts.sendAddr.username,
      receiver_email: this.opts.sendAddr.email,
      sender_note: note,
      amount,
      receiverWallet: this.opts.sendAddr,
    });
  }

  resetErrorMessages() {
    tag.errorMessage = '';
    tag.update();
  }
}
