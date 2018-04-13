import { riot, template, Element } from '../../riot-ts';
import WalletAddressTemplate from './wallet-address.html!text';
import store from '../../../model/store';
import Constants from '../../../model/constants';
import {
  decimalFormat,
  satoshiToFlash,
  formatCurrency,
  getDisplayDateTime,
} from '../../../model/utils';
import { getText } from '../../localise';
import QRCode from 'QRCode';
import { CURRENCY_TYPE } from '../../../model/currency';

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

  onApplicationStateChanged() {

    let state: ApplicationState = store.getState();
    
    switch (state.lastAction.type) {
      case PROFILE.GET_WALLETS_BY_EMAIL_SUCCESS:
          this.update();
        break;
      default:
        break;
    }
  }

  mounted() {
    var self = this;
    let state = store.getState();
    let data = state.profileData;
    this.publicKeyList = [data.wallet];
    if (!document.getElementById('header-qrcode-desktop').hasChildNodes()) {
      let qrCode = new QRCode('header-qrcode-desktop');
    if (parseInt(localStorage.getItem('currency_type')) == CURRENCY_TYPE.FLASH) {
      qrCode.makeCode('flashcoin:' + data.wallet.address);
      }
      else {
      qrCode.makeCode(data.wallet.address);  //generating QR code for non flash withot appending word flashcoin
      }
    }
    this.update();
  }
}
