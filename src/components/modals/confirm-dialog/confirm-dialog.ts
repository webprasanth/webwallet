import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import ConfirmDialogTemplate from './confirm-dialog.html!text';

@template(ConfirmDialogTemplate)
export default class ConfirmDialog extends Element {
    private static unsubscribe = null;

    constructor() {
        super();
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.activityData;
        let actionType = state.lastAction.type;

        this.update();
    }

    mounted() {
        if (ConfirmDialog.unsubscribe) ConfirmDialog.unsubscribe();
        ConfirmDialog.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
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