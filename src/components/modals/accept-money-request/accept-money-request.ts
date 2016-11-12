import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import AcceptMoneyRequestTemplate from './accept-money-request.html!text';
import * as utils from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { commonActions } from '../../../model/common/actions';
import { COMMON } from '../../../model/action-types';

@template(AcceptMoneyRequestTemplate)
export default class AcceptMoneyRequest extends Element {

    private AvatarServer = AndamanService.AvatarServer;
    private notEnoughBalanceMsg = null;
    private notEnoughBalance = false;
    private requestProcessing = false;
    private sendWallet = null;
    private static unsubscribe = null;

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
        if (AcceptMoneyRequest.unsubscribe) AcceptMoneyRequest.unsubscribe();
        AcceptMoneyRequest.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));

        $('#acceptRequestDialog').modal('show');
        //Get sender's wallet info
        store.dispatch(commonActions.getWalletsByEmail({
            email: this.opts.sender_email,
            start: 0,
            size: 1
        }));
    }

    enableForm(data) {
        let amount = this.opts.amount;
        let fee = utils.calcFee(amount);
        let balance = store.getState().userData.user.balance;
        this.notEnoughBalanceMsg = null;
        this.sendWallet = data.results[0];

        if (balance < amount + fee) {
            if (amount <= balance) {
                this.notEnoughBalanceMsg = 'You do not have enough fee to make this payment';
            } else {
                this.notEnoughBalanceMsg = 'You do not have enough funds to make this payment';
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
                    fee: utils.calcFee(this.opts.amount),
                    wallet: this.sendWallet
                });
            }
        }
    }

    formatAmountInput = utils.formatAmountInput;
}