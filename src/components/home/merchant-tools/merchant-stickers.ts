/**
 * Merchant Sticker
 */
import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import Constants from '../../../model/constants';
import MerchantStickersTemplate from './merchant-stickers.html!text';
import QRCode from 'QRCode';
import { isMobile } from '../../../model/utils';
import html2canvas from 'html2canvas';
import { getText } from '../../localise';

let tag = null;

@template(MerchantStickersTemplate)
export default class MerchantStickers extends Element {
  
  private walletAddress = '';
  isMobile = isMobile;
  private getText = getText;

  mounted() {
    tag = this;
    let state = store.getState();
    let data = state.profileData;
    this.walletAddress = data.wallet.address;

    let qrCode = new QRCode('dmq_merchant_stickers_1', {width: 650 , height: 650});
    qrCode.makeCode('flashcoin:' + this.walletAddress);

    let qrCode2 = new QRCode('dmq_merchant_stickers_2', {width: 400 , height: 400});
    qrCode2.makeCode('flashcoin:' + this.walletAddress);

    let qrCode3 = new QRCode('dmq_merchant_stickers_3', {width: 500 , height: 500});
    qrCode3.makeCode('flashcoin:' + this.walletAddress);

    $('#walletAddress_sticker').val(this.walletAddress);

    if (tag.isMobile()) {
      var timeout = 5000;
    }
    else
      var timeout = 3000;

    setTimeout(function() {
      tag.onGenerateButtonClick();
    }, timeout);
    
  }

  onGenerateButtonClick() {
    this.generateImage('download_merchant_stickers_1', 2400, 1765);
    this.generateImage('download_merchant_stickers_2', 2400, 594);
    this.generateImage('download_merchant_stickers_3', 1300, 2400);
  }

  generateImage(templateid, width=2400, height=3000) {

    var options = {useCORS: true, async: false, width:width, height: height, windowWidth: width, widnowHeight: height, scale:1, logging:false};
    switch (templateid) {  
      case 'download_merchant_stickers_1':
      case 'download_merchant_stickers_2':
        options.x = 625;
        break;
      case 'download_merchant_stickers_3':
        options.x = 80;
        break;
    }
    if (this.isMobile()) {
      switch (templateid) {  
        case 'download_merchant_stickers_1':
          options.y = 1949;
          break;
        case 'download_merchant_stickers_2':
          options.y = 4213;
          break;
        case 'download_merchant_stickers_3':
          options.y = 5305;
          break;
      }
    }

    $('#'+templateid).show();
    html2canvas(document.getElementById(templateid), options).then(function(canvas) {
      try {
        //document.body.appendChild(canvas);
        $('#'+templateid).hide();
        var b64Data = canvas.toDataURL("image/png");
        $('#'+templateid+'-image').attr('src', b64Data);
      }
      catch (err) {
        $('#'+templateid).hide();
        console.log(err);
      }
    });
  }

  onPrintStickersClick(stickerid) {
    var Pagelink = "";
    var pwa = window.open(Pagelink, "_new");
    pwa.document.open();
    if(stickerid == 'stickers_3')
      var style = "height='1000px'";
    else
      var style="width='100%'";
    pwa.document.write(this.imagetoPrint($('#download_merchant_'+stickerid+'-image').attr('src'), style));
    pwa.document.close();
  }

  imagetoPrint(source, style) {
    return "<html><head><script>function step1(){\n" +
        "setTimeout('step2()', 10);}\n" +
        "function step2(){window.print();window.close()}\n" +
        "</scri" + "pt><style>@page { size: auto;  margin: 0mm; }</style></head><body style='text-align:center' onload='step1()'>\n" +
        "<img "+style+" src='" + source + "' /></body></html>";
  }

  onDownloadStickersClick(stickerid) {
    var link = document.createElement('a');
    link.download = 'merchant_image.png';
    link.href = $('#download_merchant_'+stickerid+'-image').attr('src');
    link.target = '_blank';
    link.click();
  }

}