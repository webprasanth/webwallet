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
    phone: string;
    phone_verified: number;
}

interface ITAB {
    id: number;
    name: string;
    shortName?: string;
    isActive: boolean;
}

export interface ApplicationState {
    lastAction: { type: string, data: any };
    userData: { user: IUser, wallets: any, loginData: any, signupData: any };
    commonData: { isLoading: boolean, isDisconnect: boolean, notificationData: any[] };
    activityData: { txns: any[], total_txns: number, page_size: number, tabs: ITAB[], txn_detail: any };
    sendData: { processing_duration: number };
    pendingData: { type: number, money_requests: any[], total_money_reqs: number, page_size: number, tabs: ITAB[] };
    profileData: { avatarToken: string, wallet: any, keypair: any, twoFAInfo: any, fountain: any, savedFountain: any };
    contactsData: { contacts: any[], totalContacts: number, contactWallet: any };
    tabData: { tabs: ITAB[] };
    resetPassData: { keys: any, resetPassErrReason: any }
}

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}

var store = redux.createStore(reducers, redux.applyMiddleware(thunk, logger)) as redux.Store<ApplicationState>;
export default store;
