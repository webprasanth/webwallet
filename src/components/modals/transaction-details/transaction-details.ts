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

    satoshiToFlash = satoshiToFlash;
    formatCurrency = formatCurrency;
    decimalFormat = decimalFormat;
    getDisplayDateTime = getDisplayDateTime;

    constructor() {
        super();
    }

    mounted() {
        var self = this;
        $('#txDetailDlg').modal('show');

        $('#txDetailDlg').on('hidden.bs.modal', function () {
            if (self.opts.cb) {
                self.opts.cb();
            }
        });
    }



}