/**
 * Fountain setting page
 */
import { riot, template } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import FountainSettingTemplate from './fountain.html!text';
import BaseElement from '../../base-element';
import { getUserKey, hexToBase64, filterNumberEdit } from '../../../model/utils';
import Premium from 'Premium';
import * as utils from '../../../model/utils';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';

@template(FountainSettingTemplate)
export default class FountainSetting extends BaseElement {

    private userProfile: any = null;
    private settings: any = {};
    private fountain: any = {};

    // Disable display
    private disabled: boolean = false;

    private selectedTimeUnit: number = null;
    private isHourUnit: boolean = true;
    private isMinuteUnit: boolean = false;

    private hostname: string = null;
    private duration: number = 0;
    private formatAmountInput = utils.formatAmountInput;

    private static unsubscribe = null;

    mounted() {
        this.userProfile = store.getState().userData.user;
        this.getFountain();
        if (FountainSetting.unsubscribe) FountainSetting.unsubscribe();
        FountainSetting.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        $('#amount').keypress(filterNumberEdit);
        $('#duration').keypress(filterNumberEdit);
        $('#amount').on('blur', utils.formatAmountInput);
        $('#duration').on('blur', utils.formatAmountInput);
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let fountain = state.profileData.fountain;
        let type = state.lastAction.type;

        switch (type) {
            case PROFILE.ENABLE_FOUNTAIN_SUCCESS:
                if (!this.settings) {
                    this.settings = {};
                }
                this._setTimeSetting(this.settings);
                this.fountain.enabled = true;
                this.disabled = false;
                break;
            case PROFILE.UPDATE_FOUNTAIN_SUCCESS:
                super.showMessage('', 'Fountain parameters have been updated');
                break;
            case PROFILE.DISABLE_FOUNTAIN_SUCCESS:
                this.fountain.enabled = false;
                this.disabled = this.hasFountainSetting();

                if (this.settings.amount) {
                    $('#amount').val(utils.formatAmountInput(this.settings.amount));
                    $('#duration').val(utils.formatAmountInput(this.duration));
                    $('#memo').val(this.settings.message);
                    $('#domains').val(this.settings.domainStr);
                }

                break;
            case PROFILE.GET_FOUNTAIN_SUCCESS:
                let saveFountain = state.profileData.savedFountain;
                this._setSavedFountain(saveFountain);
                break;
            default:
                break;
        }

        this.update();
    }

    disableFountain() {
        let params = {
            fountainId: this.fountain.fountain_id
        }
        store.dispatch(profileActions.disableFountain(params));
    }

    hasFountainSetting() {
        return !!(this.settings && this.settings.amount && this.settings.duration && this.settings.domainStr.length > 0);
    }

    enableFountain() {
        let userKey = getUserKey();

        this.settings = this._getFountainSetting();
        if (!this.settings) {
            return;
        }

        let params = {
            idToken: userKey.idToken,
            settings: this.settings,
            secret: null
        }

        if (this.userProfile.authVersion == 3) {
            params.secret = this.userProfile.fountainSecret;
        } else {
            if (!this.userProfile.fountainSecret) {
                riot.mount('#confirm-send', 'request-password', {cb: this.enableFountain.bind(this)});
                return;
            }

            let password = this.userProfile.fountainSecret;

            if (userKey) {
                let privKeyHex = Premium.xaesDecrypt(password, userKey.encryptedPrivKey);
                let privKeyBase64 = hexToBase64(privKeyHex);
                params.secret = privKeyBase64;
            }
        }

        store.dispatch(profileActions.enableFountain(params));
    }

    updateFountain() {
        let settings = this._getFountainSetting();

        if (!settings) {
            return;
        }
        this.settings = settings;
        this._setTimeSetting(settings);

        let params = {
            fountainId: this.fountain.fountain_id,
            settings: this.settings
        };
        store.dispatch(profileActions.updateFountain(params));
    }

    getFountain() {
        let params = {};
        store.dispatch(profileActions.getFountain(params));
    }

    private _setSavedFountain(savedFountain) {

        if (savedFountain.fountain) {
            this.fountain = savedFountain.fountain;

            if (savedFountain.fountain.settings) {
                this.settings = JSON.parse(savedFountain.fountain.settings);
                let domains = this.settings.domains;
                let message = this.settings.message;
                let domainStr = '';

                if (domains) {
                    domainStr = domains.join(', ');
                }

                this.settings.domainStr = domainStr;
                this.fountain.enabled = !!savedFountain.fountain.enabled;

                this._setTimeSetting(this.settings);
                this.disabled = !this.fountain.enabled && this.hasFountainSetting();
            } else {
                this.disabled = false;
            }

        } else {
            this.fountain = { enabled: false };
            this.disabled = false;
        }
    }

    private _setTimeSetting(settings) {
        var duration = settings.duration;

        if (duration % 3600 == 0) {
            this.duration = duration / 3600;
            this.selectedTimeUnit = 3600;
            this.isHourUnit = true;
            this.isMinuteUnit = false;
        } else if (duration % 60 == 0) {
            this.duration = duration / 60;
            this.selectedTimeUnit = 60;
            this.isHourUnit = false;
            this.isMinuteUnit = true;
        } else {
            this.duration = duration;
            this.isHourUnit = false;
            this.isMinuteUnit = true;
        }
    }

    private _getFountainSetting() {
        let domainStr: string = $('#domains').val();
        let memo: string = $('#memo').val();
        let domains: Array<string> = [];
        let self = this;

        // Validate amount
        let amount = $('#amount').val();
        amount = utils.toOrginalNumber(amount);

        if (amount <= 0) {
            super.showError('', 'Please enter an amount');
            return null;
        }

        // Validate duration
        let duration = $('#duration').val();
        duration = utils.toOrginalNumber(duration);

        if (duration <= 0) {
            super.showError('', 'Please enter period');
            return null;
        }

        let selectedTimeUnit: number = $('#time-unit').val();
        if (selectedTimeUnit == 60 && duration < 10) {
            super.showError('', 'Minimum period is 10 minutes');
            return null;
        }

        // Validate domain
        if (domainStr) {
            domains = domainStr.split(',');
        } else {
            super.showError('', 'Please list URL\'s allowed to host your fountain or it will possibly be abused');
            return null;
        }

        if (domains.length > 0) {
            let domainReg = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

            for (let i = 0; i < domains.length; i++) {
                domains[i] = domains[i].trim();

                if (!domains[i].match(domainReg)) {
                    super.showError('', domains[i] + ' is not a domain');
                    return null;
                }

            }

            let settings = {
                domains: domains,
                domainStr: domainStr,
                amount: amount,
                message: memo,
                duration: duration * selectedTimeUnit
            };

            return settings;
        }

        return null;
    }
}
