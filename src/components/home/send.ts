import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeSendTemplate from './send.html!text';
import CommonService from '../../model/common/common-service';
import { calcFee, isValidFlashAddress } from '../../model/utils';

let tag = null;

@template(HomeSendTemplate)
export default class HomeSend extends Element {
    private userProfile = null;
    private sendWallet: any;
    private isValidAddress = false;

    onContinueButtonClick(event: Event) {
        if (tag.isValidAddress) {
            this.checkAndShowComfirmationForm();
        }
    }

    mounted() {
        tag = this;
        this.userProfile = store.getState().userData.user;
        $('#to-email-id').typeahead(
            {
                highlight: true
            }, {
                name: 'email-list',
                source: this.searchWallet
            }
        );

        $('#to-email-id').on('propertychange change click keyup input paste', this.checkAddress);
    }

    checkAddress() {
        let term = $('#to-email-id').val();

        if (term == "") return;

        if (isValidFlashAddress(term)) {
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
        //To email input empty
        if (!$('#to-email-id').val()) {
            return;
        }

        let amount = $('#amount-input').val();
        let fee = calcFee(amount);

        if (amount < 1) {
            return riot.mount('#error-dialog', 'error-alert', { title: '', message: 'Amount must be at least 1' });
        }

        if (this.userProfile.balance < amount + fee) {
            return riot.mount('#error-dialog', 'error-alert', { title: '', message: 'You do not have enough funds to make this payment' });
        }

        this.sendWallet.memo = $('#payment-memo').val();

        return riot.mount('#confirm-send', 'send-money-confirm', {
            to: this.sendWallet.address,
            amount: amount,
            fee: fee,
            wallet: this.sendWallet
        });
    }
}