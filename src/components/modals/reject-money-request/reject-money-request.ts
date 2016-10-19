import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import RejectMoneyRequestTemplate from './reject-money-request.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { pendingActions } from '../../../model/pending/actions';
import { PENDING } from '../../../model/action-types';

@template(RejectMoneyRequestTemplate)
export default class RejectMoneyRequest extends Element {

    private AvatarServer = AndamanService.AvatarServer;
    private formRequest = true;
    private requestSuccess = false;
    private requestFail = false;

    constructor() {
        super();
        store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.activityData;
        let actionType = state.lastAction.type;

        if (actionType === PENDING.MARK_REJECTED_MONEY_REQUESTS_SUCCESS) {
            this.requestSuccess = true;
            this.formRequest = false;
        } else if (actionType === PENDING.MARK_REJECTED_MONEY_REQUESTS_FAILED) {
            this.requestFail = true;
            this.formRequest = false;
        }

        this.update();
    }

    mounted() {
        $('#rejectRequestDialog').modal('show');
    }

    sendRequest(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        let criteria = {
            request_id: this.opts.request_id,
            sender_bare_uid: this.opts.sender,
            note_processing: $('#Note').val()
        }

        store.dispatch(pendingActions.markRejectedMoneyRequests(criteria));
    }

}