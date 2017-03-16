import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import { tabActions } from '../../../model/tabs/actions';
import { USERS, PROFILE } from '../../../model/action-types';
import TwoFARecommendTemplate from './twofa-recommend-dialog.html!text';

@template(TwoFARecommendTemplate)
export default class TwoFARecommendDialog extends Element {

    mounted() {
        $('#twoFARecommendDialog').modal('show');
    }

    onOk(event: Event) {
        let disableDialog = $('#disable2FARecommend:checked').val();

        if (disableDialog) {
            localStorage.setItem('disable-suggest-2fa', disableDialog);
        }
    }

    gotoProfile() {
        window.location.href = 'home.html#profile';
        setTimeout(function() {
            store.dispatch(tabActions.setActive(PROFILE.SHOW_ACCOUNT_SETTING));
        }, 1000);
    }
}