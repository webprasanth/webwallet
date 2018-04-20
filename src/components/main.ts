import { riot } from './riot-ts';
import * as components from './components';
import * as localise from './localise';
import store from '../model/store';
import * as actions from '../model/action-types';
import { userActions } from '../model/users/actions';
import UserService from '../model/users/user-service';

let currentAction = '';
let isMobile = /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
let isMounted = false;

localise.init(function() {
  components.initialize();
  route.start(true);
});

route(action => {
  currentAction = action;

  if (action == 'login') {
    // if (isMobile) {
    //     return riot.mount('#main', 'mobile-login');
    // }

    return riot.mount('#main', 'sso');
  }

  var state = store.getState();
  if (
    !state.userData.user &&
    (action != 'reset_password' &&
      action != 'account_created' &&
      action != 'enable_account' &&
      action != 'submit_email' &&
      action != 'migrate_v1_to_v2')
  ) {
    return route('login');
  }

  switch (action) {
    case '':
    case 'home':
      if (!isMounted) {
        isMounted = true;
        return riot.mount('#main', 'home-page');
      }
      break;
    case 'reset_password':
      return riot.mount('#main', 'security-questions');
    case 'enable_account':
      return riot.mount('#main', 'enable-account');
    case 'account_created':
      return riot.mount('#main', 'setuppassword');
    case 'submit_email':
      return riot.mount('#main', 'submit-email');
    case 'migrate_v1_to_v2':
      return riot.mount('#main', 'migrate-v1-to-v2');
    default:
      break;
  }
});

store.subscribe(() => {
  var state = store.getState();
  if (state.lastAction.type == actions.USERS.GET_PROFILE_SUCCESS && state.userData.user.auth_version != 3) {
    route('');
  } else if (
    !state.userData.user &&
    (currentAction !== 'reset_password' &&
      currentAction != 'account_created' &&
      currentAction != 'enable_account' &&
      currentAction != 'submit_email' &&
      currentAction != 'migrate_v1_to_v2')
  ) {
    route('login');
  }
});
