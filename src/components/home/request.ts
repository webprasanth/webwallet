import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeRequestTemplate from './request.html!text';
import CommonService from '../../model/common/common-service';

@template(HomeRequestTemplate)
export default class HomeRequest extends Element {
    private userProfile = null;
    private continueButtonClicked: boolean = false;
    private receiverWallet = null;
    private isValidAddress = false;

    mounted() {
        this.userProfile = store.getState().userData.user;
        $('#rq_to_email_id').typeahead({
            highlight: true
        },
            {
                name: 'email-list',
                source: this.searchWallet
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
                if (resp.wallets.length == 1 && term == resp.wallets[0].email) {
                    if (this.continueButtonClicked) {
                        this.receiverWallet = resp.wallets[0];
                        this.continueButtonClicked = false;
                        this.checkAndShowComfirmationForm();
                        return;
                    }
                }

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
            return;
        }

        let amount = $('#requestAmount').val();

        if (amount < 1) {
            return riot.mount('#error-dialog', 'error-alert', { title: '', message: 'Amount must be at least 1' });
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
        this.continueButtonClicked = true;
        this.searchWallet();
    }
}