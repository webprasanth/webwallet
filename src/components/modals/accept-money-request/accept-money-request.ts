import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import AcceptMoneyRequestTemplate from './accept-money-request.html!text';
import * as utils from '../../../model/utils';
import Constants from '../../../model/constants';
import { commonActions } from '../../../model/common/actions';
import CommonService from '../../../model/common/common-service';
import { COMMON } from '../../../model/action-types';
import { getText } from '../../localise';
import { CURRENCY_TYPE, getCurrencyUnit } from '../../../model/currency';

let tag = null;

@template(AcceptMoneyRequestTemplate)
export default class AcceptMoneyRequest extends Element {
  private AvatarServer = Constants.AvatarServer;
  private notEnoughBalanceMsg = null;
  private notEnoughBalance = false;
  private requestProcessing = false;
  private sendWallet = {};
  private static unsubscribe = null;
  private getText = getText;
  private getCurrencyUnit = getCurrencyUnit;
  private bcMedianTxSize = 250;
  private SatoshiPerByte = 20;
  private fixedTxnFee = 0.00002;
  
  constructor() {
    super();
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.pendingData;
    let actionType = state.lastAction.type;

    if (actionType === COMMON.GET_WALLETS_BY_EMAIL_SUCCESS) {
      this.enableForm(state.lastAction.data);
    }

    this.update();
  }

  mounted() {
    tag = this;

    if (AcceptMoneyRequest.unsubscribe) AcceptMoneyRequest.unsubscribe();
    AcceptMoneyRequest.unsubscribe = store.subscribe(
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

    $('#acceptRequestDialog').modal('show');
    var userSelectedCurrency = localStorage.getItem('currency_type');
    //Get sender's wallet info
    store.dispatch(
      commonActions.getWalletsByEmail({
        email: this.opts.sender_email,
        start: 0,
        size: 1,
        currency_type: userSelectedCurrency,
      })
    );
  }

  enableForm(data) {
    let amount = this.opts.amount;
    let fee = 0;
    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.DASH) {
      fee = tag.fixedTxnFee;
    } else {
      fee = utils.calcFee(amount, tag.bcMedianTxSize, tag.SatoshiPerByte);
    }
    let balance = store.getState().userData.user.balance;
    this.notEnoughBalanceMsg = null;
    this.sendWallet = data.results[0];

    if (balance < amount + fee) {
      if (amount <= balance) {
        this.notEnoughBalanceMsg = this.getText('send_not_enough_fee_error');
      } else {
        this.notEnoughBalanceMsg = this.getText('send_not_enough_fund_error');
      }
      this.notEnoughBalance = true;
    } else {
      this.notEnoughBalance = false;
    }
    this.requestProcessing = false;
  }

  sendRequest(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    $('#acceptRequestDialog').modal('hide');
    if (this.opts.amount > 0) {
      if (this.sendWallet.address) {
        this.sendWallet.memo = $('#Note').val();
        this.sendWallet.needUpdateRequestId = true;
        this.sendWallet.RequestId = this.opts.receive_id;

        riot.mount('#confirm-send', 'send-money-confirm', {
          to: this.sendWallet.address,
          amount: this.opts.amount,
          fee: utils.calcFee(this.opts.amount, tag.bcMedianTxSize, tag.SatoshiPerByte),
          wallet: this.sendWallet,
        });
      }
    }
  }

  formatAmountInput = utils.formatAmountInput;
}
