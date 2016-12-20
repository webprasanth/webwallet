import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import SendMoneyConfirmTemplate from './send-money-confirm.html!text';
import { formatCurrency, formatAmountInput } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { sendActions } from '../../../model/send/actions';
import { userActions } from '../../../model/users/actions';
import { SEND } from '../../../model/action-types';
import SendService from '../../../model/send/send-service';
import BaseElement from '../../base-element';
import * as utils from '../../../model/utils';
import { USERS } from '../../../model/action-types';

@template(SendMoneyConfirmTemplate)
export default class SendMoneyConfirm extends BaseElement {

    private userProfile = null;
    private confirmation: boolean = true;
    private sending: boolean = false;
    private success: boolean = false;
    private requirePassword: boolean = false;
    private incorrectPassword: boolean = false;
    private processingDuration: number = 2.000;
    private formatCurrency = formatCurrency;
    private formatAmountInput = formatAmountInput;
    private AvatarServer = AndamanService.AvatarServer;
    private static unsubscribe = null;

    constructor() {
        super();
        if (SendMoneyConfirm.unsubscribe) SendMoneyConfirm.unsubscribe();
        SendMoneyConfirm.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
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
            this.processingDuration = state.sendData.processing_duration;
            this.opts.dlgTitle = 'Transaction Successful';
            if (this.opts.cb) {
                this.opts.cb();
            }
        } else if (actionType == SEND.SEND_TXN_FAILED) {
            $('#sendDialog').modal('hide');
            super.showError('', state.lastAction.data);
        }

        this.update();
    }

    mounted() {
        this.userProfile = store.getState().userData.user;
        $('#sendDialog').modal('show');
        let wallet = store.getState().userData.wallets[0];

        if (!wallet.accounts) {
            this.requirePassword = true;
            this.confirmation = false;
            this.update();
        }
    }

    confirmPassword() {
        let password = $("#sendPassowd").val();
        let userData = store.getState().userData;
        let decryptedWallets = null;

        if (password) {
            try {
                decryptedWallets = utils.decryptPassphraseV2(userData.user.email, userData.wallets, password);
                store.dispatch(userActions.getMyWalletsSuccess(decryptedWallets));
                store.dispatch({ type: USERS.STORE_FOUNTAIN_SECRET, data: password });
                this.requirePassword = false;
                this.confirmation = true;
            } catch (error) {        
            }
        }

        this.incorrectPassword = true;
    }

    sendDirect() {
        this.createRawTx();
    }

    createRawTx() {
        this.confirmation = true;
        this.sending = true;
        store.dispatch(sendActions.createRawTx(this.opts.wallet, this.opts.amount, this.opts.wallet.memo));
    }

    getDisplayNameInfo() {
        if (this.opts.wallet.display_name) {
            return this.opts.wallet.display_name;
        } else {
            if (!this.opts.wallet.email || this.opts.wallet.email.length == 0) {
                return this.opts.wallet.address;
            } else {
                return '';
            }
        }
    }
}