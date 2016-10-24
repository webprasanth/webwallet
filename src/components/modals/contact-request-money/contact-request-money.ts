import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import ContactRequestMoneyTemplate from './contact-request-money.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { requestActions } from '../../../model/request/actions';
import { REQUEST } from '../../../model/action-types';

@template(ContactRequestMoneyTemplate)
export default class ContactRequestMoney extends Element {
    private formEnabled: boolean = true;
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
        let data = state.contactsData;
        let actionType = state.lastAction.type;

        if (actionType === REQUEST.REQUEST_MONEY_SUCCESS) {
            this.requestSuccess = true;
            this.formEnabled = false;
        } else if (actionType === REQUEST.REQUEST_MONEY_FAILED) {
            riot.mount('#error-dialog', 'error-alert', { title: '', message: state.lastAction.data });
        }

        this.update();
    }

    mounted() {
        $('#requestByContact').modal('show');
    }

    sendRequestDirect() {
        this.requestProcessing = true;
        let amount = $('#Amount').val();
        let note = $('#Note').val();

        if (amount > 0) {
            let moneyInfo = {
                to: this.opts.sendAddr.username,
                bare_uid: this.opts.sendAddr.email,
                amount,
                currency: 1,
                note
            };
            store.dispatch(requestActions.sendRequest(moneyInfo));
        }
    }
}