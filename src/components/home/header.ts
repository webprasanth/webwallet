import { riot, template } from '../riot-ts';
import BaseElement from '../base-element';
import store, { ApplicationState } from '../../model/store';
import { userActions } from '../../model/users/actions';
import { commonActions } from '../../model/common/actions';
import HomeHeaderTemplate from './header.html!text';
import Constants from '../../model/constants';
import { USERS, COMMON, PROFILE } from '../../model/action-types';
import {
  decimalFormat,
  utcDateToLocal,
  removeIdToken,
  flashNFormatter,
  localizeFlash,
} from '../../model/utils';

let tag = null;

@template(HomeHeaderTemplate)
export default class HomeHeader extends BaseElement {
  private userEmail: string = store.getState().userData.user.email;
  private avatarUrl: string = null;
  private refreshIconUrl: string = 'assets/images/refresh_icon_white.png';
  private balance = 0;
  private ubalance = 0;
  private ebalance = 0;
  private formattedBalance = '0';
  private formattedUBalance = '0';
  private formattedEBalance = '0';
  private decimalFormat = decimalFormat;
  private static unsubscribe = null;
  private isDisconnect = false;

  mounted() {
    tag = this;
    let state = store.getState();
    if (HomeHeader.unsubscribe) HomeHeader.unsubscribe();
    HomeHeader.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
    this.loadBalance();

    let user = store.getState().userData.user;
    if (user.balance) {
      this.balance = user.balance;
      this.formattedBalance = flashNFormatter(this.balance, 2);
    }

    if (user.ubalance) {
      this.ubalance = user.ubalance;
      this.formattedUBalance = flashNFormatter(this.ubalance, 2);
    }

    if (user.ebalance) {
      this.ebalance = user.ebalance;
      this.formattedEBalance = flashNFormatter(this.ebalance, 2);
    }

    if (user.profile_pic_url) {
      this.avatarUrl = `${Constants.AvatarServer}${user.profile_pic_url}`;
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
        this.balance = state.lastAction.data.balance;
        this.ubalance = state.lastAction.data.ubalance;
        this.ebalance = state.lastAction.data.ebalance;
        this.formattedBalance = flashNFormatter(this.balance, 2);
        this.formattedUBalance = flashNFormatter(this.ubalance, 2);
        this.formattedEBalance = flashNFormatter(this.ebalance, 2);
        this.refreshIconUrl = 'assets/images/refresh_icon_white.png';
        let msg =
          this.getText('notify_balance_updated', {
            balance: this.formattedBalance,
          }) +
          ' ' +
          this.getCurrencyUnitUpcase();
        $.notify(msg, 'info');
        break;
      case COMMON.NEED_UPDATE_BALANCE:
        setTimeout(function() {
          store.dispatch(userActions.getBalance());
          self.showTxnNotification();
        }, 2000);
        break;
      case COMMON.ON_SESSION_EXPIRED:
        message = this.getText('common_error_duplicated_login');
        super.showError('', message, function() {
          commonActions.removeAllListeners();
          store.dispatch(userActions.logout());
        });
        break;
      case COMMON.ON_REQUEST_STATE_CHANGED:
        self.showRequestNotification();
        break;
      case COMMON.ON_BE_REQUESTED:
        note = state.commonData.notificationData.pop();

        if (note && note.email_sender) {
          let params = {
            sender: note.email_sender,
            amount: note.amount,
            time: utcDateToLocal(note.created_ts),
          };

          let notification_currency = note.currency
            ? parseInt(note.currency)
            : this.CURRENCY_TYPE.FLASH;
          let notification_currency_name = this.getCurrencyUnitUpcase(
            notification_currency
          );

          message =
            this.getText('common_got_money_request_alert', params) +
            ' ' +
            notification_currency_name;
          $.notify(message, 'info');
        }
        break;
      case PROFILE.UPDATE_AVATAR_SUCCESS:
        tag.avatarUrl = `${Constants.AvatarServer}${
          store.getState().lastAction.data
        }`;
        break;
      case PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS:
        if (!($('#walletAddressDlg').data('bs.modal') || {}).isShown)
          riot.mount('#wallet-address', 'wallet-address');
        break;
      default:
        break;
    }

    this.update();
  }

