import * as redux from 'redux';
import userReducer from './users/reducers';
import commonReducer from './commons/reducers';
import activityReducer from './activities/reducers';
import sendReducer from './send/reducers';
import tabReducer from './tabs/reducers';

function lastAction(state = null, action) {
    return action;
}

const reducers = redux.combineReducers({
    lastAction: lastAction,
    userData: userReducer,
    commonData: commonReducer,
    activityData: activityReducer,
    sendData: sendReducer,
    tabData: tabReducer
});

export default reducers;
