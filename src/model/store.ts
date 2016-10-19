import * as redux from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

interface IUser {
    email: string;
    idToken: string;
    role: string;
    res: string;
    sessionToken: string;
    profile_pic_url: string;
    created_ts: string;
    timezone: string;
    balance: number;
}

interface ITAB {
    id: number;
    name: string;
    shortName?: string;
    isActive: boolean;
}

export interface ApplicationState {
    lastAction: { type: string, data: any },
    userData: { user: IUser, wallets: any },
    commonData: { isLoading: boolean },
    activityData: { txns: any[], total_txns: number, page_size: number, tabs: ITAB[], txn_detail: any },
    sendData: { processing_duration: number },
    pendingData: { money_requests: any[], total_money_reqs: number, page_size: number, tabs: ITAB[] }
    tabData: { tabs: ITAB[] }
}

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}

var store = redux.createStore(reducers, redux.applyMiddleware(thunk, logger)) as redux.Store<ApplicationState>;
export default store;
