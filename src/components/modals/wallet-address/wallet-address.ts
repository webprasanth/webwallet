import { riot, template, Element } from '../../riot-ts';
import WalletAddressTemplate from './wallet-address.html!text';
import store from '../../../model/store';
import Constants from '../../../model/constants';
import { decimalFormat, satoshiToFlash, formatCurrency, getDisplayDateTime } from '../../../model/utils';
import {getText} from '../../localise';
import QRCode from 'QRCode';

@template(WalletAddressTemplate)
export default class WalletAddress extends Element {
    //private txnDetail = store.getState().activityData.txn_detail;
    //private meta = store.getState().activityData.txn_detail.meta;
    private getText = getText;
    private publicKeyList = [];

    satoshiToFlash = satoshiToFlash;
    formatCurrency = formatCurrency;
    decimalFormat = decimalFormat;

    constructor() {
        super();
    }

    mounted() {
        var self = this;
        let state = store.getState();
        let data = state.profileData;
        this.publicKeyList = [data.wallet];
        if (!document.getElementById("header-qrcode-desktop").hasChildNodes()) {
            let qrCode = new QRCode("header-qrcode-desktop");
            qrCode.makeCode('flashcoin:' + data.wallet.address);
        }
        this.update();
    }



}