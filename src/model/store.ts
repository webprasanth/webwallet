import * as redux from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

interface IUser{
    email: string;
    idToken: string;
    role: string;
    res: string;
    sessionToken: string;
    profile_pic_url: string;
    created_ts: string;
}

interface ITAB{
    id: string;
    name: string;
    isActive: boolean;
}

export interface ApplicationState{
    lastAction: {type: string, data: any},
    userData: {user: IUser},
    commonData: {isLoading: boolean},
    activityData: {txns: any[], total_txns: number, page_size: number, tabs: ITAB[], txn_detail: any},
    tabData: {tabs: ITAB[]}
}

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

// var createStoreWithMiddleware = redux.compose(
//     redux.applyMiddleware(thunk)
// )(redux.createStore);

//var store = createStoreWithMiddleware(reducers) as redux.Store<ApplicationState>;
var store = redux.createStore(reducers, redux.applyMiddleware(thunk, logger)) as redux.Store<ApplicationState>;
export default store;
