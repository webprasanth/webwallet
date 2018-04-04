import { riot, template } from '../riot-ts';
import store from '../../model/store';
import SubmitEmailTemplate from './submit-email.html!text';
import { FCEvent } from '../../model/types';
import { isValidEmail } from '../../model/utils';
import { resetPassActions } from '../../model/reset-pass/actions';
import { RESET_PASS } from '../../model/action-types';
import Constants from '../../model/constants';
import BaseElement from '../base-element';

@template(SubmitEmailTemplate)
export default class SubmitEmail extends BaseElement {
  private isVerifyEmailSent = false;
  private static unsubscribe = null;
  private captchaId = null;

  constructor() {
    super();
    if (SubmitEmail.unsubscribe) SubmitEmail.unsubscribe();
    SubmitEmail.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
  }

  mounted() {
    var self = this;
    $.getScript(
      'https://www.google.com/recaptcha/api.js?render=explicit',
      function() {
        setTimeout(function() {
          self.captchaId = grecaptcha.render('gcaptcha', {
            sitekey: '6LcMRCgTAAAAAAsGwyHN0EF4zp_vZzVJKMRS5I8C',
          });
        }, 500);
      }
    );
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.resetPassData;
    let actionType = state.lastAction.type;

    if (actionType === RESET_PASS.SSO_RESET_PASSWORD_MAIL_SUCCESS) {
      this.isVerifyEmailSent = true;
    } else if (actionType === RESET_PASS.SSO_RESET_PASSWORD_MAIL_FAILED) {
      super.showError('', data.resetPassMailErrReason);
      grecaptcha.reset(this.captchaId);
    }

    this.update();
  }

  sendEmail(event: FCEvent) {
    event.preventDefault();
    event.stopPropagation();

    let email = $('#email').val();

    if (!isValidEmail(email)) {
      super.showError('', 'Invalid email format!');
      return;
    }

    let captchaResp = grecaptcha.getResponse(this.captchaId);
    if (!captchaResp || captchaResp.length == 0) {
      super.showError('', this.getText('signup_invalid_captcha'));
      return;
    }

    let clientHost = window.location.host;

    if (!clientHost || clientHost.length === 0) {
      clientHost = Constants.clientHost;
    }

    let params = {
      email: email,
      g_recaptcha_response: captchaResp,
      callbackUrl: `http://${clientHost}/home.html#reset_password?token=`,
    };
    //riot.route("reset_password?token=");
    store.dispatch(resetPassActions.ssoResetPasswordMail(params));
  }

  cancelResetPass(event: FCEvent) {
    event.preventDefault();
    event.stopPropagation();

    route('#login');
  }
}
