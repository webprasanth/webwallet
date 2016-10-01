import {template, Element} from '../riot-ts';
import store, {ApplicationState} from '../../model/store';
import AppTemplate from './app.html!text';

@template(AppTemplate)
export default class App extends Element{
    state: ApplicationState = <any>{commonData: {isLoading: false}, activityData: {showTransactionDetail: false}};

    constructor(){
        super();

        store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged(){
        this.state = store.getState();
        
        this.update();
    }
}
