import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';

import HomeActivity from './activity';
import HomeSend from './send';
import HomeRequest from './request';
import HomePending from './pending';
import HomeProfile from './profile';

import { userActions } from '../../model/users/actions';
import { tabActions } from '../../model/tabs/actions';
import HomePageTemplate from './index.html!text';
import MainHeaderTemplate from './header.html!text';
import MainNavBarTemplate from './navbar.html!text';

@template(HomePageTemplate)
export default class HomePage extends Element {
    private route = riot.route.create();
    private lastView = null;
    private widgets = {
        'activity': 'home-activity',
        'send': 'home-send',
        'request': 'home-request',
        'profile': 'home-profile',
        'pending': 'home-pending'
    };

    constructor() {
        super();

        this.initialize();
    }

    initialize() {
        this.route((action) => {
            var mainContent = document.querySelector('#main-content');


            switch (action) {
                case 'activity':
                case 'send':
                case 'request':
                case 'pending':
                case 'profile':
                    var id = this.widgets[action];
                    if (this.lastView && this.lastView.id != id) {
                        $(this.lastView).hide();
                    }

                    var el = mainContent.querySelector('#' + id);
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

        var action = userActions.logout();
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

    onTabItemClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        var tab = event.item.tab;
        riot.route(tab.id);
    }

    onLogoutTabItemClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        var action = userActions.logout();
        store.dispatch(action);
    }
}

export { HomeActivity, HomeSend, HomeRequest, HomePending, HomeProfile };
