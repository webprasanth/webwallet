/**
 * Base Element
 */
import { riot, template, Element } from './riot-ts';
import { getText } from './localise';
import { getCurrencyUnitUpcase, getCurrencyUnit } from '../model/currency';

export default class BaseElement extends Element {
  protected getText = getText;
  protected getCurrencyUnitUpcase = getCurrencyUnitUpcase;
  protected getCurrencyUnit = getCurrencyUnit;

  /**
   * Show error dialog
   */
  protected showError(title: string, message: string, cb = null) {
    if (!title || title.length == 0) {
      title = 'Error';
    }
    riot.mount('#error-dialog', 'error-alert', {
      title: title,
      message: message,
      callback: cb,
    });
  }

  showMessage(title: string, message: string, cb = null) {
    if (!title || title.length == 0) {
      title = 'Infomation';
    }
    riot.mount('#error-dialog', 'message-dialog', {
      title: title,
      message: message,
      callback: cb,
    });
  }
}
