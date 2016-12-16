import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeRequestTemplate from './request.html!text';
import CommonService from '../../model/common/common-service';
import * as utils from '../../model/utils';
import BaseElement from '../base-element';
import _ from 'lodash';
import AndamanService from '../../model/andaman-service';
import { FCEvent } from '../../model/types';
import { commonActions } from '../../model/common/actions';

let tag = null;

@template(HomeRequestTemplate)
export default class HomeRequest extends BaseElement {
    private userProfile = null;
    private receiverWallet = null;
    private isValidAddress = false;
    private emailErrorMessage = '';
    private amountErrorMessage = '';
    private choosingAddress = false;
    private wallets = [];
    private addressSelected = false;
    private avatarServer = AndamanService.AvatarServer;

    mounted() {
        tag = this;
        this.userProfile = store.getState().userData.user;
        $('#rq_to_email_id').on('propertychange change click keyup input paste', _.debounce((e) => {
            this.searchWallet();
        }, 500));
        $('#rq_to_email_id').on('propertychange change click keyup input paste', this.checkAddress);
        $('#continue-request-bt').on('blur', this.resetErrorMessages);
        $('#requestAmount').on('blur', utils.formatAmountInput);
        $('#requestAmount').keypress(utils.filterNumberEdit);
    }

    checkAddress() {
        let term = $('#rq_to_email_id').val();

        if (term == "") {
            tag.isValidAddress = false;
            tag.update();
            return;
        }

        if (utils.isValidFlashAddress(term)) {
            tag.receiverWallet = {};
            tag.receiverWallet.address = term;
            tag.isValidAddress = true;
            tag.addressSelected = true;
            tag.choosingAddress = false;
            tag.update();
            return;
        }
    }

    searchWallet = () => {
        tag.choosingAddress = true;

        let term: string = $('#rq_to_email_id').val();

        let params = {
            term,
            start: 0,
            size: 20
        };

        CommonService.singleton().searchWallet(params).then((resp: any) => {
            if (resp.rc === 1 && resp.wallets.length > 0) {
                this.wallets = resp.wallets;
                if (resp.wallets.length == 1 && term == resp.wallets[0].email) {
                    tag.isValidAddress = true;
                    tag.receiverWallet = resp.wallets[0];
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

        console.log('chooseAddress');
        $('#rq_to_email_id').val(event.item.w.email);
        tag.receiverWallet = event.item.w;
        tag.isValidAddress = true;
        tag.addressSelected = true;
        tag.choosingAddress = false;
        tag.update();
    }

    checkAndShowComfirmationForm() {
        let receiverEmail = $('#rq_to_email_id').val();

        if (!receiverEmail) {
            this.emailErrorMessage = 'Please specify an user to send payment request to';
            return;
        } else if (!tag.isValidAddress) {
            this.emailErrorMessage = 'Address is invalid!'
            return;
        }

        let amount = $('#requestAmount').val();
        amount = utils.toOrginalNumber(amount);

        if (!amount.toString().match(/^\d+$/g)) {
            this.amountErrorMessage = 'Amount must be integer value';
            return;
        }

        if (amount < 1) {
            this.amountErrorMessage = 'Amount must be at least 1';
            return;
        }

        this.receiverWallet.memo = $('#requestPaymentMemo').val();

        let callback = function () {
            this.clearForms();
        }.bind(this);

        return riot.mount('#confirm-send', 'send-request-confirm', {
            uid: this.receiverWallet.username,
            receiver_email: receiverEmail,
            sender_note: this.receiverWallet.memo,
            amount: amount,
            receiverWallet: this.receiverWallet,
            cb: callback
        });
    }

    onContinueButtonClick(event: Event) {
        this.checkAndShowComfirmationForm();
    }

    clearForms() {
        $('#rq_to_email_id').val('');
        $('#requestAmount').val('');
        $('#requestPaymentMemo').val('');
        tag.isValidAddress = false;
        this.resetErrorMessages();
    }

    resetErrorMessages() {
        tag.emailErrorMessage = '';
        tag.amountErrorMessage = '';
        tag.update();
    }

}