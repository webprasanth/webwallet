/**
 * Landing page
 */
import { riot, template } from '../riot-ts';
import store from '../../model/store';
import { userActions } from '../../model/users/actions';
import LandingPageTemplate from './landing-page.html!text';
import BaseElement from '../base-element';
import { USERS } from '../../model/action-types';
import * as utils from '../../model/utils';

@template(LandingPageTemplate)
export default class LandingPage extends BaseElement {

    private subscribeFunc = null;
    private captchaId: string = null;
    private isVerifyEmailSent: boolean = false;

    constructor() {
        super();
    }

    mounted() {
        this.subscribeFunc = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.loadLazyImage();
        this.initLandingPage();
        this.renderCaptcha();
    }

    unmounted() {
        if (this.subscribeFunc) {
            this.subscribeFunc();
            this.subscribeFunc = null;
        }
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
            case USERS.SSO_LOGIN_FAILED:
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

    loadLazyImage() {
        let elIds = ['img-slide-3', 'img-slide-publisher', 'img-slide-advertiser', 'img-slide-merchant', 'img-slide-7'];
        loadImage();

        function loadImage() {
            if (elIds.length == 0) {
                return;
            }

            let id = elIds.shift();
            let el = <HTMLInputElement>document.getElementById(id);
            let img = new Image();
            let src = el.getAttribute('data-src');

            img.onload = function () {
                el.src = src;
                loadImage()
            }
            img.src = src;
        }
    }

    initLandingPage() {

        // Handle FAQ onclick
        $('.faq-category li h4').bind('click', function () {
            let li_parent = $(this).parent('li');
            let ul_parent = li_parent.parent('ul');

            if (li_parent.hasClass('active')) {
                li_parent.removeClass('active');
                li_parent.children('.answer-faq').slideUp();
            } else {
                $('.faq-category ul').removeClass('show-sub');
                ul_parent.addClass('show-sub');
                $('.faq-category ul.show-sub li').removeClass('active');
                $('.faq-category ul.show-sub .answer-faq').slideUp();
                li_parent.addClass('active');
                li_parent.children('.answer-faq').slideDown();
            }
        });

        // Handle click BACK TO TOP button
        $('#back-to-top').click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        });

        // Handle click CREATE WALLET button

        $('#create-wallet-btn').click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        });

        let alink = $('.slide-2 a');
        console.log(alink);
        $(alink).click(function () {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top
            }, 1000);
            return false;
        });
    }

    onSignupButtonClick(event: Event) {
        if (!this.validateName()) {
            return;
        }

        if (!this.validateEmail()) {
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
            g_recaptcha_response: grecaptcha.getResponse(this.captchaId),
            appId: appId,
            callback_link: `http://${clientHost}/#account_created?token=`
        };

        store.dispatch(userActions.signup(credentials));
    }

    onSignupFail(resp) {
        grecaptcha.reset(this.captchaId);

        if (resp.status == 'EMAIL_IN_USED') {
            super.showError('', 'An user with this email already exists');
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
        let firstName:string = $('#firstname').val();
        let lastName:string = $('#lastname').val();

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
}

interface LPEvent extends Event {
    target: LPEventTaget;
}

interface LPEventTaget extends EventTarget {
    checked: boolean;
}
