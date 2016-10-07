import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import SendConfirmTemplate from './send-confirm.html!text';
import {formatCurrency} from '../../../model/utils';

@template(SendConfirmTemplate)
export default class SendConfirm extends Element {

    private userProfile = null;
    private confirmation: boolean = true;
    private sending: boolean = false;
    private formatCurrency = formatCurrency;

    constructor() {
        super();
        this.confirmation = true;
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
    }

}