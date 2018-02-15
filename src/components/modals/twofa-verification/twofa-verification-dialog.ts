import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import { getUserKey } from '../../../model/utils';
import { userActions } from '../../../model/users/actions';
import { USERS } from '../../../model/action-types';
import TwoFADialogTemplate from './twofa-verification-dialog.html!text';
import { getText } from '../../localise';

@template(TwoFADialogTemplate)
export default class TwoFAVerificationDialog extends Element {
  private static unsubscribe = null;
  // Flag to show/hide error message
  private isIncorrectPasscode: boolean = false;
  private getText = getText;

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.activityData;
    let actionType = state.lastAction.type;

    switch (actionType) {
      case USERS.CHECK_2FA_CODE_SUCCESS:
        store.dispatch(userActions.loginSuccess(this.opts.profile));
        store.dispatch(userActions.getBalance());
        store.dispatch(userActions.getProfile(this.opts.profile));
        store.dispatch(
          userActions.getMyWallets(
            this.opts.profile.auth_version,
            this.opts.password
          )
        );
        $('#verifyPinDialog').modal('hide');
        break;
      case USERS.CHECK_2FA_CODE_FAILED:
        this.isIncorrectPasscode = true;
        break;
      default:
        break;
    }

    this.update();
  }

  mounted() {
    $('#verifyPinDialog').modal('show');
    if (TwoFAVerificationDialog.unsubscribe)
      TwoFAVerificationDialog.unsubscribe();
    TwoFAVerificationDialog.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
  }

  onVerify(event: Event) {
    let googleCode: number = $('#google-code').val();
    let userKey = getUserKey() || {};
	
    if(this.opts.profile.auth_version == 3){
        let userAuthVersion = 3; 	//Used for V1 accounts
        var params = {
          idToken: userKey.idToken,
          authVersion : userAuthVersion,
          code: googleCode,
        };
    } else {
        var params = {
          idToken: userKey.idToken,
          code: googleCode,
        };	
    }
    store.dispatch(userActions.check2faCode(params));
  }

  onFocus(event: Event) {
    this.isIncorrectPasscode = false;
  }
}
