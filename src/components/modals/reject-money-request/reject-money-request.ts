import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import RejectMoneyRequestTemplate from './reject-money-request.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { sendActions } from '../../../model/send/actions';
import { SEND } from '../../../model/action-types';

@template(RejectMoneyRequestTemplate)
export default class RejectMoneyRequest extends Element {

    private userProfile = null;
    private confirmation: boolean = true;
    private sending: boolean = false;
    private success: boolean = false;
    private processing_duration: number = 2.000;
    private formatCurrency = formatCurrency;
    private AvatarServer = AndamanService.AvatarServer;

    constructor() {
        super();
        store.subscribe(this.onApplicationStateChanged.bind(this));
        this.confirmation = true;
        this.sending = false;
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.activityData;
        let actionType = state.lastAction.type;

        if (actionType === SEND.SEND_TXN_SUCCESSFUL) {
            this.confirmation = false;
            this.sending = false;
            this.success = true;
            this.processing_duration = state.sendData.processing_duration;
            this.opts.dlgTitle = 'Transaction Successful';
        }

        this.update();
    }

    mounted() {
        this.userProfile = store.getState().userData.user;
        $('#rejectRequestDialog').modal('show');
    }

    sendDirect() {
        this.createRawTx();
    }

    createRawTx() {
        this.confirmation = true;
        this.sending = true;
        store.dispatch(sendActions.createRawTx(this.opts.wallet, this.opts.amount, this.opts.wallet.memo));
    }

}