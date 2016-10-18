import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import SendRequestConfirmTemplate from './send-request-confirm.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { requestActions } from '../../../model/request/actions';
import { REQUEST } from '../../../model/action-types';

@template(SendRequestConfirmTemplate)
export default class SendRequestConfirm extends Element {
    private formRequestEnabled: boolean = true;
    private requestProcessing: boolean = false;
    private requestSuccess: boolean = false;
    private formatCurrency = formatCurrency;
    private AvatarServer = AndamanService.AvatarServer;

    constructor() {
        super();
        store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.activityData;
        let actionType = state.lastAction.type;

        if (actionType === REQUEST.REQUEST_MONEY_SUCCESS) {
            this.requestSuccess = true;
            this.formRequestEnabled = false;
        } else if (actionType === REQUEST.REQUEST_MONEY_FAILED) {
            riot.mount('#error-dialog', 'error-alert', { title: '', message: state.lastAction.data });
        }

        this.update();
    }

    mounted() {
        //this.userProfile = store.getState().userData.user;
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
            store.dispatch(requestActions.sendRequest(moneyInfo, this.opts.receiverWallet));
        }
    }
}