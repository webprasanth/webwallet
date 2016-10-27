import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import AccountSettingTemplate from './setting.html!text';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';
import QRCode from 'QRCode';

@template(AccountSettingTemplate)
export default class HomeProfile extends Element {

    private userProfile = null;
    private accountType = null;
    private publicKeyList = [];

    mounted() {
        this.userProfile = store.getState().userData.user;
        store.subscribe(this.onApplicationStateChanged.bind(this));
        this.getWallet();
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.profileData;
        let type = state.lastAction.type;

        if (type == PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS) {
            this.publicKeyList = [data.wallet];
            if (!document.getElementById("qrcode").hasChildNodes()) {
                let qrCode = new QRCode("qrcode");
                qrCode.makeCode('flashcoin:' + data.wallet.address);
            }
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
}
