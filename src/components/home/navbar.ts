import { riot, template } from '../riot-ts';
import BaseElement from '../base-element';
import store, { ApplicationState } from '../../model/store';
import { userActions } from '../../model/users/actions';
import { commonActions } from '../../model/common/actions';
import NavbarTemplate from './navbar.html!text';
import AndamanService from '../../model/andaman-service';
import { USERS, COMMON, PROFILE } from '../../model/action-types';
import { decimalFormat, utcDateToLocal } from '../../model/utils';
import { FCEvent } from '../../model/types';

let tag = null;

@template(NavbarTemplate)
export default class Navbar extends BaseElement {
    private userEmail: string = store.getState().userData.user.email;
    private avatarUrl: string = null;
    private balance = 0;
    private decimalFormat = decimalFormat;
    private static unsubscribe = null;
    private state = null;

    mounted() {
        tag = this;
        this.state = store.getState();
        if (Navbar.unsubscribe) Navbar.unsubscribe();
        Navbar.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        store.dispatch(userActions.getBalance());

        let user = store.getState().userData.user;
        if (user.profile_pic_url) {
            this.avatarUrl = `${AndamanService.AvatarServer}${user.profile_pic_url}`;
        }
    }

    onApplicationStateChanged() {
        let state: ApplicationState = store.getState();
        let self = this;
        let message = '';
        let note = state.commonData.notificationData;

        this.update();
    }

    onLogoutButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        commonActions.removeAllListeners();
        store.dispatch(userActions.logout());
    }

    onTabItemClick(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        $(".navbar-sc").removeClass('active');
        $('.overlay-screen').hide();

        let tab = event.item.tab;
        riot.route(tab.id);
    }
}