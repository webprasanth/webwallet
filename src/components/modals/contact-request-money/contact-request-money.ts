import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import ContactRequestMoneyTemplate from './contact-request-money.html!text';
import * as utils from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { requestActions } from '../../../model/request/actions';
import { REQUEST } from '../../../model/action-types';
import BaseElement from '../../base-element';

let tag = null;

@template(ContactRequestMoneyTemplate)
export default class ContactRequestMoney extends BaseElement {
    private formEnabled: boolean = true;
    private requestSuccess: boolean = false;
    private formatCurrency = utils.formatCurrency;
    private AvatarServer = AndamanService.AvatarServer;
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

        if (!amount.toString().match(/^\d+$/g)) {
            tag.errorMessage = 'Amount must be integer value';
            return;
        }

        if (amount < 1) {
            return tag.errorMessage = 'Amount must be at least 1';
        }

        let note = $('#Note').val();

        $('#requestByContact').modal('hide');

        riot.mount('#confirm-send', 'send-request-confirm', {
            uid: this.opts.sendAddr.username,
            receiver_email: this.opts.sendAddr.email,
            sender_note: note,
            amount,
            receiverWallet: this.opts.sendAddr
        });

    }

    resetErrorMessages() {
        tag.errorMessage = '';
        tag.update();
    }
}