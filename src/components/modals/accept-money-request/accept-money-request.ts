import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import AcceptMoneyRequestTemplate from './accept-money-request.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { pendingActions } from '../../../model/pending/actions';
import { PENDING } from '../../../model/action-types';

@template(AcceptMoneyRequestTemplate)
export default class AcceptMoneyRequest extends Element {

    private notEnoughBalanceMsg = null;

    constructor() {
        super();
        store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.pendingData;
        let actionType = state.lastAction.type;

        if (actionType === PENDING.GET_WALLETS_BY_EMAIL_SUCCESS) {
            this.enableForm(state.lastAction.data);
        }

        this.update();
    }

    mounted() {
        $('#acceptRequestDialog').modal('show');
        //Get sender's wallet info
        store.dispatch(pendingActions.getWalletsByEmail({
            email: this.opts.sender_email,
            start: 0,
            size: 1
        }));
    }

    enableForm(data) {

    }

}