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
    state: ApplicationState = <any>{ tabData: { tabs: [] } };

    constructor() {
        super();
    }

    mounted() {
        this.state = store.getState();
        this.update();

        store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    onApplicationStateChanged() {
        this.state = store.getState();
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

