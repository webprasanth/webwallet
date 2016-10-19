import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import ConfirmDialogTemplate from './confirm-dialog.html!text';
import { formatCurrency } from '../../../model/utils';
import AndamanService from '../../../model/andaman-service';
import { pendingActions } from '../../../model/pending/actions';
import { PENDING } from '../../../model/action-types';

@template(ConfirmDialogTemplate)
export default class ConfirmDialog extends Element {

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

        this.update();
    }

    mounted() {
        $('#confirmDialog').modal('show');
    }

    onYes(event: Event) {
        if (this.opts.callback) {
            this.opts.callback(1);
        }
    }

    onNo(event: Event) {
        if (this.opts.callback) {
            this.opts.callback(0);
        }
    }
}