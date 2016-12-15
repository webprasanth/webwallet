/**
 * Landing page
 */
import { riot, template } from '../riot-ts';
import store from '../../model/store';
import { userActions } from '../../model/users/actions';
import SsoTemplate from './sso.html!text';
import BaseElement from '../base-element';
import { USERS } from '../../model/action-types';
import * as utils from '../../model/utils';

@template(SsoTemplate)
export default class Sso extends BaseElement {

    private static unsubscribe = null;

    constructor() {
        super();
    }

    mounted() {
        if (Sso.unsubscribe) Sso.unsubscribe();
        Sso.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));

        let loginDataStr = localStorage.getItem('flc-loginresp');
        let loginData = null;

        if (loginDataStr && loginDataStr.length > 0) {
            loginData = JSON.parse(loginDataStr);
            userActions.setAuth(loginData);
            store.dispatch(userActions.getUserData(loginData));
            localStorage.removeItem('flc-loginresp');
        } else {
            let isMobile = /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile) {
                window.location.href = "index.html";
            } else {
                window.location.href = "/index.html";
            }
        }
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.userData;
        let type = state.lastAction.type;

        switch (type) {
            case USERS.NEED_VERIFY_GOOGLE_2FA:
                riot.mount('#confirm-send', 'twofa-verification-dialog', data.loginData);
                break;
            default:
                break;
        }

        this.update();
    }

    onRememberMeCheckBoxChange(event: LPEvent) {
        store.dispatch(userActions.rememberMe(event.target.checked));
    }
}

interface LPEvent extends Event {
    target: LPEventTaget;
}

interface LPEventTaget extends EventTarget {
    checked: boolean;
}
