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

    let qrCode = new QRCode('dmq_merchant_stickers_1', {width: 600 , height: 600});
    qrCode.makeCode('flashcoin:' + this.walletAddress);

    let qrCode2 = new QRCode('dmq_merchant_stickers_2', {width: 400 , height: 400});
    qrCode2.makeCode('flashcoin:' + this.walletAddress);
    $('#walletAddress_sticker').val(this.walletAddress);

    if(this.isMobile())
      var timeout = 5000;
    else
      var timeout = 3000;
    setTimeout(function() {
      tag.generateImage('download_merchant_stickers_1', 2400, 1420);
      tag.generateImage('download_merchant_stickers_2', 2400, 590);
    }, timeout);
  }

  onGenerateButtonClick() {
    this.generateImage('download_merchant_stickers_1', 2400, 1420);
    this.generateImage('download_merchant_stickers_2', 2400, 590);
  }

  generateImage(templateid, width=2400, height=3000) {

    var options = {useCORS: true, width:width, height: height, windowWidth: width, widnowHeight: height, scale:1};
    options.x = 600;
    if (this.isMobile()) {
      if(templateid == 'download_merchant_stickers_1')
        options.y = 1600;
      else if (templateid == 'download_merchant_stickers_2')
        options.y = 3630;
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
    pwa.document.write(this.imagetoPrint($('#download_merchant_'+stickerid+'-image').attr('src')));
    pwa.document.close();
  }

  imagetoPrint(source) {
    return "<html><head><script>function step1(){\n" +
        "setTimeout('step2()', 10);}\n" +
        "function step2(){window.print();window.close()}\n" +
        "</scri" + "pt><style>@page { size: auto;  margin: 0mm; }</style></head><body style='text-align:center' onload='step1()'>\n" +
        "<img width='100%' src='" + source + "' /></body></html>";
  }

  onDownloadStickersClick(stickerid) {
    var link = document.createElement('a');
    link.download = 'merchant_image.png';
    link.href = $('#download_merchant_'+stickerid+'-image').attr('src');
    link.target = '_blank';
    link.click();
  }

}