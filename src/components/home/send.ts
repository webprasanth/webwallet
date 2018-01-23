import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeSendTemplate from './send.html!text';
import CommonService from '../../model/common/common-service';
import * as utils from '../../model/utils';
import BaseElement from '../base-element';
import _ from 'lodash';
import qrCodeScanner from 'maulikvora/qr-code-scanner';
import Constants from '../../model/constants';
import { FCEvent } from '../../model/types';

let tag = null;

@template(HomeSendTemplate)
export default class HomeSend extends BaseElement {
    private userProfile = null;
    private sendWallet: any;
    private isValidAddress = false;
    private emailErrorMessage = '';
    private amountErrorMessage = '';
    private choosingAddress = false;
    private wallets = [];
    private addressSelected = false;
    private avatarServer = Constants.AvatarServer;
    private isDesktop = utils.isDesktop();

    mounted() {
        tag = this;
        this.userProfile = store.getState().userData.user;
        $('#to-email-id').on('propertychange change click keyup input paste', _.debounce((e) => {
            this.searchWallet();
        }, 500));
        $('#to-email-id').on('propertychange change click keyup input paste', this.checkAddress);
        $('#continue-send-bt').on('blur', this.resetErrorMessages);
        $('#amount-input').on('blur', utils.formatAmountInput);
        $('#amount-input').keypress(utils.filterNumberEdit);
    }

    checkAddress() {
        let term = $('#to-email-id').val();

        if (term == "") {
            tag.isValidAddress = false;
            tag.update();
            return;
        }

        if (utils.isValidFlashAddress(term) && term != store.getState().profileData.wallet.address) {
            tag.sendWallet = {};
            tag.sendWallet.address = term;
            tag.isValidAddress = true;
            tag.addressSelected = true;
            tag.choosingAddress = false;
            tag.update();
            return;
        }

    }

    searchWallet = () => {
        tag.choosingAddress = true;

        let term: string = $('#to-email-id').val();
        let params = {
            term,
            start: 0,
            size: 10
        };

        CommonService.singleton().searchWallet(params).then((resp: any) => {
            if (resp.rc === 1 && resp.wallets.length > 0) {
                this.wallets = resp.wallets;
                if (resp.wallets.length == 1 && term == resp.wallets[0].email) {
                    tag.isValidAddress = true;
                    tag.sendWallet = resp.wallets[0];
                    tag.addressSelected = true;
                    tag.choosingAddress = false;
                } else {
                    tag.isValidAddress = false;
                    tag.addressSelected = false;
                }
            } else {
                this.wallets = [];
            }
            this.update();
        });
    }

    chooseAddress(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        $('#to-email-id').val(event.item.w.email);
        tag.sendWallet = event.item.w;
        tag.isValidAddress = true;
        tag.addressSelected = true;
        tag.choosingAddress = false;
        tag.update();
    }

    checkAndShowComfirmationForm() {
        if (!$('#to-email-id').val()) {
            this.emailErrorMessage = this.getText('invalid_send_receiver_error');
            return;
        } else if (!tag.isValidAddress) {
            this.emailErrorMessage = this.getText('invalid_receiver_address_error');
            return;
        }

        if (utils.isValidFlashAddress($('#to-email-id').val())) {
            // # disable checking phone verification to do withdraw
            // if (store.getState().userData.user.phone_verified == 0) {
            //     super.showMessage('', 'You need to provide and verify your phone number.', () => {
            //         route('profile');
            //     });
            //     return;
            // }
        }

        let amount = $('#amount-input').val();
        amount = utils.toOrginalNumber(amount);
        let fee = utils.calcFee(amount);

        if (!amount.toString().match(/^(\d+\.?\d*|\.\d+)$/)) {
            this.amountErrorMessage = this.getText('common_alert_int_cash_unit');
            return;
        }

        if (amount < 1) {
            this.amountErrorMessage = this.getText('common_alert_minimum_cash_unit');
            return;
        }

        if (this.userProfile.balance >= amount && this.userProfile.balance < amount + fee) {
            super.showError('', this.getText('send_not_enough_fund_error'));
            return;
        }

        if (this.userProfile.balance < amount + fee) {
            super.showError('', this.getText('send_not_enough_fee_error'));
            return;
        }

        this.sendWallet.memo = $('#payment-memo').val();

        return riot.mount('#confirm-send', 'send-money-confirm', {
            to: this.sendWallet.address,
            amount: amount,
            fee: fee,
            wallet: this.sendWallet,
            cb: this.clearForms.bind(this)
        });
		
        /* Below code is commented as 2fa while transaction is not required as of now. 
           when needed above riot.mount call should be removed and just uncomment the below if else code 23-01-2018 : Ashwini */
		   
       /* if (!store.getState().userData.user.totp_enabled) {
            return riot.mount('#confirm-send', 'send-money-confirm', {
            	to: this.sendWallet.address,
            	amount: amount,
            	fee: fee,
            	wallet: this.sendWallet,
            	cb: this.clearForms.bind(this)
            });
        }
        else {
            riot.mount('#confirm-send', 'twofa-verification-sendtxn',{
                    to: this.sendWallet.address,
                    amount: amount,
                    fee: fee,
                    wallet: this.sendWallet,
                    cb: this.clearForms.bind(this)
                });
            } */
    }

    onContinueButtonClick(event: Event) {
        this.checkAndShowComfirmationForm();
    }

    clearForms() {
        $('#to-email-id').val('');
        $('#amount-input').val('');
        $('#payment-memo').val('');
        tag.isValidAddress = false;
        this.resetErrorMessages();
    }

    resetErrorMessages() {
        tag.emailErrorMessage = '';
        tag.amountErrorMessage = '';
        tag.update();
    }

    openQRcodeScan() {
		this.resetErrorMessages();
		qrCodeScanner.initiate({
			onResult: (result) => { 
						let containsColumn = result.indexOf(':');
						if (containsColumn >= 0) {
							result = result.substring((containsColumn + 1), result.length);
						}
                        if(result.length != 34)
                            QRcodeScanError();
                        else
                        {
                            $('#to-email-id').val(result);
                            this.checkAddress();
                        }
					},
			onError: (err) => this.QRcodeScanError(err),
			onTimeout: () => this.QRcodeScanTimeout()
		});
    }
	
	QRcodeScanError(err) {
		this.emailErrorMessage = this.getText('error_in_scan_qr');
	}
	
	QRcodeScanTimeout = () => {
		this.emailErrorMessage = this.getText('timeout_in_scan_qr');
		this.update();
	}
}