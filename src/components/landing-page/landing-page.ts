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

    constructor() {
        super();
    }

    mounted() {
        this.subscribeFunc = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.loadLazyImage();
        this.initLandingPage();
    }

    unmounted() {
        if (this.subscribeFunc) {
            this.subscribeFunc();
        }
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.userData;
        let type = state.lastAction.type;

        switch (type) {
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

        // babv TODO remove
        // var emailField = <HTMLInputElement>this.root.querySelector('.login-email');
        // var passwordField = <HTMLInputElement>this.root.querySelector('.login-password');

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
        throw new Error("Not implemented yet.");
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
