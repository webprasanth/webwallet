/**
 * Merchant Stand
 */
import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import Constants from '../../../model/constants';
import MerchantWidgetsTemplate from './merchant-widgets.html!text';
import { isMobile } from '../../../model/utils';
import { getText } from '../../localise';

let tag = null;
@template(MerchantWidgetsTemplate)
export default class MerchantWidgets extends Element {
  private walletAddress = '';
  isMobile = isMobile;
  private getText = getText;

  mounted() {
    tag = this;
    let state = store.getState();
    let data = state.profileData;
    this.walletAddress = data.wallet.address;

    $('#donateWalletAddress').val(this.walletAddress);
    $('#acceptWalletAddress').val(this.walletAddress);

    this.initializeWidgetCode('donate');
    this.initializeWidgetCode('accept');
  }

  initializeWidgetCode(type) {
    var domain =
      location.protocol +
      '//' +
      location.hostname +
      (location.port ? ':' + location.port : '');
    var code =
      '<script id="flashWidgetScript" type="text/javascript" src="' +
      domain +
      '/assets/widgets/donate.js"></script><div class="flash-donate-widget" data-language="{language}" data-text="{popupTitle}" data-width="{buttonWidth}" data-currency="FLASH" data-type="{type}" data-wallet="' +
      this.walletAddress +
      '"></div>';

    var lang = this.getLanguage();
    code = code.replace('{language}', lang);

    if (type == 'donate') this.initializeDonateCode(code);
    else this.initializeAcceptCode(code);
  }

  getLanguage() {
    var language = localStorage.getItem('id_lang');
    switch (language) {
      case 'chinese-simplified-v1.1':
        language = 'chinese';
        break;
      case 'japanese-v1.1':
        language = 'japanese';
        break;
      case 'korean-v1.1':
        language = 'korean';
        break;
      case 'portugese-v1.1':
        language = 'portugese';
        break;
      case 'spanish-v1.1':
        language = 'spanish';
        break;
      case 'urdu-v1.1':
        language = 'urdu';
        break;
      case 'en-v1.1':
      default:
        language = 'en';
        break;
    }
    return language;
  }

  initializeDonateCode(code) {
    var donateText = $('#donateText').val();
    var donateWidth = $('#donateWidth').val();

    var donateCode = code.replace(/{type}/g, 'donate');

    donateCode = donateCode.replace('{popupTitle}', donateText);
    donateCode = donateCode.replace('{buttonWidth}', donateWidth);

    $('#donate_widget_container').html(donateCode);
    $('#donate_widget_code').val(donateCode);
  }

  initializeAcceptCode(code) {
    var acceptText = $('#acceptText').val();
    var acceptWidth = $('#acceptWidth').val();

    var acceptCode = code.replace(/{type}/g, 'accept');

    acceptCode = acceptCode.replace('{popupTitle}', acceptText);
    acceptCode = acceptCode.replace('{buttonWidth}', acceptWidth);

    $('#accept_widget_container').html(acceptCode);
    $('#accept_widget_code').val(acceptCode);
  }

  onGenerateButtonClick(type) {
    this.initializeWidgetCode(type);
  }
  clearForms(type) {
    if (type == 'donate') $('#donateText').val('Donate FLASH');
    else $('#acceptText').val('Send FLASH');

    $('#' + type + 'Width').val(300);
    this.onGenerateButtonClick(type);
  }
}
