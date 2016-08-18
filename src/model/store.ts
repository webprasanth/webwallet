import * as redux from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

interface IUser{
    email: string;
    idToken: string;
    role: string;
    res: string;
    sessionToken: string;
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
    tabData: {tabs: ITAB[]}
}

var createStoreWithMiddleware = redux.compose(
    redux.applyMiddleware(thunk)
)(redux.createStore);

var store = createStoreWithMiddleware(reducers) as redux.Store<ApplicationState>;

export default store;
