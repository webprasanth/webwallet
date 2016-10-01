import {riot, template, Element} from '../../riot-ts';
import TransactionDetailDivTemplate from './transaction-detail-div.html!text';
import store from '../../../model/store';
import AndamanService from '../../../model/andaman-service'; 
import {satoshiToFlash} from '../../../model/utils';

@template(TransactionDetailDivTemplate)
export default class TransactionDetailDiv extends Element {

    private meta = store.getState().activityData.txn_detail.meta;
    private AvartarServer = `http://${AndamanService.opts.host}:8098/profile/`;
    constructor() {
        super();
    }    

    getDisplayDate(date){
        var moment = (<any>window).UIkit.Utils.moment;
        return moment(date).format('MM D, YYYY hh:mm:ss a');
    }

    formatCurrency(amount) {
        return `${amount} Flash`;
    }
}