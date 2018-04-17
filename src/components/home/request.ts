import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeRequestTemplate from './request.html!text';
import CommonService from '../../model/common/common-service';
import * as utils from '../../model/utils';
import BaseElement from '../base-element';
import _ from 'lodash';
import Constants from '../../model/constants';
import { FCEvent } from '../../model/types';
import { commonActions } from '../../model/common/actions';
import { CURRENCY_TYPE } from '../../model/currency';

let tag = null;

@template(HomeRequestTemplate)
export default class HomeRequest extends BaseElement {
  private userProfile = null;
  private receiverWallet = null;
  private isValidAddress = false;
  private emailErrorMessage = '';
  private amountErrorMessage = '';
  private choosingAddress = false;
  private addressSelected = false;
  private avatarServer = Constants.AvatarServer;
  private thresholdAmount = 0.00001 ;

  mounted() {
    tag = this;
    this.userProfile = store.getState().userData.user;
    $('#rq_to_email_id').on(
      'propertychange change click  paste',
      _.debounce(e => {
        this.searchWallet();
      }, 500)
    );
    $('#rq_to_email_id').on(
      'propertychange change click  paste',
      this.checkAddress
    );
    $('#continue-request-bt').on('blur', this.resetErrorMessages);
    $('#requestAmount').on('blur', utils.formatAmountInput);
    $('#requestAmount').keypress(utils.filterNumberEdit);
  }

  checkAddress() {
    let term = $('#rq_to_email_id').val();

    if (term == '') {
      tag.isValidAddress = false;
      tag.update();
      return;
    }

    if (utils.isValidCryptoAddress(term)) {
      tag.receiverWallet = {};
      tag.receiverWallet.address = term;
      tag.isValidAddress = true;
      tag.addressSelected = true;
      tag.choosingAddress = false;
      tag.update();
      return;
    }
  }

  searchWallet = () => {
    tag.choosingAddress = true;
    var userSelectedCurrency = localStorage.getItem('currency_type');
    let term: string = $('#rq_to_email_id').val();

    let params = {
      term,
      start: 0,
      size: 1,
      currency_type: userSelectedCurrency,
    };

    CommonService.singleton()
      .searchWallet(params)
      .then((resp: any) => {
        if (resp.rc === 1 && resp.wallets.length > 0) {
          if (resp.wallets.length == 1 && term == resp.wallets[0].email) {
            tag.isValidAddress = true;
            tag.receiverWallet = resp.wallets[0];
            tag.addressSelected = true;
            tag.choosingAddress = false;
          } else {
            tag.isValidAddress = false;
            tag.addressSelected = false;
          }
        }
        this.update();
      });
  };

  chooseAddress(event: FCEvent) {
    event.preventDefault();
    event.stopPropagation();

    console.log('chooseAddress');
    $('#rq_to_email_id').val(event.item.w.email);
    tag.receiverWallet = event.item.w;
    tag.isValidAddress = true;
    tag.addressSelected = true;
    tag.choosingAddress = false;
    tag.update();
  }

  checkAndShowComfirmationForm() {
    let receiverEmail = $('#rq_to_email_id').val();

    if (!receiverEmail) {
      this.emailErrorMessage = this.getText('invalid_request_receiver_error');
      return;
    } else if (!tag.isValidAddress) {
      this.emailErrorMessage = this.getText('invalid_receiver_address_error');
      return;
    }

    let amount = $('#requestAmount').val();
    amount = utils.toOrginalNumber(amount);

    if (!amount.toString().match(/^(\d+\.?\d*|\.\d+)$/)) {
      this.amountErrorMessage = this.getText('common_alert_int_cash_unit');
      return;
    }

    if (amount < 1 && parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH) {
      this.amountErrorMessage = this.getText('common_alert_minimum_cash_unit');
      return;
    }

    if (parseInt(localStorage.getItem('currency_type')) != CURRENCY_TYPE.FLASH) {
      CommonService.singleton()
      .getThresHoldAmount()
      .then((resp: any) => {
        if (resp.rc === 1 && resp.threshold_amount) {
          tag.thresholdAmount = resp.threshold_amount;
        }
      });
    }

    if(amount < this.thresholdAmount ){
      tag.amountErrorMessage = this.getText('common_alert_threshold_amount');
      return;
	}
	
    this.receiverWallet.memo = $('#requestPaymentMemo').val();

    let callback = function() {
      this.clearForms();
    }.bind(this);

    return riot.mount('#confirm-send', 'send-request-confirm', {
      uid: this.receiverWallet.username,
      receiver_email: receiverEmail,
      sender_note: this.receiverWallet.memo,
      amount: amount,
      receiverWallet: this.receiverWallet,
      cb: callback,
    });
  }

  onContinueButtonClick(event: Event) {
    this.checkAndShowComfirmationForm();
  }

  clearForms() {
    $('#rq_to_email_id').val('');
    $('#requestAmount').val('');
    $('#requestPaymentMemo').val('');
    tag.isValidAddress = false;
    this.resetErrorMessages();
  }

  resetErrorMessages() {
    tag.emailErrorMessage = '';
    tag.amountErrorMessage = '';
    tag.update();
  }
}
