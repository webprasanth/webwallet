import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';

import HomeActivity from './activity';
import HomeSend from './send';
import HomeRequest from './request';
import HomePending from './pending';
import HomeContacts from './contacts';
import HomeProfile from './profile';
import { userActions } from '../../model/users/actions';
import { tabActions } from '../../model/tabs/actions';
import HomePageTemplate from './index.html!text';
import MainHeaderTemplate from './header.html!text';
import MainNavBarTemplate from './navbar.html!text';
import { FCEvent } from '../../model/types';
import { PENDING } from '../../model/action-types';
import { TAB } from '../../model/pending/types';

@template(HomePageTemplate)
export default class HomePage extends Element {
    private route = riot.route.create();
    private lastView = null;
    private widgets = {
        'activity': 'home-activity',
        'send': 'home-send',
        'request': 'home-request',
        'pending': 'home-pending',
        'contacts': 'home-contacts',
        'profile': 'home-profile',
    };

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        this.route((action) => {
            let mainContent = document.querySelector('#main-content');
            switch (action) {
                case 'activity':
                case 'send':
                case 'request':
                case 'pending':
                case 'contacts':
                case 'profile':
                    let id = this.widgets[action];
                    if (this.lastView && this.lastView.id != id) {
                        $(this.lastView).hide();
                    }

                    let el = mainContent.querySelector('#' + id);
                    if (!el) {
                        el = document.createElement('div');
                        el.id = id;
                        mainContent.appendChild(el);

                        riot.mount(el, id);
                    }
                    else {
                        $(el).show();
                    }

                    this.lastView = el;

                    // To show pending number on memu
                    let state = store.getState(); 
                    if (action == 'activity' && state.pendingData.total_money_reqs == 0) {
                        el = document.createElement('div');
                        el.id = 'home-pending';
                        mainContent.appendChild(el);
                        riot.mount(mainContent.querySelector('#home-pending'), 'home-pending', {isPreloadData: true});
                        $(el).hide();
                    }

                    store.dispatch(tabActions.setActive(action));
                    break;
            }
        });

        //set default values.
        riot.route('activity');
    }
}

@template(MainHeaderTemplate)
export class MainHeader extends Element {
    onLogoutButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        let action = userActions.logout();
        store.dispatch(action);
    }
}

@template(MainNavBarTemplate)
export class MainNavBar extends Element {
    private static unsubscribe = null;
    private outgoingReqNum = 0;
    private incommingReqNum = 0;
    private pendingNum = 0;
    state: ApplicationState = <any>{ tabData: { tabs: [] } };

    constructor() {
        super();
    }

    mounted() {
        this.state = store.getState();
        this.update();

        if (MainNavBar.unsubscribe) MainNavBar.unsubscribe();
        MainNavBar.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
    }
    
    onApplicationStateChanged() {
        this.state = store.getState();
        let pendingData = this.state.pendingData;
        let type = this.state.lastAction.type;

        switch(type) {
            case PENDING.GET_MORE_REQUEST_SUCCESS:
                if (pendingData.total_money_reqs > 0) {
                    if (pendingData.money_requests[0]) {
                        if (pendingData.money_requests[0].type == TAB.INCOMING) {
                            this.incommingReqNum = pendingData.total_money_reqs;
                        } else {
                            this.outgoingReqNum = pendingData.total_money_reqs;
                        }

                        this.pendingNum = this.incommingReqNum + this.outgoingReqNum;
                    }
                }
                break;
            default:
                break;
        }

        this.update();
    }

    onTabItemClick(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        let tab = event.item.tab;
        riot.route(tab.id);
    }

    onLogoutTabItemClick(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        let action = userActions.logout();
        store.dispatch(action);
    }
}

export { HomeActivity, HomeSend, HomeRequest, HomePending, HomeContacts, HomeProfile };

