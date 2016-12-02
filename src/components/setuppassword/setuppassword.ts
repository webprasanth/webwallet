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
    private questionsA = [
        'What is your dream job?',
        'In which city did your parents meet?',
        'What was the name of your elementary school?',
    ];

    private questionsB = [
        'What is the first name of your favourite uncle?',
        'Where did you meet your spouse?',
        'What is your eldest cousin\'s name?',
    ];

    private questionsC = [
        'Street name where you grew up?',
        'What is your pet\'s name?',
        'What was your first job?',
    ];

    mounted() {
        tag = this;
        if (SetupPassword.unsubscribe) SetupPassword.unsubscribe();
        SetupPassword.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.token = route.query().token;
        $('#fcpassword').on("change keyup", this.onPasswordChanged);
        $('#repeat_fcpassword').on("change keyup", this.onRePasswordChanged);
    }

    checkSecureQuestion() {
        let questionA = $('#questionA').val();
        let questionB = $('#questionB').val();
        let questionC = $('#questionC').val();
        let answerA = $('#answerA').val();
        let answerB = $('#answerB').val();
        let answerC = $('#answerC').val();

        if (!questionA || !questionB || !questionC || !answerA || !answerB || !answerC) {
            this.sesureMsg = 'All security question is required to recover passowd and coin in case you foget your passowd';
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
            this.strengthMsg = 'Password cannot be empty.';
            return;
        }

        if (password !== repeatPassword) {
            this.retypedMsg = 'Re-typed password is not correct.';
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

        store.dispatch(userActions.setPassword(this.token, password, questionA, answerA, questionB, answerB, questionC, answerC));
    }

    onRePasswordChanged() {
        tag.strengthMsg = null;
        let password = $('#fcpassword').val();
        let newValue = $('#repeat_fcpassword').val();

        if (newValue !== '' && newValue !== password) {
            tag.retypedMsg = 'Re-typed password is not correct.';
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
            let msg = "Too short";
            tag.strengthColor = 'red';

            // Now we have calculated strength value, we can return messages
            if (strength < 1) {
                msg = "Your password is too short";
                tag.strengthColor = 'red';
            }
            else if (strength < 2) {
                msg = "Your password is weak";
                tag.strengthColor = 'orange';
            }
            else if (strength == 2) {
                msg = "Your password is medium";
                tag.strengthColor = 'green';
            }
            else {
                msg = "Your password is strong";
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
                    message = 'Failed to set password. Authentication Service returned an error. Please try again';
                } else if (resp.status == 'INVALID_TOKEN') {
                    message = 'Email address verification token invalid or expired. Please sign up again from scratch';
                } else {
                    message = 'Failed to set password. Authentication Service returned an error. Please try again';
                }

                super.showError('', message);
                break;
            default:
                break;
        }

        this.update();
    }
}
