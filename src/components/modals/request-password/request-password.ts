import { riot, template } from '../../riot-ts';
import store from '../../../model/store';
import RequestPasswordTemplate from './request-password.html!text';
import { userActions } from '../../../model/users/actions';
import { USERS } from '../../../model/action-types';
import BaseElement from '../../base-element';
import * as utils from '../../../model/utils';
import Premium from 'Premium';

@template(RequestPasswordTemplate)
export default class RequestPassword extends BaseElement {

    private incorrectPassword = false;

    mounted() {
        $('#sendDialog').modal('show');
    }

    confirmPassword() {
        let password: string = $('#user-passowd').val();
        let userKey = utils.getUserKey();
        let privKeyHex = null;

        if (userKey) {
            try {
                privKeyHex = Premium.xaesDecrypt(password, userKey.encryptedPrivKey);
                store.dispatch({ type: USERS.STORE_FOUNTAIN_SECRET, data: password });

                if (this.opts.cb) {
                    this.opts.cb();
                }
                $('#sendDialog').modal('hide');
                
                return;
            } catch (error) {
                
            }
        }

        this.incorrectPassword = true;
    }
}