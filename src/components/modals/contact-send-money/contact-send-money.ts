import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import ContactSendMoneyTemplate from './contact-send-money.html!text';
import { calcFee, filterNumberEdit } from '../../../model/utils';
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
    private filterNumberEdit = filterNumberEdit;

    constructor() {
        super();
        store.subscribe(this.onApplicationStateChanged.bind(this));
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
        $('#sendByContact').modal('show');
        $('#contact-send-amount').keypress(this.filterNumberEdit);
        $('#contact-send-bt').on('blur', this.resetErrorMessages);
    }

    sendMoney() {
        let amount = $('#contact-send-amount').val();

        if (!amount.match(/^\d+$/g)) {
            tag.errorMessage = 'Amount must be integer value';
            return;
        }

        let fee = calcFee(amount);

        if (amount < 1) {
            return tag.errorMessage = 'Amount must be at least 1';
        }

        if (store.getState().userData.user.balance < amount + fee) {
            return tag.errorMessage = 'You do not have enough funds to make this payment';
        }

        let memo = $('#Note').val();

        store.dispatch(sendActions.createRawTx(this.opts.sendAddr, amount, memo));
    }

    resetErrorMessages() {
        tag.errorMessage = '';
        tag.update();
    }
}