/**
 * Landing page
 */
import { riot, template } from '../riot-ts';
import store from '../../model/store';
import { userActions } from '../../model/users/actions';
import SetupPasswordTemplate from './setuppassword.html!text';
import BaseElement from '../base-element';
import { USERS } from '../../model/action-types';
import * as utils from '../../model/utils';

let tag = null;
@template(SetupPasswordTemplate)
export default class SetupPassword extends BaseElement {

    private subscribeFunc = null;
    private retypedMsg: string = null;
    private strengthMsg: string = null;
    private strengthColor: string = null;
    private sesureMsg: string = null;
    private token: string = null;
    private static unsubscribe = null;

    private questionsA = utils.getSecurityQuestion().A;
    private questionsB = utils.getSecurityQuestion().B;
    private questionsC = utils.getSecurityQuestion().C;

    mounted() {
        tag = this;
        if (SetupPassword.unsubscribe) SetupPassword.unsubscribe();
        SetupPassword.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.token = route.query().token;
        $('#fcpassword').on("change keyup", this.onPasswordChanged.bind(this));
        $('#repeat_fcpassword').on("change keyup", this.onRePasswordChanged.bind(this));
    }

    checkSecureQuestion() {
        let questionA = $('#questionA').val();
        let questionB = $('#questionB').val();
        let questionC = $('#questionC').val();
        let answerA = $('#answerA').val();
        let answerB = $('#answerB').val();
        let answerC = $('#answerC').val();

        if (!questionA || !questionB || !questionC || !answerA || !answerB || !answerC) {
            this.sesureMsg = this.getText('sc_question_required_msg');
            return false;
        }

        this.sesureMsg = null;
        return true;
    }

    createAccount() {
        this.strengthMsg = null;
        this.retypedMsg = null;

        let password = $('#fcpassword').val();
        let repeatPassword = $('#repeat_fcpassword').val();

        if (!password || password.length == 0) {
            this.strengthMsg = this.getText('profile_error_password_empy');
            return;
        }

        if (password !== repeatPassword) {
            this.retypedMsg = this.getText('profile_error_incorrect_confirm_pass');
            return;
        }

        if (!this.checkSecureQuestion()) {
           return;
        }

        $('#btn-create-account').button('loading');

        let questionA: string = $('#questionA').val();
        let questionB: string = $('#questionB').val();
        let questionC: string = $('#questionC').val();
        let answerA: string = $('#answerA').val();
        let answerB: string = $('#answerB').val();
        let answerC: string = $('#answerC').val();
        let answers = [answerA, answerB, answerC];

        //store.dispatch(userActions.setPassword(this.token, password));
        store.dispatch(userActions.setPassword(this.token, password, questionA, answerA, questionB, answerB, questionC, answerC));
    }

    onRePasswordChanged() {
        tag.strengthMsg = null;
        let password = $('#fcpassword').val();
        let newValue = $('#repeat_fcpassword').val();

        if (newValue !== '' && newValue !== password) {
            tag.retypedMsg = this.getText('profile_error_incorrect_confirm_pass');
        } else {
            tag.retypedMsg = null;
        }
    }

    onPasswordChanged() {
        let newValue: string = $('#fcpassword').val();
        tag.retypedMsg = null;

        if (!newValue || newValue.length == 0) {
            tag.strengthMsg = null;
        } else {
            let strength: number = utils.calcPasswordStreng(newValue);
            let msg = this.getText('password_too_short_title');
            tag.strengthColor = 'red';

            // Now we have calculated strength value, we can return messages
            if (strength < 1) {
                msg = this.getText('password_too_short_desc');
                tag.strengthColor = 'red';
            }
            else if (strength < 2) {
                msg = this.getText('password_too_wesk_desc');
                tag.strengthColor = 'orange';
            }
            else if (strength == 2) {
                msg = this.getText('password_medium_desc');
                tag.strengthColor = 'green';
            }
            else {
                msg = this.getText('password_strong_desc');
                tag.strengthColor = 'blue';
            }

            tag.strengthMsg = msg;
        }
        tag.update();
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.userData;
        let type = state.lastAction.type;

        switch (type) {
            case USERS.SET_PASSWORD_FAILED:
                $('#btn-create-account').button('reset');
                let resp = data.loginData;
                let message = null;

                if (resp.status == 'CAS_FAILED') {
                    message = this.getText('signup_setuppasswoed_cas_fail');
                } else if (resp.status == 'INVALID_TOKEN') {
                    message = this.getText('signup_setuppasswoed_invalid_token');
                } else {
                    message = this.getText('signup_setuppasswoed_cas_fail');
                }

                super.showError('', message);
                break;
            default:
                break;
        }

        this.update();
    }
}
