/**
 * add new currency here
 */

import { isEtherBasedCurrency } from './utils';

export const CURRENCY_TYPE = {
  FLASH: 1,
  BTC: 2,
  LTC: 3,
  DASH: 4,
  ETH: 5,
  OMG: 6,

  // ADT: 21,
  // ARN: 22,
  // AE: 23,
  // AST: 24,
  // AMB: 25,
  // APPC: 26,
  // LINK: 27,
  // CND: 28,
  // DAI: 29,
  // MANA: 30,
  // DENT: 31,
  // DCN: 32,
  // DGD: 33,
  // DRGN: 34,
  // ETHOS: 35,
  // ST: 36,
  // GVT: 37,
  // ICN: 38,
  // KIN: 39,
  // KCS: 40,
  // LRC: 41,
  // LUN: 42,
  // MKR: 43,
  // MDS: 44,
  // MLN: 45,
  // MTL: 46,
  // MITH: 47,
  // PLR: 48,
  // POE: 49,
  // POWR: 50,
  // QASH: 51,
  // QTUM: 52,
  // QSP: 53,
  // RDN: 54,
  // RHOC: 55,
  // REQ: 56,
  // R: 57,
  // RVT: 58,
  // SAN: 59,
  // SNGLS: 60,
  // STORM: 61,
  // SUB: 62,
  // TAAS: 63,
  // TNB: 64,
  // VERI: 65,
  // VIB: 66,
  // WTC: 67,
  // WAX: 68,
  // TRST: 69,
  BNB: 70,
  GNT: 71,
  PAY: 72,
  BAT: 73,
};

