import {riot} from './riot-ts';
import * as components from './components';

import store from '../../model/store';
import * as actions from '../../model/action-types';
import {userActions} from '../../model/users/actions';
import UserService from '../../model/users/user-service';

components.initialize();

riot.route((action) => {
    if(action == 'login'){
        return riot.mount('#main', 'landing-page');
    }

    var state = store.getState();
    if (!state.userData.user && action != 'reset_password'){
        return riot.route('login');
    }

    switch(action){
        case '':
        case 'home':
            return riot.mount('#main', 'home-page');
        case 'reset_password':
            return riot.mount('#main', 'submit-email');
    }
});

store.subscribe(() => {
    var state = store.getState();
    if(state.lastAction.type == actions.USERS.GET_PROFILE_SUCCESS){
        riot.route('');
    }
    else if(!state.userData.user){
        riot.route('login');
    }
});

riot.route.start(true);

store.dispatch(userActions.ssoLogin());
