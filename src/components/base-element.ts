/**
 * Base Element
 */
import { riot, template, Element } from './riot-ts';

export default class BaseElement extends Element {

    /**
     * Show error dialog
     */
    showError(title: string, message: string) {
        if (!title || title.length == 0) {
            title = 'Error';
        }
        riot.mount('#error-dialog', 'error-alert', { title: title, message: message });
    }

    showMessage(title: string, message: string) {
        if (!title || title.length == 0) {
            title = 'Infomation';
        }
        riot.mount('#error-dialog', 'message-dialog', { title: title, message: message });
    }
}
