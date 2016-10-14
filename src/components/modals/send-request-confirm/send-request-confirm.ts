import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import SendRequestConfirmTemplate from './send-request-confirm.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { sendActions } from '../../../model/send/actions';
import { SEND } from '../../../model/action-types';

@template(SendRequestConfirmTemplate)
export default class SendRequestConfirm extends Element {
    private formRequestEnabled: boolean = true;
    private requestProcessing: boolean = false;
    private requestSuccess: boolean = false;
    private formatCurrency = formatCurrency;
    private AvartarServer = `http://${AndamanService.opts.host}:8098/profile/`;

    constructor() {
        super();
        store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.activityData;
        let actionType = state.lastAction.type;

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

        }
    }
}