import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeSendTemplate from './send.html!text';
import CommonService from '../../model/common/common-service';
import * as utils from '../../model/utils';
import BaseElement from '../base-element';

let tag = null;

@template(HomeSendTemplate)
export default class HomeSend extends BaseElement {
    private userProfile = null;
    private sendWallet: any;
    private isValidAddress = false;
    private emailErrorMessage = '';
    private amountErrorMessage = '';

    mounted() {
        tag = this;
        this.userProfile = store.getState().userData.user;
        $('#to-email-id').typeahead(
            {
                highlight: true,
                minLength: 3
            }, {
                name: 'email-list',
                source: this.searchWallet
            }
        );

        $('#to-email-id').on('typeahead:select propertychange change click keyup input paste blur', this.checkAddress);
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
            tag.update();
            return;
        }

        let params = {
            term,
            start: 0,
            size: 20
        };

        CommonService.singleton().searchWallet(params).then((resp: any) => {
            if (resp.rc === 1 && resp.wallets.length == 1 && term == resp.wallets[0].email) {
                tag.isValidAddress = true;
                tag.sendWallet = resp.wallets[0];
            } else {
                tag.isValidAddress = false;
            }
            tag.update();
        });
    }

    searchWallet = (query?, syncResults?, asyncResults?) => {
        let term: string = $('#to-email-id').val();

        let params = {
            term,
            start: 0,
            size: 20
        };

        CommonService.singleton().searchWallet(params).then((resp: any) => {
            if (resp.rc === 1 && resp.wallets.length > 0) {

                let data = resp.wallets.map(item => {
                    return item.email;
                });

                if (asyncResults) {
                    asyncResults(data.filter(value => {
                        return value != this.userProfile.email;
                    }));
                }
            } else {
                if (asyncResults) {
                    asyncResults([]);
                }
            }

        });
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
                    riot.route('profile');
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
            wallet: this.sendWallet
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

}