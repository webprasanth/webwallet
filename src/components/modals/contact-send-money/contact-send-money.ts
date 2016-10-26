import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import ContactSendMoneyTemplate from './contact-send-money.html!text';
import { calcFee } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { sendActions } from '../../../model/send/actions';
import { SEND } from '../../../model/action-types';

@template(ContactSendMoneyTemplate)
export default class ContactSendMoney extends Element {
    private AvatarServer = AndamanService.AvatarServer;
    private formEnabled: boolean = true;
    private success: boolean = false;
    private processing_duration: number = 2.000;
    private title = 'Send Payment';
    private errorMessage = null;

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
            riot.mount('#error-dialog', 'error-alert', { title: '', message: state.lastAction.data });
        }

        this.update();
    }

    mounted() {
        $('#sendByContact').modal('show');
    }

    sendMoney() {
        let amount = $('#contact-send-amount').val();

        let fee = calcFee(amount);

        if (amount < 1) {
            return this.errorMessage = 'Amount must be at least 1';
        }

        if (store.getState().userData.user.balance < amount + fee) {
            return this.errorMessage = 'You do not have enough funds to make this payment';
        }

        let memo = $('#Note').val();

        store.dispatch(sendActions.createRawTx(this.opts.sendAddr, amount, memo));
    }

}