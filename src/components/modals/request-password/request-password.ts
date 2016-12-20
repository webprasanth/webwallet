import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import SendMoneyConfirmTemplate from './request-password.html!text';
import { userActions } from '../../../model/users/actions';
import { USERS } from '../../../model/action-types';
import BaseElement from '../../base-element';
import * as utils from '../../../model/utils';

@template(SendMoneyConfirmTemplate)
export default class SendMoneyConfirm extends BaseElement {

    private userProfile = null;

    mounted() {
        $('#sendDialog').modal('show');
    }

    confirmPassword() {

    }
}