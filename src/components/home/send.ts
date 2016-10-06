import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeSendTemplate from './send.html!text';
import AndamanService from '../../model/andaman-service';
import {calcFee} from '../../model/utils';

@template(HomeSendTemplate)
export default class HomeSend extends Element {
    private continueButtonClicked: boolean = true;
    private userProfile = null;

    onContinueButtonClick(event: Event) {
        this.continueButtonClicked = true;
        this.searchWallet(null, null, null);
    }

    mounted() {
        this.userProfile = store.getState().userData.user;
        $('.typeahead').typeahead({
            highlight: true
        },
        {
            name: 'email-list',
            source: this.searchWallet
        });
    }

    searchWallet = (query, syncResults, asyncResults) => {
        let term: string = $('#to_email_id').val();

        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            let params = {
                term,
                start: 0,
                size: 20
            };

            andaman.search_wallet(pipe, params, (resp: any) => {
                if (resp.rc === 1 && resp.wallets.length > 0) {
                    if (resp.wallets.length == 1 && term == resp.wallets[0].email) {
                        if (this.continueButtonClicked) {
                            this.continueButtonClicked = false;
                            this.checkAndShowComfirmationForm();
                            return;
                        }
                    }

                    let data = resp.wallets.map(item => {
                        return item.email;
                    });

                    asyncResults(data.filter(value => {
                        return value != this.userProfile.email;
                    }));
                } else {
                    asyncResults([]);
                }
                
            });
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
            return riot.mount('#error-dialog', 'error-alert', {title: '', message: 'Amount must be at least 1'});
        }

        if (this.userProfile.balance < amount + fee) {
            return riot.mount('#error-dialog', 'error-alert', {title: '', message: 'You do not have enough funds to make this payment'});
        }

        let memo = $('#payment-memo').val();
        
        showConfirmation({
            to: to,
            amount: amount,
            denomination: ractive.get('denomination'),
            fee: fee,
            wallet: sendAddr
        });
    }
}