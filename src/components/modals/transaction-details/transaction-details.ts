import {riot, template, Element} from '../../riot-ts';
import TransactionDetailsTemplate from './transaction-details.html!text';
import store from '../../../model/store';
import AndamanService from '../../../model/andaman-service'; 
import {satoshiToFlash, formatCurrency} from '../../../model/utils';

@template(TransactionDetailsTemplate)
export default class TransactionDetails extends Element {
    private txnDetail = store.getState().activityData.txn_detail;
    private meta = store.getState().activityData.txn_detail.meta;

    private AvartarServer = `http://${AndamanService.opts.host}:8098/profile/`;

    private satoshiToFlash = satoshiToFlash;
    private formatCurrency = formatCurrency;
    
    constructor() {
        super();
    }    

    mounted() {
        $('#txDetailDlg').modal('show');
    }
    
    getDisplayDate(date){
        var moment = (<any>window).UIkit.Utils.moment;
        return moment(date).format('MM D, YYYY hh:mm:ss a');
    }

}