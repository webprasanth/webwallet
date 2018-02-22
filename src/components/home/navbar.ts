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

    var userSelectedCurrency = localStorage.getItem('currency_type');
    /*if(userSelectedCurrency == CURRENCY_TYPE.BTC)
		alert('onchange of btc' + type + pendingData.type);
		else 
		alert('onchange of flash' + type + pendingData.type);
		*/

    switch (userSelectedCurrency) {
      case CURRENCY_TYPE.FLASH:
        this.performFlashSpecificOperation();
        break;
      case CURRENCY_TYPE.BTC:
        this.performBitcoinSpecificOperation();
        break;
      default:
        localStorage.setItem('currency_type', CURRENCY_TYPE.FLASH); //Setting Default currency as Flash
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
    var DropdownList = document.getElementById(
      'select-currency'
    ) as HTMLSelectElement;

    //Adding 1 here as index of select is 0 for FLASH and KeyServer is using 1 for FLASH.
    var currencyIndex = DropdownList.selectedIndex + 1;

    switch (currencyIndex) {
      case CURRENCY_TYPE.FLASH:
        localStorage.setItem('currency_type', CURRENCY_TYPE.FLASH);
        //this.performFlashSpecificOperation();
        this.onApplicationStateChanged();
        break;
      case CURRENCY_TYPE.BTC:
        localStorage.setItem('currency_type', CURRENCY_TYPE.BTC);
        //this.performBitcoinSpecificOperation();
        this.onApplicationStateChanged();
        break;
      default:
        localStorage.setItem('currency_type', CURRENCY_TYPE.FLASH); //Setting Default currency as Flash
        break;
    }

    //alert("selected currency is " + localStorage.getItem('currency_type'));
  }

  performFlashSpecificOperation() {
    alert(
      'perform flash related stuffs' + localStorage.getItem('currency_type')
    );
  }

  performBitcoinSpecificOperation() {
    alert(
      'perform BitCoin related stuffs' + localStorage.getItem('currency_type')
    );
    store.dispatch(userActions.getBalance());
    store.dispatch(userActions.getProfile(this.opts.profile));
    store.dispatch(
      userActions.getMyWallets(
        this.opts.profile.auth_version,
        this.opts.password
      )
    );
    //window.location.href = "home.html";
    alert(
      'perform BitCoin related stuffs' + localStorage.getItem('currency_type')
    );
  }
}
