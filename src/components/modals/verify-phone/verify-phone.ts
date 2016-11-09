import { riot, template } from '../../riot-ts';
import VerifyPhoneTemplate from './verify-phone.html!text';
import BaseElement from '../../base-element';
import { profileActions } from '../../../model/profile/actions';
import { userActions } from '../../../model/users/actions';
import { PROFILE } from '../../../model/action-types';
import store, { ApplicationState } from '../../../model/store';

let tag = null;

@template(VerifyPhoneTemplate)
export default class VerifyPhone extends BaseElement {

    private showForm = true;
    private errorMessage: string = null;
    private requestProcessing = false;
    private requestSuccess = false;
    private resendSMSSuccess = false;
    private static unsubscribe = null;

    constructor() {
        super();
        if (VerifyPhone.unsubscribe) VerifyPhone.unsubscribe();
        VerifyPhone.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
    }

    mounted() {
        tag = this;
        $('#verify-phone-body').modal('show');
        $('#code-input').focus(() => {
            tag.errorMessage = null;
            tag.update();
        });
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.contactsData;
        let actionType = state.lastAction.type;

        switch (actionType) {
            case PROFILE.VERIFY_PHONE_SUCCESS:
                tag.requestProcessing = false;
                tag.requestSuccess = true;
                let profile = state.userData.user;
                profile.phone_verified = 1;
                store.dispatch(profileActions.updateProfileSuccess({ profile: profile }));
                break;
            case PROFILE.VERIFY_PHONE_FAILED:
                tag.requestProcessing = false;
                tag.showForm = true;
                tag.errorMessage = state.lastAction.data.reason;
                break;
            default:
                break;
        }

        tag.update();
    }

    verifyCode(event) {
        let original = event.original || event;
        if (original.keyCode == 13) {
            original.stopPropagation();
        }

        let code = $('#code-input').val().trim();
        let codeRegex = /^[0-9]{5,5}$/;
        let checkCode = code.match(codeRegex);

        if (checkCode == null) {
            tag.errorMessage = "Verification code is not valid!";
        } else {
            let request = {
                sms_code: code
            }

            tag.requestProcessing = true;
            tag.showForm = false;
            tag.update();

            store.dispatch(profileActions.verifyPhone(request));
        }
    }

    resendCode() {
        let phone = store.getState().userData.user.phone;
        phone = phone.replace(/-/g, '');
        phone = phone.replace(/ /g, '');

        if (phone.length != 0) {
            store.dispatch(profileActions.sendVerificationSms({ phone_number: phone }));
        }
    }
}
