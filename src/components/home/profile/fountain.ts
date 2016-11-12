/**
 * Fountain setting page
 */
import { riot, template } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import FountainSettingTemplate from './fountain.html!text';
import BaseElement from '../../base-element';
import { getUserKey, hexToBase64, filterNumberEdit } from '../../../model/utils';
import Premium from 'Premium';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';

@template(FountainSettingTemplate)
export default class FountainSetting extends BaseElement {

    private userProfile: any = null;
    private fountainEnabled: boolean = false;
    private settings: any = null;

    private selectedTimeUnit: string = null;
    private isHourUnit: boolean = true;
    private isMinuteUnit: boolean = false;
    private isSecondUnit: boolean = false;
    private memo: string = '';
    private disabled: boolean = false;

    private domainStr: string = '';
    private hostname: string = null;
    private fountainId: string = null;
    private amount: number = 0;
    private originAmount: number = 0;
    private duration: number = 0;

    private static unsubscribe = null;

    mounted() {
        this.userProfile = store.getState().userData.user;
        this.getFountain();
        if (FountainSetting.unsubscribe) FountainSetting.unsubscribe();
        FountainSetting.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        $('#amount').keypress(filterNumberEdit);
        $('#duration').keypress(filterNumberEdit);
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let fountain = state.profileData.fountain;
        let type = state.lastAction.type;

        switch (type) {
            case PROFILE.ENABLE_FOUNTAIN_SUCCESS:
                this.fountainId = fountain.fountain_id;
                this.domainStr = this.settings.domainStr;
                this.memo = this.settings.message;
                this.fountainEnabled = true;
                break;
            case PROFILE.UPDATE_FOUNTAIN_SUCCESS:
                this.domainStr = this.settings.domainStr;
                this.memo = this.settings.message;
                super.showMessage('', 'Fountain parameters have been updated');
                break;
            case PROFILE.DISABLE_FOUNTAIN_SUCCESS:
                this.amount = this.settings.amount;
                this.domainStr = this.settings.domains.join(', ');
                this.memo = this.settings.message;

                if (this.settings.duration % 3600 == 0) {
                    this.duration = this.settings.duration / 3600;
                    this.selectedTimeUnit = '3600';

                    this.isMinuteUnit = false;
                    this.isHourUnit = true;
                } else if (this.settings.duration % 60 == 0) {
                    this.duration = this.settings.duration / 60;
                    this.selectedTimeUnit = '60';
                    this.isMinuteUnit = true;
                    this.isHourUnit = false;
                } else {
                    this.duration = this.settings.duration;
                }
                this.fountainEnabled = false;
                this.disabled = true;
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
            fountainId: this.fountainId
        }
        store.dispatch(profileActions.disableFountain(params));
    }

    enableFountain() {
        let userKey = getUserKey();
        this.settings = this._getFountainSetting();

        if (!this.settings) {
            this.disabled = false;
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
        this.settings = this._getFountainSetting();

        if (!this.settings) {
            return;
        }

        let params = {
            fountainId: this.fountainId,
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
            this.settings = JSON.parse(savedFountain.fountain.settings);

            let domains = this.settings.domains;
            let message = this.settings.message;
            let domainStr = '';

            if (domains) {
                domainStr = domains.join(', ');
            }
            this.amount = this.settings.amount;
            this.fountainId = savedFountain.fountain.fountain_id;
            this.domainStr = domainStr;
            this.fountainEnabled = !!savedFountain.fountain.enabled;
            this.memo = message;
            this._setTimeSetting(this.settings);
        } else {
            this.fountainEnabled = false;
        }
    }

    private _setTimeSetting(settings) {
        this.amount = settings.amount;
        this.originAmount = settings.amount;

        var duration = settings.duration;

        if (duration % 3600 == 0) {
            this.duration = duration / 3600;
            this.selectedTimeUnit = '3600';
            this.isHourUnit = true;
            this.isMinuteUnit = false;
            this.isSecondUnit = false;
        } else if (duration % 60 == 0) {
            this.duration = duration / 60;
            this.selectedTimeUnit = '60';
            this.isHourUnit = false;
            this.isMinuteUnit = true;
            this.isSecondUnit = false;
        } else {
            this.duration = duration;
            this.isHourUnit = false;
            this.isMinuteUnit = true;
            this.isSecondUnit = false;
        }
    }

    private _getFountainSetting() {
        let domainStr: string = $('#domains').val();
        let memo: string = $('#memo').val();
        let domains: Array<string> = [];

        // Validate amount
        let amount: number = $('#amount').val();
        if (amount <= 0) {
            super.showError('', 'Please enter an amount');
            return null;
        }

        // Validate duration
        var duration = $('#duration').val();
        if (duration <= 0) {
            super.showError('', 'Please enter period');
            return null;
        }

        let selectedTimeUnit: string = $('#time-unit').val();
        if (selectedTimeUnit == '60' && duration < 10) {
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
            var domainReg = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

            for (var i = 0; i < domains.length; i++) {
                domains[i] = domains[i].trim();

                if (!domains[i].match(domainReg)) {
                    super.showError('', domains[i] + ' is not a domain');
                    return null;
                }

            }

            var unit = $('#time-unit').val();
            var settings = {
                domains: domains,
                domainStr: domainStr,
                amount: amount,
                message: memo,
                duration: duration * unit
            };

            return settings;
        }

        return null;
    }
}
