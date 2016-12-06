/**
 * Landing page
 */
import { riot, template } from '../riot-ts';
import store from '../../model/store';
import { userActions } from '../../model/users/actions';
import MobileLoginTemplate from './mobile-login.html!text';
import BaseElement from '../base-element';
import { USERS } from '../../model/action-types';
import * as utils from '../../model/utils';

let tag = null;
@template(MobileLoginTemplate)
export default class MobileLogin extends BaseElement {

    private subscribeFunc = null;
    private captchaId: string = null;
    private isVerifyEmailSent: boolean = false;
    private static unsubscribe = null;

    constructor() {
        super();
    }

    mounted() {
        tag = this;

        if (MobileLogin.unsubscribe) MobileLogin.unsubscribe();
        MobileLogin.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.userData;
        let type = state.lastAction.type;

        switch (type) {
            case USERS.SIGNUP_SUCCESS:
                this.isVerifyEmailSent = true;
                break;
            case USERS.SIGNUP_FAILED:
                this.onSignupFail(data.signupData);
                break;
            case USERS.SSO_LOGIN_SUCCESS:
                break;
            case USERS.LOGIN_FAILED:
                super.showError('Login failed', 'Email or password is not correct');
                break;
            case USERS.NEED_VERIFY_GOOGLE_2FA:
                riot.mount('#confirm-send', 'twofa-verification-dialog', data.loginData);
                break;
            default:
                break;
        }

        this.update();
    }

    onLoginButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        let email: string = $('#identifer').val();
        if (!email || email.trim().length == 0) {
            super.showError('', 'Email is needed to login');
            // TODO focus to email feild

            return false;
        }

        if (!utils.isValidEmail(email)) {
            super.showError('', 'Invalid email format');
            return false;
        }

        let password: string = $('#loginpassword').val();
        if (!password || password.trim().length == 0) {
            super.showError('', 'Password is needed to login');
            // TODO focus to email

            return false;
        }

        store.dispatch(userActions.login(email, password));
    }

    onSignupButtonClick(event: Event) {
        let location = utils.getLocation();
        if (location.info.country_code == "US" && location.info.region_code == "NY") {
            let message = 'Hello! We noticed that you are coming from a New York, USA based IP address. We’re very sorry, but we can’t currently serve people in New York. We hope to be able to serve you in the future, so please stay tuned. If you are not visiting us from New York and you received this message in error, please notify support@flashcoin.io';

            riot.mount('#error-dialog', 'location-error', { title: 'Error', message: message});
            return;
        }

        if (!this.validateName()) {
            return;
        }

        if (!this.validateEmail()) {
            return;
        }

        let captchaResp: string = grecaptcha.getResponse(this.captchaId);
        if (!captchaResp || captchaResp.length == 0) {
            super.showError('', 'Please verify that you are not a robot');
            return;
        }

        var name: string = $('#firstname').val().trim() + ' ' + $('#lastname').val().trim();
        let email: string = $("#email-signup").val().trim();
        let appId: string = 'unity';
        var clientHost = window.location.host;

        var credentials = {
            ip: utils.getLocation().info.ip,
            name: name,
            email: email.toLowerCase(),
            g_recaptcha_response: captchaResp,
            appId: appId,
            callback_link: `http://${clientHost}/#account_created?token=`
        };

        store.dispatch(userActions.signup(credentials));
    }

    onSignupFail(resp) {
        grecaptcha.reset(this.captchaId);

        if (resp.status == 'EMAIL_IN_USED') {
            super.showError('Error', 'An user with this email already exists');
        } else if (resp.status == 'RECAPTCHA_NOT_VERIFIED') {
            super.showError('', 'Please verify that you are not a robot');
        } else {
            super.showError('', resp.reason);
        }
    }

    renderCaptcha() {
        if (grecaptcha && !this.captchaId) {
            this.captchaId = grecaptcha.render('gcaptcha', {
                'sitekey': '6LcMRCgTAAAAAAsGwyHN0EF4zp_vZzVJKMRS5I8C'
            });
        }
    }

    validateEmail() {
        let email: string = $("#email-signup").val();

        if (!email || email.trim().length == 0) {
            super.showError('', 'Email is needed for signing up!');
            $("#email-signup").focus();

            return false;
        }

        if (!utils.isValidEmail(email)) {
            super.showError('', 'Invalid email format!');
            $("#email-signup").focus();

            return false;
        }

        return true;
    }

    validateName() {
        let firstName: string = $('#firstname').val();
        let lastName: string = $('#lastname').val();

        if (!firstName || firstName.trim().length == 0) {
            super.showError('', 'Please enter your first name!');
            return false;
        }

        if (!lastName || lastName.trim().length == 0) {
            super.showError('', 'Please enter your last name!');
            return false;
        }

        return true;
    }

    onRememberMeCheckBoxChange(event: LPEvent) {
        store.dispatch(userActions.rememberMe(event.target.checked));
    }

    onForgotPasswordLinkClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        riot.mount('#main', 'submit-email');
    }

    onCreateWalletBtnClick() {
        tag.isVerifyEmailSent = false;
        tag.update();
        $('#firstname').val("");
        $('#lastname').val("");
        $("#email-signup").val("");
        grecaptcha.reset(this.captchaId);
    }
}

interface LPEvent extends Event {
    target: LPEventTaget;
}

interface LPEventTaget extends EventTarget {
    checked: boolean;
}
