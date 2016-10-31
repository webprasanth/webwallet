import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeRequestTemplate from './request.html!text';
import CommonService from '../../model/common/common-service';
import { isValidFlashAddress } from '../../model/utils';
import BaseElement from '../base-element';

let tag = null;

@template(HomeRequestTemplate)
export default class HomeRequest extends BaseElement {
    private userProfile = null;
    private receiverWallet = null;
    private isValidAddress = false;

    mounted() {
        tag = this;
        this.userProfile = store.getState().userData.user;
        $('#rq_to_email_id').typeahead(
            {
                highlight: true
            },
            {
                name: 'email-list',
                source: this.searchWallet
            }
        );
        $('#rq_to_email_id').on('propertychange change click keyup input paste blur', this.checkAddress);
    }

    checkAddress() {
        let term = $('#rq_to_email_id').val();

        if (term == "") {
            tag.isValidAddress = false;
            tag.update();
            return;
        }

        if (isValidFlashAddress(term)) {
            tag.receiverWallet = {};
            tag.receiverWallet.address = term;
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
                tag.receiverWallet = resp.wallets[0];
            } else {
                tag.isValidAddress = false;
            }
            tag.update();
        });
    }

    searchWallet = (query?, syncResults?, asyncResults?) => {
        let term: string = $('#rq_to_email_id').val();

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
        let receiverEmail = $('#rq_to_email_id').val();
        //To email input empty
        if (!receiverEmail) {
            super.showError('', 'Email or address is invalidate!');
            return;
        }

        let amount = $('#requestAmount').val();

        if (!amount.match('^\d+$')) {
            super.showError('', 'Amount must be integer value');
            return;
        }

        if (amount < 1) {
            super.showError('', 'Amount must be at least 1');
            return;
        }

        this.receiverWallet.memo = $('#requestPaymentMemo').val();

        return riot.mount('#confirm-send', 'send-request-confirm', {
            uid: this.receiverWallet.username,
            receiver_email: receiverEmail,
            sender_note: this.receiverWallet.memo,
            amount: amount,
            receiverWallet: this.receiverWallet
        });
    }

    onContinueButtonClick(event: Event) {
        if (tag.isValidAddress) {
            this.checkAndShowComfirmationForm();
        }
    }
}