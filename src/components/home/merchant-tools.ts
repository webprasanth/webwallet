import { riot, template } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeMerchantToolsTemplate from './merchant-tools.html!text';
import Constants from '../../model/constants';
import { TABS, CONTACTS, COMMON } from '../../model/action-types';
import { FCEvent } from '../../model/types';
import BaseElement from '../base-element';
import QRCode from 'QRCode';
import { isMobile, getUrlParam } from '../../model/utils';
import html2canvas from 'html2canvas';

@template(HomeMerchantToolsTemplate)
export default class HomeMerchantTools extends BaseElement {

  private isMerchantStand = true;
  private isMerchantStickers = false;

  mounted() {
    this.mountComponents();
  }

  mountComponents() {
    riot.mount('#merchant-stand', 'merchant-stand', {});
    riot.mount('#merchant-stickers', 'merchant-stickers', {});
  }

  onTabSelect(tab) {
    if (tab == 'merchantStand') {
      this.isMerchantStand = true;
      this.isMerchantStickers = false;
    } else if (tab == 'merchantStickers') {
      this.isMerchantStand = false;
      this.isMerchantStickers = true;
    }
  }
}