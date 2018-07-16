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
  private payoutInfo = { payout_sharing_fee: 0 };
  private showSharingFee = false;
  private get_wallet_completed = false;
  private get_sharing_fee_completed = false;
  private wallet_action_data = null;

  constructor() {
    super();
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.pendingData;
    let actionType = state.lastAction.type;

    if (actionType === COMMON.GET_WALLETS_BY_EMAIL_SUCCESS) {
      console.log('get wallet done');
      this.wallet_action_data = state.lastAction.data;
      this.get_wallet_completed = true;
      if (this.get_sharing_fee_completed)
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
        .getFixedTransactionFee()
        .then((resp: any) => {
          tag.fixedTxnFee = resp.fixed_txn_fee;
        });
    }

    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.ETH) {
      CommonService.singleton()
        .getEtherGasValues()
        .then((resp: any) => {
          console.log(resp);
          if (resp.rc == 1 && resp.gas_price && resp.gas_limit) {
            tag.SatoshiPerByte = parseInt(resp.gas_price); //price per gas in Wei (Wei unit of Ether)
            tag.bcMedianTxSize = parseInt(resp.gas_limit); //max gas to be used
          }
        });
    }

    if (
      parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH
    ) {
      CommonService.singleton()
        .getPayoutInfo()
        .then((resp: any) => {
          console.log('sharing  done');
          tag.get_sharing_fee_completed = true;
          if (resp.rc === 1 && resp.payout_info) {
            tag.payoutInfo = resp.payout_info;
            tag.showSharingFee = true;
            tag.updateSharingFee();
          }
          if (tag.get_wallet_completed) tag.enableForm(tag.wallet_action_data);
          tag.update();
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

  calculateFee() {
    let amount = this.opts.amount;
    amount = utils.toOrginalNumber(amount);
    let fee = utils.calcFee(
      amount,
      tag.bcMedianTxSize,
      tag.SatoshiPerByte,
      tag.fixedTxnFee
    );

    $('#accept-money-fee').val(fee);
    tag.updateTotal();
  }

  updateSharingFee() {
    let amount = tag.opts.amount;
    amount = utils.toOrginalNumber(amount);
    let sharing_fee = utils.calcSharingFee(
      amount,
      tag.payoutInfo.payout_sharing_fee
    );
    $('#accept-money-sharing-fee').val(sharing_fee);
    tag.updateTotal();
  }

  updateTotal() {
    setTimeout(function() {
      let total_amount = 0;
      let amount = tag.opts.amount;
      amount = utils.toOrginalNumber(amount);

      let txn_fee = parseFloat($('#accept-money-fee').val());
      let sharing_fee = parseFloat($('#accept-money-sharing-fee').val());

      total_amount = parseFloat((amount + txn_fee + sharing_fee).toFixed(8));

      $('#accept-money-total').val(utils.formatAmountInput(total_amount));
    }, 100);
  }

  enableForm(data) {
    this.calculateFee();
    this.updateSharingFee();
    let amount = this.opts.amount;
    let fee = utils.calcFee(
      amount,
      tag.bcMedianTxSize,
      tag.SatoshiPerByte,
      tag.fixedTxnFee
    );
    let sharingFee = parseFloat(
      utils.calcSharingFee(amount, tag.payoutInfo.payout_sharing_fee, 8)
    );

    let balance = store.getState().userData.user.balance;
    this.notEnoughBalanceMsg = null;
    this.sendWallet = data.results[0];

    if (balance < amount + fee + sharingFee) {
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
          fee: utils.calcFee(
            this.opts.amount,
            tag.bcMedianTxSize,
            tag.SatoshiPerByte,
            tag.fixedTxnFee
          ),
          wallet: this.sendWallet,
          SatoshiPerByte: parseInt(tag.SatoshiPerByte), //price per gas in Wei (Wei unit of Ether)
          bcMedianTxSize: parseInt(tag.bcMedianTxSize), //max gas to be used
          sharingFee: parseFloat(
            utils.calcSharingFee(
              this.opts.amount,
              tag.payoutInfo.payout_sharing_fee,
              8
            )
          ),
          payoutInfo: this.payoutInfo,
        });
      }
    }
  }

  formatAmountInput = utils.formatAmountInput;
}
