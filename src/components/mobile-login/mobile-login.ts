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
    private userLocation: any = {info:{}};

    constructor() {
        super();
    }

    mounted() {
        tag = this;

        if (MobileLogin.unsubscribe) MobileLogin.unsubscribe();
        MobileLogin.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));

        this.checkLocation();
        this.ssoLogin();
    }

    ssoLogin() {
        let idToken = utils.getIdToken();

        if (idToken) {
            let params = {
                idToken: idToken,
                res: 'web'
            };
            store.dispatch(userActions.ssoLogin(params));
        }        
    }

    checkLocation() {
        let url = 'https://keys.flashcoin.io/api/check-location';
        $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                if (data.rc == 1) {
                    this.userLocation = data;
                    localStorage.setItem('flc-location', JSON.stringify(data));
                }
            }
        });
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
            case USERS.LOGIN_FAILED:
                super.showError(this.getText('login_cas_login_fail_err'), this.getText('login_incorrect_usernamepassword_msg'));
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
            super.showError('', this.getText('login_email_reuired_msg'));

            return false;
        }

        if (!utils.isValidEmail(email)) {
            super.showError('', this.getText('login_invalid_email_msg'));
            return false;
        }

        let password: string = $('#loginpassword').val();
        if (!password || password.trim().length == 0) {
            super.showError('', this.getText('login_password_reuired_msg'));
            // TODO focus to email

            return false;
        }

        store.dispatch(userActions.login(email, password));
    }

    onSignupButtonClick(event: Event) {
        if (this.userLocation.info.country_code == "US" && this.userLocation.info.region_code == "NY") {
            let message = this.getText('login_usa_limitted_msg');
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
            super.showError('', this.getText('signup_invalid_captcha'));
            return;
        }

        var name: string = $('#firstname').val().trim() + ' ' + $('#lastname').val().trim();
        let email: string = $("#email-signup").val().trim();
        let appId: string = 'unity';
        var clientHost = window.location.host;

        var credentials = {
            ip: this.userLocation.info.ip,
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
            super.showError(this.getText('common_label_error_title'), this.getText('signup_email_already_exist'));
        } else if (resp.status == 'RECAPTCHA_NOT_VERIFIED') {
            super.showError('', this.getText('signup_invalid_captcha'));
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
            super.showError('', this.getText('signup_email_required_msg'));
            $("#email-signup").focus();

            return false;
        }

        if (!utils.isValidEmail(email)) {
            super.showError('', this.getText('login_invalid_email_msg'));
            $("#email-signup").focus();

            return false;
        }

        return true;
    }

    validateName() {
        let firstName: string = $('#firstname').val();
        let lastName: string = $('#lastname').val();

        if (!firstName || firstName.trim().length == 0) {
            super.showError('', this.getText('signup_first_name_required_msg'));
            return false;
        }

        if (!lastName || lastName.trim().length == 0) {
            super.showError('', this.getText('signup_last_name_required_msg'));
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