export const ALL_COINS = {
  1: {
    name: 'Flash',
    code: 'FLASH',
    currency_type: 1,
    is_erc20: false,
  },
  2: {
    name: 'Bitcoin',
    code: 'BTC',
    currency_type: 2,
    is_erc20: false,
  },
  3: {
    name: 'Litecoin',
    code: 'LTC',
    currency_type: 3,
    is_erc20: false,
  },
  4: {
    name: 'Dash',
    code: 'DASH',
    currency_type: 4,
    is_erc20: false,
  },
  5: {
    name: 'Ethereum',
    code: 'ETH',
    currency_type: 5,
    is_erc20: false,
  },
  6: {
    name: 'OmiseGO',
    code: 'OMG',
    currency_type: 6,
    is_erc20: true,
  },
  // 21: { 'name': 'AdToken',
  //   'code': 'ADT',
  //   'currency_type': 21,
  //   'is_erc20': true
  // },
  // 22: { 'name': 'Aeron',
  //   'code': 'ARN',
  //   'currency_type': 22,
  //   'is_erc20': true
  // },
  // 23: {
  //   name: 'Aeternity',
  //   code: 'AE',
  //   currency_type: 23,
  //   is_erc20: true,
  // },
  // 24: { 'name': 'AirSwap',
  //   'code': 'AST',
  //   'currency_type': 24,
  //   'is_erc20': true
  // },
  // 25: { 'name': 'Amber',
  //   'code': 'AMB',
  //   'currency_type': 25,
  //   'is_erc20': true
  // },
  // 26: { 'name': 'AppCoins',
  //   'code': 'APPC',
  //   'currency_type': 26,
  //   'is_erc20': true
  // },
  // 27: {
  //   name: 'ChainLink',
  //   code: 'LINK',
  //   currency_type: 27,
  //   is_erc20: true,
  // },
  // 28: { 'name': 'Cindicator',
  //   'code': 'CND',
  //   'currency_type': 28,
  //   'is_erc20': true
  // },
  // 29: { 'name': 'Dai',
  //   'code': 'DAI',
  //   'currency_type': 29,
  //   'is_erc20': true
  // },
  // 30: { 'name': 'Decentraland',
  //   'code': 'MANA',
  //   'currency_type': 30,
  //   'is_erc20': true
  // },
  // 31: { 'name': 'Dent',
  //   'code': 'DENT',
  //   'currency_type': 31,
  //   'is_erc20': true
  // },
  // 32: { 'name': 'Dentacoin',
  //   'code': 'DCN',
  //   'currency_type': 32,
  //   'is_erc20': true
  // },
  // 33: { 'name': 'DigixDAO',
  //   'code': 'DGD',
  //   'currency_type': 33,
  //   'is_erc20': true
  // },
  // 34: { 'name': 'Dragonchain',
  //   'code': 'DRGN',
  //   'currency_type': 34,
  //   'is_erc20': true
  // },
  // 35: { 'name': 'Ethos',
  //   'code': 'ETHOS',
  //   'currency_type': 35,
  //   'is_erc20': true
  // },
  // 36: { 'name': 'FirstBlood',
  //   'code': 'ST',
  //   'currency_type': 36,
  //   'is_erc20': true
  // },
  // 37: { 'name': 'Genesis Vision',
  //   'code': 'GVT',
  //   'currency_type': 37,
  //   'is_erc20': true
  // },
  // 38: { 'name': 'Iconomi',
  //   'code': 'ICN',
  //   'currency_type': 38,
  //   'is_erc20': true
  // },
  // 39: { 'name': 'Kin',
  //   'code': 'KIN',
  //   'currency_type': 39,
  //   'is_erc20': true
  // },
  // 40: { 'name': 'KuCoin Shares',
  //   'code': 'KCS',
  //   'currency_type': 40,
  //   'is_erc20': true
  // },
  // 41: { 'name': 'Loopring',
  //   'code': 'LRC',
  //   'currency_type': 41,
  //   'is_erc20': true
  // },
  // 42: { 'name': 'Lunyr',
  //   'code': 'LUN',
  //   'currency_type': 42,
  //   'is_erc20': true
  // },
  // 43: {
  //   name: 'Maker',
  //   code: 'MKR',
  //   currency_type: 43,
  //   is_erc20: true,
  // },
  // 44: { 'name': 'MediShares',
  //   'code': 'MDS',
  //   'currency_type': 44,
  //   'is_erc20': true
  // },
  // 45: { 'name': 'Melon',
  //   'code': 'MLN',
  //   'currency_type': 45,
  //   'is_erc20': true
  // },
  // 46: { 'name': 'Metal',
  //   'code': 'MTL',
  //   'currency_type': 46,
  //   'is_erc20': true
  // },
  // 47: { 'name': 'Mithril',
  //   'code': 'MITH',
  //   'currency_type': 47,
  //   'is_erc20': true
  // },
  // 48: { 'name': 'Pillar',
  //   'code': 'PLR',
  //   'currency_type': 48,
  //   'is_erc20': true
  // },
  // 49: { 'name': 'Po.et',
  //   'code': 'POE',
  //   'currency_type': 49,
  //   'is_erc20': true
  // },
  // 50: { 'name': 'Power Ledger',
  //   'code': 'POWR',
  //   'currency_type': 50,
  //   'is_erc20': true
  // },
  // 51: { 'name': 'Qash',
  //   'code': 'QASH',
  //   'currency_type': 51,
  //   'is_erc20': true
  // },
  // 52: { 'name': 'Qtum',
  //   'code': 'QTUM',
  //   'currency_type': 52,
  //   'is_erc20': true
  // },
  // 53: { 'name': 'Quantstamp',
  //   'code': 'QSP',
  //   'currency_type': 53,
  //   'is_erc20': true
  // },
  // 54: { 'name': 'Raiden',
  //   'code': 'RDN',
  //   'currency_type': 54,
  //   'is_erc20': true
  // },
  // 55: {
  //   name: 'RChain',
  //   code: 'RHOC',
  //   currency_type: 55,
  //   is_erc20: true,
  // },
  // 56: { 'name': 'Request',
  //   'code': 'REQ',
  //   'currency_type': 56,
  //   'is_erc20': true
  // },
  // 57: { 'name': 'Revain',
  //   'code': 'R',
  //   'currency_type': 57,
  //   'is_erc20': true
  // },
  // 58: { 'name': 'Rivetz',
  //   'code': 'RVT',
  //   'currency_type': 58,
  //   'is_erc20': true
  // },
  // 59: { 'name': 'Santiment',
  //   'code': 'SAN',
  //   'currency_type': 59,
  //   'is_erc20': true
  // },
  // 60: { 'name': 'SingularDTV',
  //   'code': 'SNGLS',
  //   'currency_type': 60,
  //   'is_erc20': true
  // },
  // 61: { 'name': 'Storm',
  //   'code': 'STORM',
  //   'currency_type': 61,
  //   'is_erc20': true
  // },
  // 62: { 'name': 'Substratum',
  //   'code': 'SUB',
  //   'currency_type': 62,
  //   'is_erc20': true
  // },
  // 63: { 'name': 'TaaS',
  //   'code': 'TAAS',
  //   'currency_type': 63,
  //   'is_erc20': true
  // },
  // 64: { 'name': 'Time New Bank',
  //   'code': 'TNB',
  //   'currency_type': 64,
  //   'is_erc20': true
  // },
  // 65: { 'name': 'Veritaseum',
  //   'code': 'VERI',
  //   'currency_type': 65,
  //   'is_erc20': true
  // },
  // 66: { 'name': 'Viberate',
  //   'code': 'VIB',
  //   'currency_type': 66,
  //   'is_erc20': true
  // },
  // 67: {
  //   name: 'Walton',
  //   code: 'WTC',
  //   currency_type: 67,
  //   is_erc20: true,
  // },
  // 68: { 'name': 'Wax',
  //   'code': 'WAX',
  //   'currency_type': 68,
  //   'is_erc20': true
  // },
  // 69: { 'name': 'WeTrust',
  //   'code': 'TRST',
  //   'currency_type': 69,
  //   'is_erc20': true
  // },
  70: {
    name: 'Binance',
    code: 'BNB',
    currency_type: 70,
    is_erc20: true,
  },
  71: {
    name: 'Golem',
    code: 'GNT',
    currency_type: 71,
    is_erc20: true,
  },
  72: {
    name: 'TenX',
    code: 'PAY',
    currency_type: 72,
    is_erc20: true,
  },
  73: {
    name: 'BAT',
    code: 'BAT',
    currency_type: 73,
    is_erc20: true,
  },
};

