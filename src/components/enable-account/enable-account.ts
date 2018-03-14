import { riot, template } from '../riot-ts';
import store from '../../model/store';
import EnableAccountTemplate from './enable-account.html!text';
import { FCEvent } from '../../model/types';
import { resetPassActions } from '../../model/reset-pass/actions';
import { RESET_PASS } from '../../model/action-types';
import Premium from 'Premium';
import secrets from 'secrets.js-grempe';
import { getUserKey, storeUserKey } from '../../model/utils';
import BaseElement from '../base-element';

@template(EnableAccountTemplate)
export default class EnableAccount extends BaseElement {
  private showErrorMessage = false;
  private showSuccessMessage = false;
  private static unsubscribe = null;

  constructor() {
    super();
    if (EnableAccount.unsubscribe) EnableAccount.unsubscribe();
    EnableAccount.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
  }

  mounted() {
    this.enableAccount();
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let actionType = state.lastAction.type;

    if (actionType === RESET_PASS.ENABLE_ACCOUNT_SUCCESS) {
      this.showSuccessMessage = true;
    } else if (actionType === RESET_PASS.ENABLE_ACCOUNT_FAILED) {
      this.showErrorMessage = true;
    }

    this.update();
  }

  enableAccount() {
    this.urlQuery = route.query() || {};

    let params = {
      idToken: this.urlQuery.token || '',
    };

    store.dispatch(resetPassActions.enableAccount(params));
  }
}
