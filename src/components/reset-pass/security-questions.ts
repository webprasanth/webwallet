import { riot, template } from '../riot-ts';
import store from '../../model/store';
import SecurityQuestionsTemplate from './security-questions.html!text';
import { FCEvent } from '../../model/types';
import { resetPassActions } from '../../model/reset-pass/actions';
import { RESET_PASS } from '../../model/action-types';
import AndamanService from '../../model/andaman-service';
import Premium from 'Premium';
import secrets from 'secrets.js-grempe';
import { getUserKey, storeUserKey } from '../../model/utils';
import BaseElement from '../base-element';

@template(SecurityQuestionsTemplate)
export default class SecurityQuestions extends BaseElement {
    private showQuestionForm = true;
    private showPasswordForm = false;
    private securityQuestion1 = '';
    private securityQuestion2 = '';
    private securityQuestion3 = '';
    private answer1 = '';
    private answer2 = '';
    private answer3 = '';
    private password = '';
    private confirmPassword = '';
    private errMessage = '';
    private encryptedSc1 = null;
    private sc2 = null;
    private privKeyHex = null;
    private urlQuery = null;
    private encryptedPrivKey = '';
    private static unsubscribe = null;

    constructor() {
        super();
        if (SecurityQuestions.unsubscribe) SecurityQuestions.unsubscribe();
        SecurityQuestions.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    mounted() {
        this.getQuestions();
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.resetPassData;
        let actionType = state.lastAction.type;

        if (actionType === RESET_PASS.GET_RECOVERY_KEYS_SUCCESS) {
            this.encryptedSc1 = data.keys.sc1;
            this.sc2 = data.keys.sc2;
            this.securityQuestion1 = data.keys.security_question_1;
            this.securityQuestion2 = data.keys.security_question_2;
            this.securityQuestion3 = data.keys.security_question_3;
        } else if (actionType === RESET_PASS.SSO_RESET_PASSWORD_SUCCESS) {
            let userKey = getUserKey() || {};
            userKey.encryptedPrivKey = this.encryptedPrivKey;
            storeUserKey(userKey);
            riot.mount('#confirm-send', 'message-dialog', {
                title: 'Reset Password',
                message: 'Reset password successfully',
                callback: function (result) {

                    if (result) {
                        route('login');
                    }
                }
            });
        } else if (actionType === RESET_PASS.SSO_RESET_PASSWORD_FAILED) {
            super.showError('', JSON.stringify(data.resetPassErrReason));
        }

        this.update();
    }

    getQuestions() {
        this.urlQuery = route.query() || {};

        let params = {
            idToken: this.urlQuery.token || ''
        }

        store.dispatch(resetPassActions.getRecoveryKeys(params));
    }

    doneAnswer() {
        let answers = [$('#answer1').val(), $('#answer2').val(), $('#answer3').val()];
        let checksum = answers.join('*');
        try {
            let sc1 = Premium.xaesDecrypt(checksum, this.encryptedSc1);
            console.log('sc1', sc1);
            this.privKeyHex = secrets.combine([sc1, this.sc2]);
            this.showPasswordForm = true;
            this.showQuestionForm = false;
        } catch (exception) {
            super.showError('', 'Your answers are incorrect');
        }
    }

    donePassword() {
        let password = $('#new-password-id').val();
        let confirmPassword = $('#confirm-password-id').val();

        if (!password || password.length === 0) {
            this.errMessage = 'Password cannot be empty.';
            return;
        }

        if (password !== confirmPassword) {
            this.errMessage = 'Re-typed password is not correct.';
            return;
        }

        let keyByteSize = 256;
        this.encryptedPrivKey = JSON.stringify(Premium.xaesEncrypt(keyByteSize, password, this.privKeyHex));

        let params = {
            token: this.urlQuery.token || '',
            newPassword: password,
            newPrivateKey: this.encryptedPrivKey
        };

        store.dispatch(resetPassActions.ssoResetPassword(params));
    }

    resetErrMessage() {
        this.errMessage = '';
    }

    cancelResetPass(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        route('login');
    }
}