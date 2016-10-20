import { template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import { userActions } from '../../model/users/actions';
import HomeHeaderTemplate from './header.html!text';
import AndamanService from '../../model/andaman-service';
import { USERS } from '../../model/action-types';

@template(HomeHeaderTemplate)
export default class HomeHeader extends Element {
    public userEmail: string = store.getState().userData.user.email;
    public avatarUrl: string = null;
    private balance = 0;

    mounted() {
        let state = store.getState();
        store.subscribe(this.onApplicationStateChanged.bind(this));
        store.dispatch(userActions.getBalance());

        let user = store.getState().userData.user;
        if (user.profile_pic_url) {
            avatarUrl = `${AndamanService.AvatarServer}${user.profile_pic_url.profile_pic_url}`;
        }
    }

    onApplicationStateChanged() {
        let state: ApplicationState = store.getState();

        if (state.lastAction.type == USERS.GET_BALANCE_SUCCESS) {
            this.balance = state.lastAction.data;
        }

        this.update();
    }

    onLogoutButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        store.dispatch(userActions.logout());
    }


}