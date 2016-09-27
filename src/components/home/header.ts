import {template, Element} from '../riot-ts';
import store, {ApplicationState}  from '../../model/store';
import {userActions} from '../../model/users/actions';
import HomeHeaderTemplate from './header.html!text';

@template(HomeHeaderTemplate)
export default class HomeHeader extends Element {
    public userEmail: string = store.getState().userData.user.email;
    public avatarUrl: string = `http://${(<any>window).AndamanService.opts.host}/profile/${store.getState().userData.user.profile_pic_url}`;

    mounted() {
        let state = store.getState();
        store.subscribe(this.onApplicationStateChanged.bind(this));

    }

    onApplicationStateChanged() {
        var state: ApplicationState = store.getState();
    }

    onLogoutButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        store.dispatch(userActions.logout());

    }


}