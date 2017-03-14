import { template } from '../riot-ts';
import BaseElement from '../base-element';
import store, { ApplicationState } from '../../model/store';
import { userActions } from '../../model/users/actions';
import { commonActions } from '../../model/common/actions';
import HomeHeaderTemplate from './header.html!text';
import AndamanService from '../../model/andaman-service';
import { USERS, COMMON, PROFILE } from '../../model/action-types';
import { decimalFormat, utcDateToLocal, removeIdToken } from '../../model/utils';

let tag = null;

@template(HomeHeaderTemplate)
export default class HomeHeader extends BaseElement {
    private userEmail: string = store.getState().userData.user.email;
    private avatarUrl: string = null;
    private balance = 0;
    private decimalFormat = decimalFormat;
    private static unsubscribe = null;
    private isDisconnect = false;

    mounted() {
        tag = this;
        let state = store.getState();
        if (HomeHeader.unsubscribe) HomeHeader.unsubscribe();
        HomeHeader.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.loadBalance();

        let user = store.getState().userData.user;
        if (user.profile_pic_url) {
            this.avatarUrl = `${AndamanService.AvatarServer}${user.profile_pic_url}`;
        }
        commonActions.addListeners();
    }

    onApplicationStateChanged() {
        // let opts = {
        //     // whether to hide the notification on click
        //     clickToHide: true,
        //     // whether to auto-hide the notification
        //     autoHide: true,
        //     // if autoHide, hide after milliseconds
        //     autoHideDelay: 500000,
        //     // show the arrow pointing at the element
        //     arrowShow: true,
        //     // arrow size in pixels
        //     arrowSize: 5,
        //     // position defines the notification position though uses the defaults below
        //     position: '...',
        //     // default positions
        //     elementPosition: 'bottom left',
        //     globalPosition: 'top right',
        //     // default style
        //     style: 'bootstrap',
        //     // default class (string or [string])
        //     className: 'error',
        //     // show animation
        //     showAnimation: 'slideDown',
        //     // show animation duration
        //     showDuration: 400,
        //     // hide animation
        //     hideAnimation: 'slideUp',
        //     // hide animation duration
        //     hideDuration: 200,
        //     // padding between element and notification
        //     gap: 2
        // };
        // $.notify.defaults(opts);

        let state: ApplicationState = store.getState();
        let self = this;
        let message = '';
        let note = null;
        tag.isDisconnect = state.commonData.isDisconnect;

        switch (state.lastAction.type) {
            case USERS.GET_BALANCE_SUCCESS:
                this.balance = state.lastAction.data;
                break;
            case COMMON.NEED_UPDATE_BALANCE:
                setTimeout(function () {
                    store.dispatch(userActions.getBalance());
                    self.showTxnNotification();
                }, 2000);
                break;
            case COMMON.ON_SESSION_EXPIRED:
                message = 'Flashcoin terminated this session because you logged in from another place. We do not allow concurrent sessions for your own sake.';
                super.showError('', message, function () {
                    commonActions.removeAllListeners();
                    store.dispatch(userActions.logout());
                });
                break;
            case COMMON.ON_REQUEST_STATE_CHANGED:
                self.showRequestNotification();
            case COMMON.ON_BE_REQUESTED:
                note = state.commonData.notificationData.pop();

                if (note.email_sender) {
                    message = note.email_sender + " sent you a request for " + decimalFormat(note.amount) + " Flash Coin at " + utcDateToLocal(note.created_ts);
                    $.notify(message, "info");
                }
            case PROFILE.UPDATE_AVATAR_SUCCESS:
                tag.avatarUrl = `${AndamanService.AvatarServer}${store.getState().lastAction.data}`;
                break;
            default:
                break;
        }

        this.update();
    }

    loadBalance() {
        setTimeout(function () {
            store.dispatch(userActions.getBalance());
        }, 3000);
    }

    showRequestNotification() {
        let state = store.getState();
        let note = state.commonData.notificationData.pop();
        let message = null;

        switch (note.status) {
            case 1:
                message = "One request of yours has been paid";
                this.playImcomingSound();
                break;
            case 2:
                message = "One request of yours has been rejected";
                break;
            case 3:
                message = "A request sent to you has been cancelled";
                break;
            default:
                break;
        }

        if (message) {
            $.notify(message, "info");
        }
    }

    showTxnNotification() {
        let message = null;
        let state = store.getState();
        let note = state.commonData.notificationData.pop();
        let user = state.userData.user;

        if (!note || !note.sender_email) {
            // Check server side
            console.error('Notification is invalid:', note);
            return;
        }

        if (note.sender_email == store.getState().userData.user.email) {
            if (!note.transaction_type) {
                return;
            }

            if (note.transaction_type == 'like') {
                message = "You have just liked and sent " + note.recipientEmail + " " + decimalFormat(note.amount) + " tokens as a reward";
            } else {
                message = "One of your fountain(s) has just dispensed " + decimalFormat(note.amount) + " tokens to " + note.recipientEmail;
            }
        } else {
            message = note.sender_email + " sent you " + decimalFormat(note.amount) + " Flash Coin";
        }

        $.notify(message, "info");
        this.playImcomingSound();
    }

    playImcomingSound() {
        //Mp3 sound audio HTML5
        var embed = '<audio id="audio"><source src="assets/sound/money.mp3" type="audio/mpeg"></audio>';
        $("#sound").html(embed);
        document.getElementById("audio").play();
    }

    onLogoutButtonClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        removeIdToken();

        commonActions.removeAllListeners();
        store.dispatch(userActions.logout());
    }
}