import { template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import { userActions } from '../../model/users/actions';
import HomeHeaderTemplate from './header.html!text';
import AndamanService from '../../model/andaman-service';
import { USERS } from '../../model/action-types';
import { COMMON } from '../../model/action-types';
import { decimalFormat } from '../../model/utils';

@template(HomeHeaderTemplate)
export default class HomeHeader extends Element {
    public userEmail: string = store.getState().userData.user.email;
    public avatarUrl: string = null;
    private balance = 0;
    private decimalFormat = decimalFormat;

    mounted() {
        let state = store.getState();
        store.subscribe(this.onApplicationStateChanged.bind(this));
        store.dispatch(userActions.getBalance());

        let user = store.getState().userData.user;
        if (user.profile_pic_url) {
            this.avatarUrl = `${AndamanService.AvatarServer}${user.profile_pic_url}`;
        }
    }

    onApplicationStateChanged() {
        let state: ApplicationState = store.getState();
  
        switch (state.lastAction.type) {
            case USERS.GET_BALANCE_SUCCESS:
                this.balance = state.lastAction.data;
                break;
            case COMMON.ON_NEW_TX_ADDED:
                store.dispatch(userActions.getBalance());
                break;
            default:
                break;
        }

        this.update();
    }

    onLogoutButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        store.dispatch(userActions.logout());
    }


}