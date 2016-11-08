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
        let self = this;
  
        switch (state.lastAction.type) {
            case USERS.GET_BALANCE_SUCCESS:
                this.balance = state.lastAction.data;
                break;
            case COMMON.NEED_UPDATE_BALANCE:
                setTimeout(function() {
                    store.dispatch(userActions.getBalance());
                    self.showNotification();
                }, 2000);
                break;
            default:
                break;
        }

        this.update();
    }

    showNotification() {
        let message = null;
        let state = store.getState();
        let note = state.commonData.notificationData;
        let user = state.userData.user;

        if (note.sender_email == store.getState().userData.user.email) {
            if (note.transaction_type == 'like') {
                message = "You have just liked and sent " + note.recipientEmail + " " + decimalFormat(note.amount) + " tokens as a reward"; 
            } else {
                message = "One of your fountain(s) has just dispensed " + decimalFormat(note.amount) + " tokens to " + note.recipientEmail;
            }
        } else {
            message = note.sender_email + " sent you " + decimalFormat(note.amount) + " Flash Coin";
        }

        $.notify(message, "success");

        //Mp3 sound audio HTML5
        var embed = '<audio id="audio"><source src="assets/sound/money.mp3" type="audio/mpeg"></audio>';
        $("#sound").html(embed);
        document.getElementById("audio").play();
    }

    onLogoutButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        // TODO babv need to uncomment this and find out the reason on double event
        // store.dispatch(userActions.logout());
        document.location.href = '/';
    }


}