import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import ContactSendMoneyTemplate from './contact-send-money.html!text';
import * as utils from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { sendActions } from '../../../model/send/actions';
import { SEND } from '../../../model/action-types';
import BaseElement from '../../base-element';

let tag = null;

@template(ContactSendMoneyTemplate)
export default class ContactSendMoney extends BaseElement {
    private AvatarServer = AndamanService.AvatarServer;
    private formEnabled: boolean = true;
    private success: boolean = false;
    private processing_duration: number = 2.000;
    private title = 'Send Payment';
    private errorMessage = null;
    private static unsubscribe = null;

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
            this.title = 'Transaction Successful';
        } else if (actionType == SEND.SEND_TXN_FAILED) {
            super.showError('', state.lastAction.data);
        }

        this.update();
    }

    mounted() {
        tag = this;

        if (ContactSendMoney.unsubscribe) ContactSendMoney.unsubscribe();
        ContactSendMoney.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));

        $('#sendByContact').modal('show');
        $('#contact-send-amount').keypress(utils.filterNumberEdit);
        $('#contact-send-amount').blur(utils.formatAmountInput);
        $('#contact-send-bt').on('blur', this.resetErrorMessages);
    }

    sendMoney() {
        let amount = $('#contact-send-amount').val();
        amount = utils.toOrginalNumber(amount);

        if (!amount.toString().match(/^\d+$/g)) {
            tag.errorMessage = 'Amount must be integer value';
            return;
        }

        let fee = utils.calcFee(amount);

        if (amount < 1) {
            return tag.errorMessage = 'Amount must be at least 1';
        }

        let balance = store.getState().userData.user.balance;

        if (balance >= amount && balance < amount + fee) {
            return tag.errorMessage = 'You do not have enough fee to make this payment';
        }

        if (balance < amount + fee) {
            return tag.errorMessage = 'You do not have enough funds to make this payment';
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