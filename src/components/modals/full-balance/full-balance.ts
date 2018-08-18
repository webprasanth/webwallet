import { riot, template, Element } from '../../riot-ts';
import FullBalanceTemplate from './full-balance.html!text';
import { getText } from '../../localise';
import { getCurrencyUnit, CURRENCY_TYPE } from '../../../model/currency';
import { isEtherBasedCurrency } from '../../../model/utils';

@template(FullBalanceTemplate)
export default class FullBalance extends Element {
  private getText = getText;
  private getCurrencyUnit = getCurrencyUnit;
  private isEtherBasedCurrency = isEtherBasedCurrency;
  private CURRENCY_TYPE = CURRENCY_TYPE;

  constructor() {
    super();
  }

  mounted() {
    $('#fullBalanceDlg').modal('show');
  }
}
