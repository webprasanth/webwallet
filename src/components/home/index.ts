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
import { getText } from '../localise';

@template(HomePageTemplate)
export default class HomePage extends Element {
  private getText = getText;
  private route = route.create();
  private lastView = null;
  private widgets = {
    activity: 'home-activity',
    send: 'home-send',
    request: 'home-request',
    pending: 'home-pending',
    contacts: 'home-contacts',
    profile: 'home-profile',
  };

  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    this.route(action => {
      let mainContent = document.querySelector('#main-content');
      let id = this.widgets[action];

      if (!id) {
        return;
      }

      if (this.lastView && this.lastView.id != id) {
        $(this.lastView).hide();
      }

      let el = mainContent.querySelector('#' + id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        mainContent.appendChild(el);

        riot.mount(el, id);
      } else {
        $(el).show();
      }

      this.lastView = el;

      // To show pending number on memu
      let state = store.getState();
      if (action == 'activity' && state.pendingData.total_money_reqs == 0) {
        // Preload pending
        el = document.createElement('div');
        el.id = 'home-pending';
        mainContent.appendChild(el);
        riot.mount(mainContent.querySelector('#home-pending'), 'home-pending', {
          isPreloadData: true,
        });
        $(el).hide();

        // Preload profile
        el = document.createElement('div');
        el.id = 'home-profile';
        mainContent.appendChild(el);
        riot.mount(mainContent.querySelector('#home-profile'), 'home-profile', {
          isPreloadData: true,
        });
        $(el).hide();
      }

      store.dispatch(tabActions.setActive(action));
    });

    //set default values.
    route('activity');
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

export {
  HomeActivity,
  HomeSend,
  HomeRequest,
  HomePending,
  HomeContacts,
  HomeProfile,
};
