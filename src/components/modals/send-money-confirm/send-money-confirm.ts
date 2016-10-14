import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import SendMoneyConfirmTemplate from './send-money-confirm.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { sendActions } from '../../../model/send/actions';
import { SEND } from '../../../model/action-types';

@template(SendMoneyConfirmTemplate)
export default class SendMoneyConfirm extends Element {

    private userProfile = null;
    private confirmation: boolean = true;
    private sending: boolean = false;
    private success: boolean = false;
    private processing_duration: number = 2.000;
    private formatCurrency = formatCurrency;
    private AvartarServer = `http://${AndamanService.opts.host}:8098/profile/`;

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
        $('#sendDialog').modal('show');
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