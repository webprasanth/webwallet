import * as redux from 'redux';
import userReducer from './users/reducers';
import commonReducer from './common/reducers';
import activityReducer from './activities/reducers';
import sendReducer from './send/reducers';
import tabReducer from './tabs/reducers';
import pendingReducer from './pending/reducers';
import profileReducer from './profile/reducers';
import contactsReducer from './contacts/reducers';
import resetPassReducer from './reset-pass/reducers';

function lastAction(state = null, action) {
    return action;
}

const reducers = redux.combineReducers({
    lastAction: lastAction,
    userData: userReducer,
    commonData: commonReducer,
    activityData: activityReducer,
    sendData: sendReducer,
    pendingData: pendingReducer,
    profileData: profileReducer,
    contactsData: contactsReducer,
    tabData: tabReducer,
    resetPassData: resetPassReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'USERS.LOGOUT') {
        state = undefined;
    }

    return reducers(state, action)
}

export default rootReducer;
