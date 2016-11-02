import { riot } from './riot-ts';
import * as components from './components';

import store from '../model/store';
import * as actions from '../model/action-types';
import { userActions } from '../model/users/actions';
import UserService from '../model/users/user-service';

let currentAction = '';

components.initialize();

riot.route((action) => {
    currentAction = action;

    if (action == 'login') {
        return riot.mount('#main', 'landing-page');
    }

    var state = store.getState();
    if (!state.userData.user && (action != 'reset_password' && action != 'account_created')) {
        return riot.route('login');
    }
    switch (action) {
        case '':
        case 'home':
            return riot.mount('#main', 'home-page');
        case 'reset_password':
            return riot.mount('#main', 'security-questions');
        case 'account_created':
            return riot.mount('#main', 'setuppassword');
        default:
            break;
    }
});

store.subscribe(() => {
    var state = store.getState();
    if (state.lastAction.type == actions.USERS.GET_PROFILE_SUCCESS || state.lastAction.type == actions.USERS.SET_RECOVERY_KEY_SUCCESS) {
        riot.route('');
    } else if (!state.userData.user && (currentAction !== 'reset_password' && currentAction != 'account_created')) {
        riot.route('login');
    }
});

riot.route.start(true);

if (window.location.host == 'localhost:8000') {
    store.dispatch(userActions.ssoLogin());
}
