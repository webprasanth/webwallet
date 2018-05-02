import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeSendTemplate from './send.html!text';
import CommonService from '../../model/common/common-service';
import * as utils from '../../model/utils';
import BaseElement from '../base-element';
import _ from 'lodash';
import qrCodeScanner from 'maulikvora/qr-code-scanner';
import Constants from '../../model/constants';
import { FCEvent } from '../../model/types';
import { CURRENCY_TYPE } from '../../model/currency';
import { USERS } from '../../model/action-types';

let tag = null;

@template(HomeSendTemplate)
export default class HomeSend extends BaseElement {
  private userProfile = null;
  private sendWallet: any;
  private isValidAddress = false;
  private emailErrorMessage = '';
  private amountErrorMessage = '';
  private choosingAddress = false;
  private addressSelected = false;
  private avatarServer = Constants.AvatarServer;
  private isDesktop = utils.isDesktop();
  private bcMedianTxSize = 250;
  private SatoshiPerByte = 20;
  private thresholdAmount = 0.00001 ;
  private fixedTxnFee = 0.00002;  //This we will get from API call for DASH

  mounted() {
  
  let state = store.getState();
    if (HomeSend.unsubscribe) HomeSend.unsubscribe();
    HomeSend.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
	
    tag = this;
    this.userProfile = store.getState().userData.user;
    $('#to-email-id').on(
      'propertychange change click paste',
      _.debounce(e => {
        this.searchWallet();
      }, 500)
    );
    $('#to-email-id').on(
      'propertychange change click paste',
      this.checkAddress
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

    $('#amount-input').on(
      'propertychange change click paste',
      this.calculateFee
    );

    $('#continue-send-bt').on('blur', this.resetErrorMessages);
    $('#amount-input').on('blur', utils.formatAmountInput);
    $('#amount-input').keypress(utils.filterNumberEdit);
  }

  onApplicationStateChanged() {
    let state: ApplicationState = store.getState();
    if(state.lastAction.type == USERS.GET_BALANCE_SUCCESS) {
        this.userProfile = store.getState().userData.user;
      }
    this.update();
  }

  checkAddress() {
    let term = $('#to-email-id').val();

    if (term == '') {
      tag.isValidAddress = false;
      tag.update();
      return;
    }

    if (
      utils.isValidCryptoAddress(term) &&
      term != store.getState().profileData.wallet.address
    ) {
      tag.sendWallet = {};
      tag.sendWallet.address = term;
      tag.isValidAddress = true;
      tag.addressSelected = true;
      tag.choosingAddress = false;
      tag.update();
      return;
    }
  }

  calculateFee() {
    let amount = $('#amount-input').val();
    let fee = 0;
    amount = utils.toOrginalNumber(amount);
    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.DASH) {
      fee = tag.fixedTxnFee;
    } else {
      fee = utils.calcFee(amount, tag.bcMedianTxSize, tag.SatoshiPerByte);
    }
    $('#fee-input').val(fee);
  }

  searchWallet = () => {
    tag.choosingAddress = true;
    var userSelectedCurrency = localStorage.getItem('currency_type');
    let term: string = $('#to-email-id').val();
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
            tag.sendWallet = resp.wallets[0];
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

    $('#to-email-id').val(event.item.w.email);
    tag.sendWallet = event.item.w;
    tag.isValidAddress = true;
    tag.addressSelected = true;
    tag.choosingAddress = false;
    tag.update();
  }

