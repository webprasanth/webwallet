import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import SendRequestConfirmTemplate from './send-request-confirm.html!text';
import { formatCurrency, formatAmountInput } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { requestActions } from '../../../model/request/actions';
import { REQUEST } from '../../../model/action-types';
import BaseElement from '../../base-element';

@template(SendRequestConfirmTemplate)
export default class SendRequestConfirm extends BaseElement {
    private formRequestEnabled: boolean = true;
    private requestProcessing: boolean = false;
    private requestSuccess: boolean = false;
    private formatCurrency = formatCurrency;
    private formatAmountInput = formatAmountInput;
    private AvatarServer = AndamanService.AvatarServer;
    private static unsubscribe = null;

    constructor() {
        super();
        if (SendRequestConfirm.unsubscribe) SendRequestConfirm.unsubscribe();
        SendRequestConfirm.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.activityData;
        let actionType = state.lastAction.type;

        if (actionType === REQUEST.REQUEST_MONEY_SUCCESS) {
            this.requestSuccess = true;
            this.formRequestEnabled = false;
            if (this.opts.cb) {
                this.opts.cb();
            }
        } else if (actionType === REQUEST.REQUEST_MONEY_FAILED) {
            super.showError('', state.lastAction.data);
        }

        this.update();
    }

    mounted() {
        $('#requestDialog').modal('show');
    }

    sendRequestDirect() {
        this.formRequestEnabled = true;
        this.requestProcessing = true;
        if (this.opts.amount > 0) {
            let moneyInfo = {
                to: this.opts.uid,
                bare_uid: this.opts.receiver_email,
                amount: this.opts.amount,
                currency: 1,
                note: this.opts.sender_note
            };
            store.dispatch(requestActions.sendRequest(moneyInfo));
        }
    }
}