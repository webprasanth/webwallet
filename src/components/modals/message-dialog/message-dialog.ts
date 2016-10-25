import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import MessageDialogTemplate from './message-dialog.html!text';

@template(MessageDialogTemplate)
export default class MessageDialog extends Element {

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
        $('#messageDialog').modal('show');
    }

    onYes(event: Event) {
        if (this.opts.callback) {
            this.opts.callback(1);
        }
    }

}