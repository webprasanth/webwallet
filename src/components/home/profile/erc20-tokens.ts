import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import { profileActions } from '../../../model/profile/actions';
import { PROFILE } from '../../../model/action-types';
import ERC20TokensTemplate from './erc20-tokens.html!text';
import BaseElement from '../../base-element';
import { CURRENCY_ICON_URL } from '../../../model/currency';
import * as utils from '../../../model/utils';

@template(ERC20TokensTemplate)
export default class ERC20Tokens extends BaseElement {
  private static unsubscribe = null;

  mounted() {
    this.allERC20Tokens = utils.getERC20Tokens();
    this.currency_icon_url = CURRENCY_ICON_URL;
    this.getSelectedERC20Tokens();
    this.selectedTokens = [];

    if (ERC20Tokens.unsubscribe) ERC20Tokens.unsubscribe();
    ERC20Tokens.unsubscribe = store.subscribe(
      this.onApplicationStateChanged.bind(this)
    );
  }

  onApplicationStateChanged() {
    let state = store.getState();
    let type = state.lastAction.type;
    let data = state.lastAction.data;

    switch (type) {
      case PROFILE.GET_ERC20_TOKENS_SUCCESS:
        if (data.currency_types.length > 0) {
          this.selectedTokens = data.currency_types;
        }
        break;
      case PROFILE.GET_ERC20_TOKENS_FAILED:
        super.showMessage('', this.getText('erc20Token_failed_to_get_list'));
        break;
      case PROFILE.UPDATE_ERC20_TOKENS_SUCCESS:
        super.showMessage(
          '',
          this.getText('erc20Token_list_updated_successfully')
        );
        break;
      case PROFILE.UPDATE_ERC20_TOKENS_FAILED:
        super.showMessage('', this.getText('erc20Token_failed_to_update_list'));
        break;
      default:
        break;
    }

    this.update();
  }

  getSelectedERC20Tokens() {
    let params = {};
    store.dispatch(profileActions.getERC20Tokens(params));
  }

  updateERC20Tokens() {
    let newSelectedTokens = $('#erc20tokensFrm input:checkbox:checked')
      .map(function() {
        return parseInt($(this).val());
      })
      .get();

    let params = { currency_types: newSelectedTokens };
    store.dispatch(profileActions.updateERC20Tokens(params));
  }

  onERC20TknClick(event: Event) {
    var erc20Chkbox = event.target;
    if ($(erc20Chkbox).is(':checked')) {
      $(erc20Chkbox)
        .closest('.erc20tkn')
        .addClass('selected');
    } else {
      $(erc20Chkbox)
        .closest('.erc20tkn')
        .removeClass('selected');
    }
  }
}
