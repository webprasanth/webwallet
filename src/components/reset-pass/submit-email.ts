import { riot, template } from '../riot-ts';
import store from '../../model/store';
import SubmitEmailTemplate from './submit-email.html!text';
import { FCEvent } from '../../model/types';
import { isValidEmail } from '../../model/utils';
import { resetPassActions } from '../../model/reset-pass/actions';
import { RESET_PASS } from '../../model/action-types';
import AndamanService from '../../model/andaman-service';
import BaseElement from '../base-element';

@template(SubmitEmailTemplate)
export default class SubmitEmail extends BaseElement {
    private isVerifyEmailSent = false;
    private static unsubscribe = null;

    constructor() {
        super();
        if (SubmitEmail.unsubscribe) SubmitEmail.unsubscribe();
        SubmitEmail.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.pendingData;
        let actionType = state.lastAction.type;

        if (actionType === RESET_PASS.SSO_RESET_PASSWORD_MAIL_SUCCESS) {
            this.isVerifyEmailSent = true;
        }

        this.update();
    }

    sendEmail(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        let email = $('#email').val();

        if (!isValidEmail(email)) {
            super.showError('', 'Invalid email format!');
            return;
        }

        let clientHost = window.location.host;

        if (!clientHost || clientHost.length === 0) {
            clientHost = AndamanService.clientHost;
        }

        let params = {
            email: email,
            callback_url: `http://${clientHost}/home.html#reset_password?token=`
        };
        //riot.route("reset_password?token=");
        store.dispatch(resetPassActions.ssoResetPasswordMail(params));
    }

    cancelResetPass(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        route('#login');
    }
}