  checkAndShowComfirmationForm() {
    if (!$('#to-email-id').val()) {
      this.emailErrorMessage = this.getText('invalid_send_receiver_error');
      return;
    } else if (!tag.isValidAddress) {
      this.emailErrorMessage = this.getText('invalid_receiver_address_error');
      return;
    }
    else {
      //checking if entered value and selected address is same
      if(tag.sendWallet.address != $('#to-email-id').val()) {
        if(typeof tag.sendWallet.email == undefined || tag.sendWallet.email != $('#to-email-id').val()) {
          tag.isValidAddress = false;
          tag.addressSelected = false;
          this.emailErrorMessage = this.getText('invalid_receiver_address_error');
          return;
        }
      }
    }

    if (utils.isValidCryptoAddress($('#to-email-id').val())) {
      // # disable checking phone verification to do withdraw
      // if (store.getState().userData.user.phone_verified == 0) {
      //     super.showMessage('', 'You need to provide and verify your phone number.', () => {
      //         route('profile');
      //     });
      //     return;
      // }
    }

    let amount = $('#amount-input').val();
    amount = utils.toOrginalNumber(amount);
    let fee = utils.calcFee(amount, this.bcMedianTxSize, this.SatoshiPerByte);

    if (!amount.toString().match(/^(\d+\.?\d*|\.\d+)$/)) {
      this.amountErrorMessage = this.getText('common_alert_int_cash_unit');
      return;
    }

    if (amount < 1 && parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH) {
      this.amountErrorMessage = this.getText('common_alert_minimum_cash_unit');
      return;
    }

    if(amount < this.thresholdAmount ){
      super.showError('', this.getText('common_alert_threshold_amount'));
	  return;
	}
	
    if (
      this.userProfile.balance >= amount &&
      this.userProfile.balance < amount + fee
    ) {
      super.showError('', this.getText('send_not_enough_fee_error'));
      return;
    }

    if (this.userProfile.balance < amount + fee) {
      super.showError('', this.getText('send_not_enough_fund_error'));
      return;
    }

    this.sendWallet.memo = $('#payment-memo').val();

    return riot.mount('#confirm-send', 'send-money-confirm', {
      to: this.sendWallet.address,
      amount: amount,
      fee: fee,
      wallet: this.sendWallet,
      cb: this.clearForms.bind(this),
    });

    /* Below code is commented as 2fa while transaction is not required as of now. 
           when needed above riot.mount call should be removed and just uncomment the below if else code 23-01-2018 : Ashwini */

    /* if (!store.getState().userData.user.totp_enabled) {
            return riot.mount('#confirm-send', 'send-money-confirm', {
            	to: this.sendWallet.address,
            	amount: amount,
            	fee: fee,
            	wallet: this.sendWallet,
            	cb: this.clearForms.bind(this)
            });
        }
        else {
            riot.mount('#confirm-send', 'twofa-verification-sendtxn',{
                    to: this.sendWallet.address,
                    amount: amount,
                    fee: fee,
                    wallet: this.sendWallet,
                    cb: this.clearForms.bind(this)
                });
            } */
  }

  onContinueButtonClick(event: Event) {
    this.checkAndShowComfirmationForm();
  }

  clearForms() {
    $('#to-email-id').val('');
    $('#amount-input').val('');
    $('#payment-memo').val('');
    tag.isValidAddress = false;
    this.resetErrorMessages();
  }

  resetErrorMessages() {
    tag.emailErrorMessage = '';
    tag.amountErrorMessage = '';
    tag.update();
  }

  openQRcodeScan() {
    this.resetErrorMessages();
    qrCodeScanner.initiate({
      onResult: result => {
        let containsColumn = result.indexOf(':');
        if (containsColumn >= 0) {
          result = result.substring(containsColumn + 1, result.length);
        }

        //check for qt wallet
        let containsQueMark = result.indexOf('?');
        if (containsQueMark >= 0) {
          result = result.substring(0, containsQueMark);
        }

        if (result.length < 25 || result.length > 34) QRcodeScanError();
        else {
          $('#to-email-id').val(result);
          this.checkAddress();
        }
      },
      onError: err => this.QRcodeScanError(err),
      onTimeout: () => this.QRcodeScanTimeout(),
    });
  }

  QRcodeScanError(err) {
    this.emailErrorMessage = this.getText('error_in_scan_qr');
  }

  QRcodeScanTimeout = () => {
    this.emailErrorMessage = this.getText('timeout_in_scan_qr');
    this.update();
  };
}
