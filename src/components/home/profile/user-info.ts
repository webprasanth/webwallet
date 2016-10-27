/**
 * Profile user information tab
 */
import BaseElement from '../../base-element';
import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import UserInfoTemplate from './user-info.html!text';
import AndamanService from '../../../model/andaman-service';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';
import Premium from 'Premium';
import { getUserKey, storeUserKey, getIdToken } from '../../../model/utils';
import CryptoJS from 'crypto-js';

@template(UserInfoTemplate)
export default class UserInfo extends BaseElement {

    private userProfile = null;
    private isEditingName: boolean = false;
    private isEditingPass: boolean = false;
    private isEditingTimezone: boolean = false;
    private timezones = [];
    private userKey: any = null;
    private currentPassword: string = null;
    private newPassword: string = null;
    private confirmPassword: string = null;
    private encryptedPrivateKey: string = null;
    
    mounted() {
        this.userProfile = store.getState().userData.user;
        store.subscribe(this.onApplicationStateChanged.bind(this));
        this.update();
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.profileData;
        let type = state.lastAction.type;

        switch (type) {
            case PROFILE.UPDATE_PROFILE_SUCCESS:
                this.userProfile = state.userData.user;
                this.onCancel();
                break;
            case PROFILE.CHANGE_PASSWORD_SUCCESS:
                this.userKey.encryptedPrivKey = this.encryptedPrivateKey;
                this.encryptedPrivateKey = null;
                storeUserKey(this.userKey);
                $("#currentPassword").val('');
                $("#newPassword").val('');
                $("#confirmPassword").val('');
                this.onCancel();
                break;
            case PROFILE.GET_SSO_KEYPAIR_SUCCESS:
                this.userKey.encryptedPrivKey = data.keypair.privateKey;
                this.checkAndChangePassword();
                break;
            default:
                break;
        }

        this.update();
    }

    onCancel() {
        this.isEditingName = false;
        this.isEditingPass = false;
        this.isEditingTimezone = false;
    }

    onEditName() {
        this.isEditingName = true;
    }

    onSaveName() {
        this.isEditingName = false;
        let displayName = $("#profile-name input").val().trim();

        if (displayName != "") {
            let account = {
                display_name: displayName
            };
            store.dispatch(profileActions.updateProfile(account));
        }
    }

    onEditPass() {
        this.isEditingPass = true;
    }

    onSavePass() {
        this.currentPassword = $("#currentPassword").val();
        this.newPassword = $("#newPassword").val();
        this.confirmPassword = $("#confirmPassword").val();
        this.userKey = getUserKey() || {};

        if (this.userKey.encryptedPrivKey) {
            this.checkAndChangePassword();
        } else {
            let params = {
                idToken: this.userProfile.idToken
            };
            profileActions.getSSOKeypair(params);
        }
    }

    checkAndChangePassword() {
        if (this.currentPassword === "" && this.newPassword === "" && this.confirmPassword === "") {
            this.isEditingPass = false;
            return;
        }

        if (this.currentPassword === "") {
            super.showError('', 'Please enter your current password');
            return;
        }

        // Verify current password
        try {
            Premium.xaesDecrypt(this.currentPassword, this.userKey.encryptedPrivKey);
        } catch (e) {
            super.showError('', 'Current password is not correct!');
            return;
        }

        if (this.newPassword === "") {
            super.showError('', 'Password cannot be empty');
            return;
        }

        if (this.newPassword != this.confirmPassword) {
            super.showError('', 'Confirmed password is not correct!');
            return;
        }

        this.changePassWithPrivateKey();
    }

    changePassWithPrivateKey() {
        let self = this;
        let encryptedPrivKey = this.userKey.encryptedPrivKey;
        let myPrivKeyHex = Premium.xaesDecrypt(this.currentPassword, encryptedPrivKey);
        let keyByteSize = 256;
        this.encryptedPrivateKey = JSON.stringify(Premium.xaesEncrypt(keyByteSize, this.newPassword, myPrivKeyHex));

        let params = {
            idToken: this.userKey.idToken,
            password: CryptoJS.MD5(this.currentPassword).toString(),
            newPassword: CryptoJS.MD5(this.newPassword).toString(),
            newPrivateKey: this.encryptedPrivateKey
        };

        store.dispatch(profileActions.changePassword(params));
    }

}
