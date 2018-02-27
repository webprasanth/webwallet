import { riot, template, Element } from '../../riot-ts';
import FullBalanceTemplate from './full-balance.html!text';
import {getText} from '../../localise';
import { getCurrencyUnit } from '../../../model/currency';

@template(FullBalanceTemplate)
export default class FullBalance extends Element {
    private getText = getText;
    private getCurrencyUnit = getCurrencyUnit;

    constructor() {
        super();
    }

    mounted() {
        $('#fullBalanceDlg').modal('show');
    }
}