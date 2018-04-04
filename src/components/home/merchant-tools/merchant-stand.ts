/**
 * Merchant Stand
 */
import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import Constants from '../../../model/constants';
import MerchantStandTemplate from './merchant-stand.html!text';
import QRCode from 'QRCode';
import { isMobile, isAndroid } from '../../../model/utils';
import html2canvas from 'html2canvas';
import { getText } from '../../localise';

let tag = null;
@template(MerchantStandTemplate)
export default class MerchantStand extends Element {
  private walletAddress = '';
  isMobile = isMobile;
  isAndroid = isAndroid;
  private getText = getText;

  mounted() {
    tag = this;
    let state = store.getState();
    let data = state.profileData;
    this.walletAddress = data.wallet.address;

    let qrCode = new QRCode('dmq-merchant-qr', { width: 960, height: 960 });
    qrCode.makeCode('flashcoin:' + this.walletAddress);
    $('#walletAddress').val(this.walletAddress);
    $('#download_merchant_qr #wallet_address_footer').text(this.walletAddress);

    if (this.isMobile()) var timeout = 3000;
    else var timeout = 1000;
    setTimeout(function() {
      tag.generateImage();
    }, timeout);
  }

  onGenerateButtonClick() {
    $('#download_merchant_qr .dmq-merchant-name').text($('#displayText').val());
    this.generateImage();
  }

  generateImage() {
    var options = {
      useCORS: true,
      async: false,
      width: 2400,
      height: 3000,
      windowWidth: 2400,
      widnowHeight: 3000,
      scale: 1,
      logging: false,
    };
    if (!this.isMobile() || this.isAndroid()) {
      options.x = 600;
    }

    $('#download_merchant_qr').show();
    html2canvas(document.getElementById('download_merchant_qr'), options).then(
      function(canvas) {
        try {
          //document.body.appendChild(canvas);
          $('#download_merchant_qr').hide();
          var b64Data = canvas.toDataURL('image/png');
          $('#dmq-download-print-image').attr('src', b64Data);
        } catch (err) {
          $('#download_merchant_qr').hide();
          console.log(err);
        }
      }
    );
  }

  onPrintButtonClick() {
    var Pagelink = '';
    var pwa = window.open(Pagelink, '_new');
    pwa.document.open();
    pwa.document.write(
      this.imagetoPrint($('#dmq-download-print-image').attr('src'))
    );
    pwa.document.close();
  }

  imagetoPrint(source) {
    return (
      '<html><head><script>function step1(){\n' +
      "setTimeout('step2()', 10);}\n" +
      'function step2(){window.print();window.close()}\n' +
      '</scri' +
      "pt><style>@page { size: auto;  margin: 0mm; }</style></head><body style='text-align:center' onload='step1()'>\n" +
      "<img width='100%' src='" +
      source +
      "' /></body></html>"
    );
  }

  onDownloadButtonClick() {
    var link = document.getElementById('dmq-download-a-link');
    link.setAttribute('download', 'merchant_image.png');
    link.setAttribute('href', $('#dmq-download-print-image').attr('src'));
    link.click();
  }

  clearForms() {
    $('#displayText').val('');
    this.onGenerateButtonClick();
  }
}
