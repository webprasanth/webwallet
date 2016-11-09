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
    private requestProcessing: boolean = false;
    private requestSuccess: boolean = false;
    private formatCurrency = utils.formatCurrency;
    private AvatarServer = AndamanService.AvatarServer;
    private errorMessage = null;
    private static unsubscribe = null;

    constructor() {
        super();
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.contactsData;
        let actionType = state.lastAction.type;

        if (actionType === REQUEST.REQUEST_MONEY_SUCCESS) {
            this.requestSuccess = true;
            this.formEnabled = false;
        } else if (actionType === REQUEST.REQUEST_MONEY_FAILED) {
            super.showError('', state.lastAction.data);
        }

        this.update();
    }

    mounted() {
        if (ContactRequestMoney.unsubscribe) ContactRequestMoney.unsubscribe();
        ContactRequestMoney.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
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
        this.requestProcessing = true;

        let moneyInfo = {
            to: this.opts.sendAddr.username,
            bare_uid: this.opts.sendAddr.email,
            amount,
            currency: 1,
            note
        };

        store.dispatch(requestActions.sendRequest(moneyInfo));
    }

    resetErrorMessages() {
        tag.errorMessage = '';
        tag.update();
    }
}