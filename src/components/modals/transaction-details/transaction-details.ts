import { riot, template, Element } from '../../riot-ts';
import TransactionDetailsTemplate from './transaction-details.html!text';
import store from '../../../model/store';
import AndamanService from '../../../model/andaman-service';
import { decimalFormat, satoshiToFlash, formatCurrency, getDisplayDateTime } from '../../../model/utils';

@template(TransactionDetailsTemplate)
export default class TransactionDetails extends Element {
    private txnDetail = store.getState().activityData.txn_detail;
    private meta = store.getState().activityData.txn_detail.meta;

    private AvatarServer = AndamanService.AvatarServer;

    private satoshiToFlash = satoshiToFlash;
    private formatCurrency = formatCurrency;
    private decimalFormat = decimalFormat;

    constructor() {
        super();
    }

    mounted() {
        $('#txDetailDlg').modal('show');
    }

    getDisplayDateTime = getDisplayDateTime;

}