  loadBalance() {
    setTimeout(function() {
      store.dispatch(userActions.getBalance());
    }, 3000);
  }

  showRequestNotification() {
    let state = store.getState();
    let note = state.commonData.notificationData.pop();
    let message = null;

    switch (note.status) {
      case 1:
        message = this.getText('common_text_request_money_accepted');
        this.playImcomingSound();
        break;
      case 2:
        message = this.getText('common_text_request_money_rejected');
        break;
      case 3:
        message = this.getText('common_text_request_money_cancelled');
        break;
      default:
        break;
    }

    if (message) {
      $.notify(message, 'info');
    }
  }

  showTxnNotification() {
    let message = null;
    let state = store.getState();
    let note = state.commonData.notificationData.pop();
    let user = state.userData.user;

    if (!note || !note.sender_email) {
      // Check server side
      return;
    }

    let notification_currency = note.currency_type
      ? parseInt(note.currency_type)
      : this.CURRENCY_TYPE.FLASH;
    let notification_currency_name = this.getCurrencyUnitUpcase(
      notification_currency
    );

    if (note.sender_email == store.getState().userData.user.email) {
      if (!note.transaction_type) {
        return;
      }

      if (note.transaction_type == 'like') {
        let params = {
          recipient_email: note.recipientEmail,
          amount: note.amount,
        };
        message = this.getText('common_like_sent_money_alert', params);
      } else {
        let params = {
          amount: note.amount,
          recipient_email: note.recipientEmail,
        };
        message = this.getText('common_fountain_sent_money_alert', params);
      }
    } else {
      let params = { sender_email: note.sender_email, amount: note.amount };
      message =
        this.getText('common_receive_money_alert', params) +
        ' ' +
        notification_currency_name;
    }

    $.notify(message, 'info');
    this.playImcomingSound();
  }

  playImcomingSound() {
    //Mp3 sound audio HTML5
    var embed =
      '<audio id="audio"><source src="assets/sound/money.mp3" type="audio/mpeg"></audio>';
    $('#sound').html(embed);
    document.getElementById('audio').play();
  }

  onLogoutButtonClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    removeIdToken();
    commonActions.removeAllListeners();
    store.dispatch(userActions.logout());
  }

  onShowWalletAddressClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    $('#walletAddressDlg').modal('show');
  }

  onLoadBalanceButtonClick(event: Event) {
    this.refreshIconUrl = 'assets/images/reload.svg';
    store.dispatch(userActions.getBalance());
  }

  onLoadBalanceButtonHoverIn(event: Event) {
    if (this.refreshIconUrl != 'assets/images/reload.svg')
      this.refreshIconUrl = 'assets/images/refresh_icon_orange.png';
  }

  onLoadBalanceButtonHoverOut(event: Event) {
    if (this.refreshIconUrl != 'assets/images/reload.svg')
      this.refreshIconUrl = 'assets/images/refresh_icon_white.png';
  }

  onShowBalanceButtonClick(event: Event) {
    riot.mount('#confirm-send', 'full-balance', {
      balance: localizeFlash(this.balance) + ' ' + this.getCurrencyUnitUpcase(),
      ubalance:
        localizeFlash(this.ubalance) + ' ' + this.getCurrencyUnitUpcase(),
      ebalance:
        localizeFlash(this.ebalance) +
        ' ' +
        this.getCurrencyUnitUpcase(this.CURRENCY_TYPE.ETH),
      unconfirmed:
        this.CURRENCY_TYPE.FLASH !=
        parseInt(localStorage.getItem('currency_type')),
    });
  }
}
