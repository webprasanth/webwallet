import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import { getUserKey } from '../../../model/utils';
import { userActions } from '../../../model/users/actions';
import { USERS } from '../../../model/action-types';
import TwoFASendtxnTemplate from './twofa-verification-sendtxn.html!text';
import { getText } from '../../localise';

@template(TwoFASendtxnTemplate)
export default class TwoFAVerificationDialogSendTxn extends Element {
  private static unsubscribe = null;
  // Flag to show/hide error message
  private isIncorrectPasscode: boolean = false;
  private getText = getText;

  onApplicationStateChanged() {
    let state = store.getState();
    let actionType = state.lastAction.type;

    switch (actionType) {
      case USERS.CHECK_2FA_CODE_SUCCESS_TXN:
        $('#verifyPinDialogSendtxn').modal('hide');
        return riot.mount('#confirm-send', 'send-money-confirm', this.opts);
        break;
      case USERS.CHECK_2FA_CODE_FAILED_TXN:
        this.isIncorrectPasscode = true;
        break;
      default:
        break;
    }

    this.update();
  }

  mounted() {
    $('#verifyPinDialogSendtxn').modal('show');
    if (TwoFAVerificationDialogSendTxn.unsubscribe)
      TwoFAVerificationDialogSendTxn.unsubscribe();
    TwoFAVerificationDialogSendTxn.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
  }

  onVerifySendTxn(event: Event) {
    let googleCode: number = $('#google-code').val();
    let userKey = getUserKey() || {};
    if (this.opts.profile.auth_version == 3) {
      let userAuthVersion = 3; //Used for V1 accounts
      var params = {
        idToken: userKey.idToken,
        authVersion: userAuthVersion,
        code: googleCode,
      };
    } else {
      var params = {
        idToken: userKey.idToken,
        code: googleCode,
      };
    }

    store.dispatch(userActions.check2faCodeSendtxn(params));
  }

  onFocus(event: Event) {
    this.isIncorrectPasscode = false;
  }
}
