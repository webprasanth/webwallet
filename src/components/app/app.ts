import { template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import AppTemplate from './app.html!text';
import { setLocation } from '../../model/utils';

@template(AppTemplate)
export default class App extends Element {
    state: ApplicationState = <any>{ commonData: { isLoading: false }, activityData: { showTransactionDetail: false } };
    private static unsubscribe = null;

    constructor() {
        super();
        if (App.unsubscribe) App.unsubscribe();
        App.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        checkLocation();
    }

    onApplicationStateChanged() {
        this.state = store.getState();
        this.update();
    }
}

function checkLocation() {
    var url = 'https://keys.flashcoin.io/api/check-location';

    // if (window.location.protocol == 'http:') {
    //     url = 'http://keys.flashcoin.io:8098/api/check-location';
    // }

    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
            if (data.rc == 1) {
                setLocation(data);
            }
        }
    });
}
