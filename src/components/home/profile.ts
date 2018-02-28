import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeProfileTemplate from './profile.html!text';
import Constants from '../../model/constants';
import { getUrlParam } from '../../model/utils';
import { TABS, PROFILE } from '../../model/action-types';
import { getText } from '../localise';
import { CURRENCY_TYPE } from '../../model/currency';

@template(HomeProfileTemplate)
export default class HomeProfile extends Element {
  private static unsubscribe = null;

  private userProfile = null;
  private avartarServer: string = null;
  private getText = getText;
  private isProfile = true;
  private isSetting = false;
  private isFountain = false;
  private isQuestioning = false;
  private isFountainAvailable = false;

  mounted() {
    if (HomeProfile.unsubscribe) HomeProfile.unsubscribe();
    HomeProfile.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );

    if(parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH)
      this.isFountainAvailable = true;

    this.userProfile = store.getState().userData.user;
    this.avartarServer = Constants.AvatarServer;
    this.mountComponents();
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let data = state.profileData;
    let type = state.lastAction.type;

    if (type == PROFILE.SHOW_ACCOUNT_SETTING) {
      $('#tab-1').removeClass('active');
      $('#tab-2').addClass('active');
      this.onTabSelect('setting');
    }

    this.update();
  }

  mountComponents() {
    riot.mount('#profile-avatar', 'profile-avatar', {});
    riot.mount('#user-info', 'user-info', {});
    riot.mount('#account-setting', 'account-setting', {});
    if (this.isFountainAvailable) {
      riot.mount('#fountain-setting', 'fountain-setting', {});
    }
    riot.mount('#security-question', 'security-question', {});
  }

  onTabSelect(tab) {
    if (tab == 'profile') {
      this.isProfile = true;
      this.isSetting = false;
      this.isFountain = false;
      this.isQuestioning = false;
    } else if (tab == 'setting') {
      this.isProfile = false;
      this.isSetting = true;
      this.isFountain = false;
      this.isQuestioning = false;
    } else if (tab == 'fountain') {
      this.isProfile = false;
      this.isSetting = false;
      this.isFountain = true;
      this.isQuestioning = false;
    } else if (tab == 'securityquestion') {
      this.isProfile = false;
      this.isSetting = false;
      this.isFountain = false;
      this.isQuestioning = true;
    }
  }
}
