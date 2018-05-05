import { riot, template } from '../riot-ts';
import BaseElement from '../base-element';
import store, { ApplicationState } from '../../model/store';
import { userActions } from '../../model/users/actions';
import { commonActions } from '../../model/common/actions';
import NavbarTemplate from './navbar.html!text';
import Constants from '../../model/constants';
import { USERS, COMMON, PROFILE, PENDING } from '../../model/action-types';
import { FCEvent } from '../../model/types';
import { TAB } from '../../model/pending/types';
import { pendingActions } from '../../model/pending/actions';
import { CURRENCY_TYPE } from '../../model/currency';
import { removeIdToken } from '../../model/utils';
import { getText } from '../localise';

@template(NavbarTemplate)
export default class Navbar extends BaseElement {
  private static unsubscribe = null;
  private getText = getText;
  private userEmail: string = store.getState().userData.user.email;
  private avatarUrl: string = null;
  private state = null;
  private outgoingReqNum = 0;
  private incommingReqNum = 0;
  private pendingNum = 0;
  private tabs = null;
  private auth_version = 0;

  mounted() {
    this.state = store.getState();
    this.tabs = this.state.tabData.tabs;
    if (Navbar.unsubscribe) Navbar.unsubscribe();
    Navbar.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );

    let user = store.getState().userData.user;
    if (user.profile_pic_url) {
      this.avatarUrl = `${Constants.AvatarServer}${user.profile_pic_url}`;
    }
    this.auth_version = user.auth_version;
  }

  onApplicationStateChanged() {
    this.state = store.getState();
    this.tabs = this.state.tabData.tabs;
    let pendingData = this.state.pendingData;
    let type = this.state.lastAction.type;

    switch (type) {
      case PENDING.GET_MORE_REQUEST_SUCCESS:
        if (pendingData.type == TAB.INCOMING) {
          this.incommingReqNum = pendingData.total_money_reqs;
        } else {
          this.outgoingReqNum = pendingData.total_money_reqs;
        }
        this.pendingNum = this.incommingReqNum + this.outgoingReqNum;
        break;
      default:
        break;
    }

    this.update();
  }

  onLogoutButtonClick(event: Event) {
    removeIdToken();
    event.preventDefault();
    event.stopPropagation();
    commonActions.removeAllListeners();
    store.dispatch(userActions.logout());
  }

  onTabItemClick(event: FCEvent) {
    event.preventDefault();
    event.stopPropagation();

    $('.navbar-sc').removeClass('active');
    $('.overlay-screen').hide();

    let tab = event.item.tab;
    route(tab.id);
  }

  onCurrencySelection(event: Event) {
    
    var selectedCurrencyElement = event.target.closest('li');
    var currencyIndex = parseInt(
      selectedCurrencyElement.getAttribute('data-currency')
    );

    switch (currencyIndex) {
      case CURRENCY_TYPE.BTC:
        localStorage.setItem('currency_type', CURRENCY_TYPE.BTC);
        break;
      case CURRENCY_TYPE.LTC:
        localStorage.setItem('currency_type', CURRENCY_TYPE.LTC);
        break;
      case CURRENCY_TYPE.DASH:
        localStorage.setItem('currency_type', CURRENCY_TYPE.DASH);
        break;
      case CURRENCY_TYPE.FLASH:
      default:
        localStorage.setItem('currency_type', CURRENCY_TYPE.FLASH); //Setting Default currency as Flash
        break;
    }
    $('#selected-currency-container #selected-currency-text').html(
      $(selectedCurrencyElement)
        .find('span')
        .html()
    );
    $('#selected-currency-container #selected-currency-icon').attr(
      'src',
      $(selectedCurrencyElement)
        .find('img')
        .attr('src')
    );
    this.performCurrencyChangeOperation(currencyIndex);
  }

  performCurrencyChangeOperation(currencyIndex) {
    let user = store.getState().userData.user;
    store.dispatch(userActions.getBalance());
    store.dispatch(userActions.getProfile(user));
    riot.mount('home-activity');
    riot.mount('home-contacts');
    riot.mount('home-profile');
    riot.mount('home-send');
    riot.mount('home-request');
    riot.mount('home-pending');

    // passing 2 for default "Incoming Request" tab
    store.dispatch(pendingActions.setActiveTab(2));
    //home activity, contacts, header, profile, fountain, User info,

    if(CURRENCY_TYPE.FLASH != currencyIndex) {
      console.log($('.navbar-sc .navbar-nav li.active'));
      console.log($('.navbar-sc .navbar-nav li.active').attr('id'));
      if($('.navbar-sc .navbar-nav li.active').attr('id') == 'merchant-tools')
        route('activity');
    }
  }
}
