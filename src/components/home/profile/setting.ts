/**
 * Account setting
 */
import { riot, template } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import AccountSettingTemplate from './setting.html!text';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';
import QRCode from 'QRCode';
import BaseElement from '../../base-element';

@template(AccountSettingTemplate)
export default class AccountSetting extends BaseElement {

    private userProfile = {};
    private accountType = 'Consumer';
    private publicKeyList = [];
    private is2FA: boolean = false;
    private static unsubscribe = null;

    mounted() {
        this.userProfile = store.getState().userData.user;
        if (AccountSetting.unsubscribe) AccountSetting.unsubscribe();
        AccountSetting.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.is2FA = false;
        this.getWallet();
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.profileData;
        let type = state.lastAction.type;

        switch (type) {
            case PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS:
                this.publicKeyList = [data.wallet];
                if (!document.getElementById("qrcode").hasChildNodes()) {
                    let qrCode = new QRCode("qrcode");
                    qrCode.makeCode('flashcoin:' + data.wallet.address);
                }
                break;
            case PROFILE.ENABLE_2FA_SUCCESS:
                this.is2FA = true;
                let otpUri = state.profileData.twoFAInfo.otpUri;

                if (!document.getElementById("tfa_qrcode").hasChildNodes()) {
                    var qrCode = new QRCode("tfa_qrcode");
                    qrCode.makeCode(decodeURIComponent(otpUri));
                }
                break;
            case PROFILE.ENABLE_2FA_FAILED:
                super.showError('', 'Failed to get otpUri from server');
                break;
            case PROFILE.DISABLE_2FA_SUCCESS:
                this.userProfile.totp_enabled = 0;
                this.is2FA = false;
                super.showMessage('', 'Two phase authentication has been turn off successfully');
                break;
            case PROFILE.DISABLE_2FA_FAILED:
                super.showError('', 'Turn off Two phase authentication failed');
                break;
            case PROFILE.CONFIRM_2FA_CODE_SUCCESS:
                // TODO This is hack. The correct way is call to users/reducer and upate user profile
                this.userProfile.totp_enabled = 1;
                this.is2FA = false;
                super.showMessage('', 'Setup Two phase authentication successfully. You need to enter Google authenticator code every time you log in to your account.');
                break;
            case PROFILE.CONFIRM_2FA_CODE_FAILED:
                super.showError('', 'Confirm code fail');
                break;
            default:
                break;
        }

        this.update();
    }

    getWallet() {
        let account = {
            email: this.userProfile.email,
            start: 0,
            size: 1
        };

        store.dispatch(profileActions.getWalletsByEmail(account));
    }

    toogle2FA() {
        if (this.is2FA && !this.userProfile.totp_enabled) {
            this.is2FA = false;
            return;
        }

        if (this.userProfile.totp_enabled) {
            this.disable2FA();
        } else {
            this.enable2FA();
        }
    }

    enable2FA() {
        let params = {};
        store.dispatch(profileActions.enable2FA(params));
    }

    disable2FA() {
        let params = {};
        store.dispatch(profileActions.disable2FA(params));
    }

    confirm2FACode() {
        let code: string = $("#google-2fa-code").val();
        if (code.length == 0) {
            super.showError('', 'Invalid code');
            return;
        }

        let params = {
            code: code
        };
        store.dispatch(profileActions.confirm2FACode(params));
    }
}
