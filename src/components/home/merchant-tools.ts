import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeMerchantToolsTemplate from './merchant-tools.html!text';
import Constants from '../../model/constants';
import { CONTACTS, COMMON } from '../../model/action-types';
import { FCEvent } from '../../model/types';
import BaseElement from '../base-element';
import QRCode from 'QRCode';
import { isMobile } from '../../model/utils';
import domtoimage from 'tsayen/dom-to-image';import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeMerchantToolsTemplate from './merchant-tools.html!text';
import Constants from '../../model/constants';
import { CONTACTS, COMMON } from '../../model/action-types';
import { FCEvent } from '../../model/types';
import BaseElement from '../base-element';
import QRCode from 'QRCode';
import { isMobile } from '../../model/utils';
import html2canvas from 'html2canvas';


export const PAGE_SIZE = 10;
const ACTION_SEND = 0;
const ACTION_REQUEST = 1;

let tag = null;

@template(HomeMerchantToolsTemplate)
export default class HomeMerchantTools extends BaseElement {
  
  private static unsubscribe = null;

  private walletAddress = '';
  isMobile = isMobile;

  mounted() {
    tag = this;
    let state = store.getState();
    let data = state.profileData;
    this.walletAddress = data.wallet.address;
    
    let qrCode = new QRCode('dmq-merchant-qr', {width: 960, height: 960});
    qrCode.makeCode('flashcoin:' + this.walletAddress);
    $('#walletAddress').val(this.walletAddress);

    if(this.isMobile())
      var timeout = 3000;
    else
      var timeout = 1000;
    setTimeout(function() {
      tag.generateImage();
    }, timeout);
  }

  onGenerateButtonClick() {
    $('#dowload_merchant_qr .dmq-merchant-name').text($('#displayText').val());
    this.generateImage();
  }

  generateImage() {

    var options = {useCORS: true, width:2400, height: 3000, windowWidth: 2400, widnowHeight: 3000, scale:1};
    if (!this.isMobile()) {
      options.x = 600;
    }
    $('#dowload_merchant_qr').show();
    html2canvas(document.getElementById('dowload_merchant_qr'), options).then(function(canvas) {
      try {
        //document.body.appendChild(canvas);
        $('#dowload_merchant_qr').hide();
       var b64Data = canvas.toDataURL("image/png");
       $('#dmq-download-print-image').attr('src', b64Data);
      }
      catch (err) {
        $('#dowload_merchant_qr').hide();
        console.log(err);
      }
    });
  }

  onPrintButtonClick() {
    var Pagelink = "";
    var pwa = window.open(Pagelink, "_new");
    pwa.document.open();
    pwa.document.write(this.imagetoPrint($('#dmq-download-print-image').attr('src')));
    pwa.document.close();
  }

  imagetoPrint(source) {
    return "<html><head><script>function step1(){\n" +
        "setTimeout('step2()', 10);}\n" +
        "function step2(){window.print();window.close()}\n" +
        "</scri" + "pt><style>@page { size: auto;  margin: 0mm; }</style></head><body style='text-align:center' onload='step1()'>\n" +
        "<img width='100%' src='" + source + "' /></body></html>";
  }

  onDownloadButtonClick() {
    var link = document.createElement('a');
    link.download = 'merchant_image.png';
    link.href = $('#dmq-download-print-image').attr('src');
    link.target = '_blank';
    link.click();
  }

  clearForms() {
    $('#displayText').val('');
    this.onGenerateButtonClick();
  }


}

import html2canvas from 'html2canvas';


export const PAGE_SIZE = 10;
const ACTION_SEND = 0;
const ACTION_REQUEST = 1;

let tag = null;

@template(HomeMerchantToolsTemplate)
export default class HomeMerchantTools extends BaseElement {
  
  private static unsubscribe = null;

  private walletAddress = '';
  isMobile = isMobile;

  mounted() {
    tag = this;
    let state = store.getState();
    let data = state.profileData;
    this.walletAddress = data.wallet.address;
    
    let qrCode = new QRCode('dmq-merchant-qr', {width: 960, height: 960});
    qrCode.makeCode('flashcoin:' + this.walletAddress);
    $('#walletAddress').val(this.walletAddress);

    if(this.isMobile())
      var timeout = 3000;
    else
      var timeout = 1000;
    setTimeout(function() {
      tag.generateImage();
    }, timeout);
  }

  onGenerateButtonClick() {
    $('#dowload_merchant_qr .dmq-merchant-name').text($('#displayText').val());
    this.generateImage();
  }

  generateImage() {

    var options = {useCORS: true, width:2400, height: 3000, windowWidth: 2400, widnowHeight: 3000, scale:1};
    if (!this.isMobile()) {
      options.x = 600;
    }
    $('#dowload_merchant_qr').show();
    html2canvas(document.getElementById('dowload_merchant_qr'), options).then(function(canvas) {
      try {
        //document.body.appendChild(canvas);
        $('#dowload_merchant_qr').hide();
       var b64Data = canvas.toDataURL("image/png");
       $('#dmq-download-print-image').attr('src', b64Data);
      }
      catch (err) {
        $('#dowload_merchant_qr').hide();
        console.log(err);
      }
    });
  }

  onPrintButtonClick() {
    var Pagelink = "";
    var pwa = window.open(Pagelink, "_new");
    pwa.document.open();
    pwa.document.write(this.imagetoPrint($('#dmq-download-print-image').attr('src')));
    pwa.document.close();
  }

  imagetoPrint(source) {
    return "<html><head><script>function step1(){\n" +
        "setTimeout('step2()', 10);}\n" +
        "function step2(){window.print();window.close()}\n" +
        "</scri" + "pt><style>@page { size: auto;  margin: 0mm; }</style></head><body style='text-align:center' onload='step1()'>\n" +
        "<img width='100%' src='" + source + "' /></body></html>";
  }

  onDownloadButtonClick() {
    var link = document.createElement('a');
    link.download = 'merchant_image.png';
    link.href = $('#dmq-download-print-image').attr('src');
    link.target = '_blank';
    link.click();
  }

  clearForms() {
    $('#displayText').val('');
    this.onGenerateButtonClick();
  }
}