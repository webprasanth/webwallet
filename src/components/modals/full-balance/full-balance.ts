import { riot, template, Element } from '../../riot-ts';
import FullBalanceTemplate from './full-balance.html!text';
import {getText} from '../../localise';

@template(FullBalanceTemplate)
export default class FullBalance extends Element {
    private getText = getText;

    constructor() {
        super();
    }

    mounted() {
        $('#fullBalanceDlg').modal('show');
    }
}