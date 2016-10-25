import { riot, template, Element } from '../riot-ts';
import store from '../../model/store';
import { userActions } from '../../model/users/actions';
import LandingPageTemplate from './landing-page.html!text';

@template(LandingPageTemplate)
export default class LandingPage extends Element {
    constructor() {
        super();
    }

    mounted() {
        store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {

    }

    onLoginButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        var emailField = <HTMLInputElement>this.root.querySelector('.login-email');
        var passwordField = <HTMLInputElement>this.root.querySelector('.login-password');

        this.doLogin(emailField.value, passwordField.value);
    }

    onSignupButtonClick(event: Event) {
        throw new Error("Not implemented yet.");
    }

    doLogin(email, password) {
        store.dispatch(userActions.login(email, password));
    }

    onRememberMeCheckBoxChange(event: Event) {
        store.dispatch(userActions.rememberMe(event.target.checked));
    }

    onForgotPasswordLinkClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        riot.mount('#main', 'submit-email');
    }
}

