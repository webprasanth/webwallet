import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import MessageDialogTemplate from './message-dialog.html!text';

let tag = null;
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
        tag = this;
        $('#messageDialog').modal('show');
    }

    onYes(event: Event) {
        if (tag.opts.callback) {
            tag.opts.callback(1);
        }
    }

}