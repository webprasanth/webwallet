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

@template(SetupPasswordTemplate)
export default class SetupPassword extends BaseElement {

    private subscribeFunc = null;
    private retypedMsg: string = null;
    private strengthMsg: string = null;
    private strengthColor: string = null;
    private sesureMsg: string = null;
    private token: string = null;
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
        'What streed did you grow up?',
        'What is your pet\'s name?',
        'What was your first job?',
    ];

    mounted() {
        this.subscribeFunc = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.token = riot.route.query().token;
    }

    unmounted() {
        if (this.subscribeFunc) {
            this.subscribeFunc();
            this.subscribeFunc = null;
        }
    }

    checkSecureQuestion () {
        var questionA = $('#questionA').val();
        var questionB = $('#questionB').val();
        var questionC = $('#questionC').val();
        var answerA   = $('#answerA').val();
        var answerB   = $('#answerB').val();
        var answerC   = $('#answerC').val();

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
        let answerA: string   = $('#answerA').val();
        let answerB: string   = $('#answerB').val();
        let answerC: string   = $('#answerC').val();
        let answers   = [answerA, answerB, answerC];

        store.dispatch(userActions.setPassword(this.token, password, questionA, answerA, questionB, answerB, questionC, answerC));
    }

    onRePasswordChanged() {
        this.strengthMsg = null;
        let password = $('#fcpassword').val();
        let newValue = $('#repeat_fcpassword').val();

        if(newValue !== '' && newValue !== password) {
            this.retypedMsg = 'Re-typed password is not correct.';
        } else {
            this.retypedMsg = null;
        }
    }

    onPasswordChanged() {
        let newValue: string  = $('#fcpassword').val();
        this.retypedMsg = null;
        
        if (!newValue || newValue.length == 0) {
            this.strengthMsg = null;
            return;
        }

        let strength: number = utils.calcPasswordStreng(newValue);
        let msg = "Too short";
        this.strengthColor = 'red';

        // Now we have calculated strength value, we can return messages
        if (strength < 1) {
            msg = "Your password is too short";
            this.strengthColor = 'red';
        }
        else if (strength < 2) {
            msg = "Your password is weak";
            this.strengthColor = 'orange';
        }
        else if (strength == 2) {
            msg = "Your password is medium";
            this.strengthColor = 'green';
        }
        else {
            msg = "Your password is strong";
            this.strengthColor = 'blue';
        }

        this.strengthMsg = msg;
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
                } else if (resp.status == 'INVALID_TOKEN'){
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
