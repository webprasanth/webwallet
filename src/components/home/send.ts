import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeSendTemplate from './send.html!text';
import CommonService from '../../model/common/common-service';
import * as utils from '../../model/utils';
import BaseElement from '../base-element';
import _ from 'lodash';
import AndamanService from '../../model/andaman-service';
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
    private avatarServer = AndamanService.AvatarServer;
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
            this.emailErrorMessage = 'Please specify an user to send payment to';
            return;
        } else if (!tag.isValidAddress) {
            this.emailErrorMessage = 'Address is invalid!'
            return;
        }

        if (utils.isValidFlashAddress($('#to-email-id').val())) {
            if (store.getState().userData.user.phone_verified == 0) {
                super.showMessage('', 'You need to provide and verify your phone number.', () => {
                    route('profile');
                });
                return;
            }
        }

        let amount = $('#amount-input').val();
        amount = utils.toOrginalNumber(amount);
        let fee = utils.calcFee(amount);

        if (!amount.toString().match(/^\d+$/g)) {
            this.amountErrorMessage = 'Amount must be integer value';
            return;
        }

        if (amount < 1) {
            this.amountErrorMessage = 'Amount must be at least 1';
            return;
        }

        if (this.userProfile.balance >= amount && this.userProfile.balance < amount + fee) {
            super.showError('', 'You do not have enough fee to make this payment');
            return;
        }

        if (this.userProfile.balance < amount + fee) {
            super.showError('', 'You do not have enough funds to make this payment');
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
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.text.startsWith('flashcoin:')) {
                    result.text = result.text.substring(10, result.text.length);
                }
                $('#to-email-id').val(result.text);
                tag.checkAddress();
                // alert("We got a barcode\n" +
                //     "Result: " + result.text + "\n" +
                //     "Format: " + result.format + "\n" +
                //     "Cancelled: " + result.cancelled);
            },
            function (error) {
                alert("Scanning failed: " + error);
            }, {
                "preferFrontCamera": false, // iOS and Android
                "showFlipCameraButton": true, // iOS and Android
                "prompt": "Place a barcode inside the scan area", // supported on Android only
                "formats": "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                "orientation": "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
            }
        );
    }
}