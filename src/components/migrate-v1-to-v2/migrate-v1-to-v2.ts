/**
 * Landing page
 */
import { riot, template } from '../riot-ts';
import store from '../../model/store';
import { userActions } from '../../model/users/actions';
import MigrateV1ToV2Template from './migrate-v1-to-v2.html!text';
import BaseElement from '../base-element';
import { USERS } from '../../model/action-types';
import * as utils from '../../model/utils';
import { CURRENCY_TYPE } from '../../model/currency';

let tag = null;
@template(MigrateV1ToV2Template)
export default class MigrateV1ToV2 extends BaseElement {
  private subscribeFunc = null;
  private sesureMsg: string = null;
  private token: string = null;
  private static unsubscribe = null;

  private questionsA = utils.getSecurityQuestion().A;
  private questionsB = utils.getSecurityQuestion().B;
  private questionsC = utils.getSecurityQuestion().C;

  mounted() {
    tag = this;
    if (MigrateV1ToV2.unsubscribe) MigrateV1ToV2.unsubscribe();
    MigrateV1ToV2.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
    localStorage.setItem('currency_type', CURRENCY_TYPE.FLASH);
  }

  checkSecureQuestion() {
    let questionA = $('#questionA').val();
    let questionB = $('#questionB').val();
    let questionC = $('#questionC').val();
    let answerA = $('#answerA').val();
    let answerB = $('#answerB').val();
    let answerC = $('#answerC').val();
    
    if (
      !questionA ||
      !questionB ||
      !questionC ||
      !answerA ||
      !answerB ||
      !answerC
    ) {
      this.sesureMsg = this.getText('sc_question_required_msg');
      return false;
    }

    this.sesureMsg = null;
    return true;
  }

  migrateAccount() {

    if (!this.checkSecureQuestion()) {
      return;
    }

    $('#btn-migrate-account').button('loading');

    let questionA: string = $('#questionA').val();
    let questionB: string = $('#questionB').val();
    let questionC: string = $('#questionC').val();
    let answerA: string = $('#answerA').val();
    let answerB: string = $('#answerB').val();
    let answerC: string = $('#answerC').val();
    let answers = [answerA, answerB, answerC];

    store.dispatch(
      userActions.migrateAccount(
        this.opts.password,
        questionA,
        answerA,
        questionB,
        answerB,
        questionC,
        answerC
      )
    );
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.userData;
    let type = state.lastAction.type;

    switch (type) {
      case USERS.MIGRATE_V1_TO_V2_FAILED:
        $('#btn-create-account').button('reset');
        let resp = data.loginData;
        let message = null;

        if (resp.status == 'CAS_FAILED') {
          message = this.getText('signup_setuppasswoed_cas_fail');
        } else if (resp.status == 'INVALID_TOKEN') {
          message = this.getText('signup_setuppasswoed_invalid_token');
        } else {
          message = 'Migration failed, please try again or contact us at support@flashcoin.io';
        }

        super.showError('', message);
        break;
      case USERS.MIGRATE_V1_TO_V2_SUCCESS:
        riot.mount('#confirm-send', 'message-dialog', {
          title: this.getText('Upgrade Account'),
          message: this.getText('Account upgraded Successfully, Please login again.'),
          callback: function(result) {
            window.location.href = 'index.html';
          },
        });
        break;
      default:
        break;
    }

    this.update();
  }
}