export const CURRENCY_TYPE_UNIT = {
  1: 'Flash',
  2: 'BTC',
  3: 'LTC',
  4: 'DASH',
  5: 'ETH',
  6: 'OMG',
  70: 'BNB',
  71: 'GNT',
  72: 'PAY',
  73: 'BAT',
};

export const CURRENCY_TYPE_UNIT_UPCASE = {
  1: 'FLASH',
  2: 'BTC',
  3: 'LTC',
  4: 'DASH',
  5: 'ETH',
  6: 'OMG',
  70: 'BNB',
  71: 'GNT',
  72: 'PAY',
  73: 'BAT',
};

export const CURRENCY_ICON_URL = {
  1: 'assets/images/flash-icon.png',
  2: 'assets/images/btc-icon.png',
  3: 'assets/images/ltc-icon.png',
  4: 'assets/images/dash-icon.png',
  5: 'assets/images/eth-icon.png',
  6: 'assets/images/omg-icon.png',

  // 21: 'assets/images/currency/adt-icon.png',
  // 22: 'assets/images/currency/arn-icon.png',
  // 23: 'assets/images/currency/ae-icon.png',
  // 24: 'assets/images/currency/ast-icon.png',
  // 25: 'assets/images/currency/amb-icon.png',
  // 26: 'assets/images/currency/appc-icon.png',
  // 27: 'assets/images/currency/link-icon.png',
  // 28: 'assets/images/currency/cnd-icon.png',
  // 29: 'assets/images/currency/dai-icon.png',
  // 30: 'assets/images/currency/mana-icon.png',
  // 31: 'assets/images/currency/dent-icon.png',
  // 32: 'assets/images/currency/dcn-icon.png',
  // 33: 'assets/images/currency/dgd-icon.png',
  // 34: 'assets/images/currency/drgn-icon.png',
  // 35: 'assets/images/currency/ethos-icon.png',
  // 36: 'assets/images/currency/st-icon.png',
  // 37: 'assets/images/currency/gvt-icon.png',
  // 38: 'assets/images/currency/icn-icon.png',
  // 39: 'assets/images/currency/kin-icon.png',
  // 40: 'assets/images/currency/kcs-icon.png',
  // 41: 'assets/images/currency/lrc-icon.png',
  // 42: 'assets/images/currency/lun-icon.png',
  // 43: 'assets/images/currency/mkr-icon.png',
  // 44: 'assets/images/currency/mds-icon.png',
  // 45: 'assets/images/currency/mln-icon.png',
  // 46: 'assets/images/currency/mtl-icon.png',
  // 47: 'assets/images/currency/mith-icon.png',
  // 48: 'assets/images/currency/plr-icon.png',
  // 49: 'assets/images/currency/poe-icon.png',
  // 50: 'assets/images/currency/powr-icon.png',
  // 51: 'assets/images/currency/qash-icon.png',
  // 52: 'assets/images/currency/qtum-icon.png',
  // 53: 'assets/images/currency/qsp-icon.png',
  // 54: 'assets/images/currency/rdn-icon.png',
  // 55: 'assets/images/currency/rhoc-icon.png',
  // 56: 'assets/images/currency/req-icon.png',
  // 57: 'assets/images/currency/r-icon.png',
  // 58: 'assets/images/currency/rvt-icon.png',
  // 59: 'assets/images/currency/san-icon.png',
  // 60: 'assets/images/currency/sngls-icon.png',
  // 61: 'assets/images/currency/storm-icon.png',
  // 62: 'assets/images/currency/sub-icon.png',
  // 63: 'assets/images/currency/taas-icon.png',
  // 64: 'assets/images/currency/tnb-icon.png',
  // 65: 'assets/images/currency/veri-icon.png',
  // 66: 'assets/images/currency/vib-icon.png',
  // 67: 'assets/images/currency/wtc-icon.png',
  // 68: 'assets/images/currency/wax-icon.png',
  // 69: 'assets/images/currency/trst-icon.png',
  70: 'assets/images/currency/bnb-icon.png',
  71: 'assets/images/currency/gnt-icon.png',
  72: 'assets/images/currency/pay-icon.png',
  73: 'assets/images/currency/bat-icon.png',
};

export function getCurrencyUnitUpcase(currency_type) {
  if (!currency_type) currency_type = localStorage.getItem('currency_type');
  return CURRENCY_TYPE_UNIT_UPCASE[currency_type];
}

export function getCurrencyUnitUpcaseForFee(currency_type) {
  if (!currency_type) currency_type = localStorage.getItem('currency_type');
  if (isEtherBasedCurrency(currency_type))
    return CURRENCY_TYPE_UNIT_UPCASE[CURRENCY_TYPE.ETH];
  else return CURRENCY_TYPE_UNIT_UPCASE[currency_type];
}

export function getCurrencyIconUrl(currency_type) {
  if (!currency_type) currency_type = localStorage.getItem('currency_type');
  return CURRENCY_ICON_URL[currency_type];
}

export function getCurrencyUnit() {
  return CURRENCY_TYPE_UNIT[localStorage.getItem('currency_type')];
}

export function getCurrencyUnitForFee() {
  var currency_type = localStorage.getItem('currency_type');
  if (isEtherBasedCurrency(currency_type))
    return CURRENCY_TYPE_UNIT[CURRENCY_TYPE.ETH];
  else return CURRENCY_TYPE_UNIT[currency_type];
}
