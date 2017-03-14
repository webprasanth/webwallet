import { riot, template, Element } from '../../riot-ts';
import store from '../../../model/store';
import { getUserKey } from '../../../model/utils';
import { userActions } from '../../../model/users/actions';
import { USERS } from '../../../model/action-types';
import TwoFARecommendTemplate from './twofa-recommend-dialog.html!text';

@template(TwoFARecommendTemplate)
export default class TwoFAVerificationDialog extends Element {

    onOk(event: Event) {
        // Dismiss dialog
    }
}