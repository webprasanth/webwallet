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
  ARN: 22,
  AE: 23,
  AST: 24,
  AMB: 25,
  APPC: 26,
  // LINK: 27,
  CND: 28,
  DAI: 29,
  MANA: 30,
  DENT: 31,
  DCN: 32,
  // DGD: 33,
  DRGN: 34,
  ETHOS: 35,
  '1ST': 36,
  GVT: 37,
  ICN: 38,
  KIN: 39,
  // KCS: 40,
  LRC: 41,
  LUN: 42,
  MKR: 43,
  MDS: 44,
  MLN: 45,
  MTL: 46,
  // MITH: 47,
  PLR: 48,
  POE: 49,
  POWR: 50,
  QASH: 51,
  // QTUM: 52,
  QSP: 53,
  RDN: 54,
  // RHOC: 55,
  REQ: 56,
  R: 57,
  RVT: 58,
  SAN: 59,
  SNGLS: 60,
  STORM: 61,
  SUB: 62,
  TAAS: 63,
  TNB: 64,
  VERI: 65,
  VIB: 66,
  WTC: 67,
  WAX: 68,
  //  TRST: 69,
  BNB: 70,
  GNT: 71,
  PAY: 72,
  BAT: 73,
  ZRX: 74,
  ANT: 75,
  // REP: 76,
  BNT: 77,
  BRD: 78,
  CVC: 79,
  //DGB: 80,
  DNT: 81,
  FUN: 82,
  GNO: 83,
  RLC: 84,
  GUP: 85,
  MCO: 86,
  NMR: 87,
  POLY: 88,
  PPT: 89,
  RCN: 90,
  SALT: 91,
  SNT: 92,
  STORJ: 93,
  WINGS: 94,
  UTK: 95,
  ELF: 96,
};

export const ALL_COINS = {
  1: {
    name: 'Flash',
    code: 'FLASH',
    currency_type: 1,
    is_erc20: false,
    decimals: 10,
  },
  2: {
    name: 'Bitcoin',
    code: 'BTC',
    currency_type: 2,
    is_erc20: false,
    decimals: 8,
  },
  3: {
    name: 'Litecoin',
    code: 'LTC',
    currency_type: 3,
    is_erc20: false,
    decimals: 8,
  },
  4: {
    name: 'Dash',
    code: 'DASH',
    currency_type: 4,
    is_erc20: false,
    decimals: 8,
  },
  5: {
    name: 'Ethereum',
    code: 'ETH',
    currency_type: 5,
    is_erc20: false,
    decimals: 18,
  },
  6: {
    name: 'OmiseGO',
    code: 'OMG',
    currency_type: 6,
    is_erc20: true,
    decimals: 18,
  },
  // 21: {
  //   name: 'AdToken',
  //   code: 'ADT',
  //   currency_type: 21,
  //   is_erc20: true,
  //   decimals: 9,
  // },
  22: {
    name: 'Aeron',
    code: 'ARN',
    currency_type: 22,
    is_erc20: true,
    decimals: 8,
  },
  23: {
    name: 'Aeternity',
    code: 'AE',
    currency_type: 23,
    is_erc20: true,
    decimals: 18,
  },
  24: {
    name: 'AirSwap',
    code: 'AST',
    currency_type: 24,
    is_erc20: true,
    decimals: 4,
  },
  25: {
    name: 'Amber',
    code: 'AMB',
    currency_type: 25,
    is_erc20: true,
    decimals: 18,
  },
  26: {
    name: 'AppCoins',
    code: 'APPC',
    currency_type: 26,
    is_erc20: true,
    decimals: 18,
  },
  // 27: {
  //   name: 'ChainLink',
  //   code: 'LINK',
  //   currency_type: 27,
  //   is_erc20: true,
  //   decimals: 18,
  // },
  28: {
    name: 'Cindicator',
    code: 'CND',
    currency_type: 28,
    is_erc20: true,
    decimals: 18,
  },
  29: {
    name: 'Dai',
    code: 'DAI',
    currency_type: 29,
    is_erc20: true,
    decimals: 18,
  },
  30: {
    name: 'Decentraland',
    code: 'MANA',
    currency_type: 30,
    is_erc20: true,
    decimals: 18,
  },
  31: {
    name: 'Dent',
    code: 'DENT',
    currency_type: 31,
    is_erc20: true,
    decimals: 8,
  },
  32: {
    name: 'Dentacoin',
    code: 'DCN',
    currency_type: 32,
    is_erc20: true,
    decimals: 0,
  },
  // 33:
  // { name: 'DigixDAO',
  //   code: 'DGD',
  //   currency_type: 33,
  //   is_erc20: true,
  //   decimals: 9,
  // },
  34: {
    name: 'Dragonchain',
    code: 'DRGN',
    currency_type: 34,
    is_erc20: true,
    decimals: 18,
  },
  35: {
    name: 'Ethos',
    code: 'ETHOS',
    currency_type: 35,
    is_erc20: true,
    decimals: 8,
  },
  36: {
    name: 'FirstBlood',
    code: '1ST',
    currency_type: 36,
    is_erc20: true,
    decimals: 18,
  },
  37: {
    name: 'Genesis Vision',
    code: 'GVT',
    currency_type: 37,
    is_erc20: true,
    decimals: 18,
  },
  38: {
    name: 'Iconomi',
    code: 'ICN',
    currency_type: 38,
    is_erc20: true,
    decimals: 18,
  },
  39: {
    name: 'Kin',
    code: 'KIN',
    currency_type: 39,
    is_erc20: true,
    decimals: 18,
  },
  // 40: {
  //   name: 'KuCoin Shares',
  //   code: 'KCS',
  //   currency_type: 40,
  //   is_erc20: true,
  //   decimals: 6,
  // },
  41: {
    name: 'Loopring',
    code: 'LRC',
    currency_type: 41,
    is_erc20: true,
    decimals: 18,
  },
  42: {
    name: 'Lunyr',
    code: 'LUN',
    currency_type: 42,
    is_erc20: true,
    decimals: 18,
  },
  43: {
    name: 'Maker',
    code: 'MKR',
    currency_type: 43,
    is_erc20: true,
    decimals: 18,
  },
  44: {
    name: 'MediShares',
    code: 'MDS',
    currency_type: 44,
    is_erc20: true,
    decimals: 18,
  },
  45: {
    name: 'Melon',
    code: 'MLN',
    currency_type: 45,
    is_erc20: true,
    decimals: 18,
  },
  46: {
    name: 'Metal',
    code: 'MTL',
    currency_type: 46,
    is_erc20: true,
    decimals: 8,
  },
  // 47: {
  //   name: 'Mithril',
  //   code: 'MITH',
  //   currency_type: 47,
  //   is_erc20: true,
  //   decimals: 18,
  // },
  48: {
    name: 'Pillar',
    code: 'PLR',
    currency_type: 48,
    is_erc20: true,
    decimals: 18,
  },
  49: {
    name: 'Po.et',
    code: 'POE',
    currency_type: 49,
    is_erc20: true,
    decimals: 8,
  },
  50: {
    name: 'Power Ledger',
    code: 'POWR',
    currency_type: 50,
    is_erc20: true,
    decimals: 6,
  },
  51: {
    name: 'Qash',
    code: 'QASH',
    currency_type: 51,
    is_erc20: true,
    decimals: 6,
  },
  // 52: {
  //   name: 'Qtum',
  //   code: 'QTUM',
  //   currency_type: 52,
  //   is_erc20: true,
  //   decimals: 18,
  // },
  53: {
    name: 'Quantstamp',
    code: 'QSP',
    currency_type: 53,
    is_erc20: true,
    decimals: 18,
  },
  54: {
    name: 'Raiden',
    code: 'RDN',
    currency_type: 54,
    is_erc20: true,
    decimals: 18,
  },
  // 55: {
  //   name: 'RChain',
  //   code: 'RHOC',
  //   currency_type: 55,
  //   is_erc20: true,
  //   decimals: 8,
  // },
  56: {
    name: 'Request',
    code: 'REQ',
    currency_type: 56,
    is_erc20: true,
    decimals: 18,
  },
  57: {
    name: 'Revain',
    code: 'R',
    currency_type: 57,
    is_erc20: true,
    decimals: 0,
  },
  58: {
    name: 'Rivetz',
    code: 'RVT',
    currency_type: 58,
    is_erc20: true,
    decimals: 18,
  },
  59: {
    name: 'Santiment',
    code: 'SAN',
    currency_type: 59,
    is_erc20: true,
    decimals: 18,
  },
  60: {
    name: 'SingularDTV',
    code: 'SNGLS',
    currency_type: 60,
    is_erc20: true,
    decimals: 0,
  },
  61: {
    name: 'Storm',
    code: 'STORM',
    currency_type: 61,
    is_erc20: true,
    decimals: 18,
  },
  62: {
    name: 'Substratum',
    code: 'SUB',
    currency_type: 62,
    is_erc20: true,
    decimals: 2,
  },
  63: {
    name: 'TaaS',
    code: 'TAAS',
    currency_type: 63,
    is_erc20: true,
    decimals: 6,
  },
  64: {
    name: 'Time New Bank',
    code: 'TNB',
    currency_type: 64,
    is_erc20: true,
    decimals: 18,
  },
  65: {
    name: 'Veritaseum',
    code: 'VERI',
    currency_type: 65,
    is_erc20: true,
    decimals: 18,
  },
  66: {
    name: 'Viberate',
    code: 'VIB',
    currency_type: 66,
    is_erc20: true,
    decimals: 18,
  },
  67: {
    name: 'Waltonchain',
    code: 'WTC',
    currency_type: 67,
    is_erc20: true,
    decimals: 18,
  },
  68: {
    name: 'Wax',
    code: 'WAX',
    currency_type: 68,
    is_erc20: true,
    decimals: 8,
  },
  // 69: {
  //   name: 'WeTrust',
  //   code: 'TRST',
  //   currency_type: 69,
  //   is_erc20: true,
  //   decimals: 6,
  // },
  70: {
    name: 'Binance',
    code: 'BNB',
    currency_type: 70,
    is_erc20: true,
    decimals: 18,
  },
  71: {
    name: 'Golem',
    code: 'GNT',
    currency_type: 71,
    is_erc20: true,
    decimals: 18,
  },
  72: {
    name: 'TenX',
    code: 'PAY',
    currency_type: 72,
    is_erc20: true,
    decimals: 18,
  },
  73: {
    name: 'BAT',
    code: 'BAT',
    currency_type: 73,
    is_erc20: true,
    decimals: 18,
  },
  74: {
    name: '0x',
    code: 'ZRX',
    currency_type: 74,
    is_erc20: true,
    decimals: 18,
  },
  75: {
    name: 'Aragon',
    code: 'ANT',
    currency_type: 75,
    is_erc20: true,
    decimals: 18,
  },
  // 76: {
  //   name: 'Reputation',
  //   code: 'REP',
  //   currency_type: 76,
  //   is_erc20: true,
  //   decimals: 18,
  // },
  77: {
    name: 'Bancor',
    code: 'BNT',
    currency_type: 77,
    is_erc20: true,
    decimals: 18,
  },
  78: {
    name: 'Bread',
    code: 'BRD',
    currency_type: 78,
    is_erc20: true,
    decimals: 18,
  },
  79: {
    name: 'Civic',
    code: 'CVC',
    currency_type: 79,
    is_erc20: true,
    decimals: 8,
  },
  // 80: {
  //   name: 'DigiByte',
  //   code: 'DGB',
  //   currency_type: 80,
  //   is_erc20: true,
  //   decimals: 18,
  // },
  81: {
    name: 'District0x',
    code: 'DNT',
    currency_type: 81,
    is_erc20: true,
    decimals: 18,
  },
  82: {
    name: 'FunFair',
    code: 'FUN',
    currency_type: 82,
    is_erc20: true,
    decimals: 8,
  },
  83: {
    name: 'Gnosis',
    code: 'GNO',
    currency_type: 83,
    is_erc20: true,
    decimals: 18,
  },
  84: {
    name: 'iExec',
    code: 'RLC',
    currency_type: 84,
    is_erc20: true,
    decimals: 9,
  },
  85: {
    name: 'Guppy',
    code: 'GUP',
    currency_type: 85,
    is_erc20: true,
    decimals: 3,
  },
  86: {
    name: 'Monaco',
    code: 'MCO',
    currency_type: 86,
    is_erc20: true,
    decimals: 8,
  },
  87: {
    name: 'Numeraire',
    code: 'NMR',
    currency_type: 87,
    is_erc20: true,
    decimals: 18,
  },
  88: {
    name: 'Polymath',
    code: 'POLY',
    currency_type: 88,
    is_erc20: true,
    decimals: 18,
  },
  89: {
    name: 'Populous',
    code: 'PPT',
    currency_type: 89,
    is_erc20: true,
    decimals: 8,
  },
  90: {
    name: 'Ripio',
    code: 'RCN',
    currency_type: 90,
    is_erc20: true,
    decimals: 18,
  },
  91: {
    name: 'SALT',
    code: 'SALT',
    currency_type: 91,
    is_erc20: true,
    decimals: 8,
  },
  92: {
    name: 'StatusNetwork',
    code: 'SNT',
    currency_type: 92,
    is_erc20: true,
    decimals: 18,
  },
  93: {
    name: 'Storj',
    code: 'STORJ',
    currency_type: 93,
    is_erc20: true,
    decimals: 8,
  },
  94: {
    name: 'Wings',
    code: 'WINGS',
    currency_type: 94,
    is_erc20: true,
    decimals: 18,
  },
  95: {
    name: 'UTRUST',
    code: 'UTK',
    currency_type: 95,
    is_erc20: true,
    decimals: 18,
  },
  96: {
    name: 'Aelf',
    code: 'ELF',
    currency_type: 96,
    is_erc20: true,
    decimals: 18,
  },
};

export const CURRENCY_TYPE_UNIT = {
  1: 'Flash',
  2: 'BTC',
  3: 'LTC',
  4: 'DASH',
  5: 'ETH',
  6: 'OMG',
  // 21: 'ADT',
  22: 'ARN',
  23: 'AE',
  24: 'AST',
  25: 'AMB',
  26: 'APPC',
  // 27: 'LINK',
  28: 'CND',
  29: 'DAI',
  30: 'MANA',
  31: 'DENT',
  32: 'DCN',
  //33: 'DGD',
  34: 'DRGN',
  35: 'ETHOS',
  36: '1ST',
  37: 'GVT',
  38: 'ICN',
  39: 'KIN',
  // 40: 'KCS',
  41: 'LRC',
  42: 'LUN',
  43: 'MKR',
  44: 'MDS',
  45: 'MLN',
  46: 'MTL',
  //47: 'MITH',
  48: 'PLR',
  49: 'POE',
  50: 'POWR',
  51: 'QASH',
  //52: 'QTUM',
  53: 'QSP',
  54: 'RDN',
  //55: 'RHOC',
  56: 'REQ',
  57: 'R',
  58: 'RVT',
  59: 'SAN',
  60: 'SNGLS',
  61: 'STORM',
  62: 'SUB',
  63: 'TAAS',
  64: 'TNB',
  65: 'VERI',
  66: 'VIB',
  67: 'WTC',
  68: 'WAX',
  // 69: 'TRST',
  70: 'BNB',
  71: 'GNT',
  72: 'PAY',
  73: 'BAT',
  74: 'ZRX',
  75: 'ANT',
  // 76: 'REP',
  77: 'BNT',
  78: 'BRD',
  79: 'CVC',
  // 80: 'DGB',
  81: 'DNT',
  82: 'FUN',
  83: 'GNO',
  84: 'RLC',
  85: 'GUP',
  86: 'MCO',
  87: 'NMR',
  88: 'POLY',
  89: 'PPT',
  90: 'RCN',
  91: 'SALT',
  92: 'SNT',
  93: 'STORJ',
  94: 'WINGS',
  95: 'UTK',
  96: 'ELF',
};

export const CURRENCY_TYPE_UNIT_UPCASE = {
  1: 'FLASH',
  2: 'BTC',
  3: 'LTC',
  4: 'DASH',
  5: 'ETH',
  6: 'OMG',
  // 21: 'ADT',
  22: 'ARN',
  23: 'AE',
  24: 'AST',
  25: 'AMB',
  26: 'APPC',
  // 27: 'LINK',
  28: 'CND',
  29: 'DAI',
  30: 'MANA',
  31: 'DENT',
  32: 'DCN',
  //33: 'DGD',
  34: 'DRGN',
  35: 'ETHOS',
  36: '1ST',
  37: 'GVT',
  38: 'ICN',
  39: 'KIN',
  // 40: 'KCS',
  41: 'LRC',
  42: 'LUN',
  43: 'MKR',
  44: 'MDS',
  45: 'MLN',
  46: 'MTL',
  //47: 'MITH',
  48: 'PLR',
  49: 'POE',
  50: 'POWR',
  51: 'QASH',
  //52: 'QTUM',
  53: 'QSP',
  54: 'RDN',
  //55: 'RHOC',
  56: 'REQ',
  57: 'R',
  58: 'RVT',
  59: 'SAN',
  60: 'SNGLS',
  61: 'STORM',
  62: 'SUB',
  63: 'TAAS',
  64: 'TNB',
  65: 'VERI',
  66: 'VIB',
  67: 'WTC',
  68: 'WAX',
  // 69: 'TRST',
  70: 'BNB',
  71: 'GNT',
  72: 'PAY',
  73: 'BAT',
  74: 'ZRX',
  75: 'ANT',
  // 76: 'REP',
  77: 'BNT',
  78: 'BRD',
  79: 'CVC',
  // 80: 'DGB',
  81: 'DNT',
  82: 'FUN',
  83: 'GNO',
  84: 'RLC',
  85: 'GUP',
  86: 'MCO',
  87: 'NMR',
  88: 'POLY',
  89: 'PPT',
  90: 'RCN',
  91: 'SALT',
  92: 'SNT',
  93: 'STORJ',
  94: 'WINGS',
  95: 'UTK',
  96: 'ELF',
};

export const CURRENCY_ICON_URL = {
  1: 'assets/images/flash-icon.png',
  2: 'assets/images/btc-icon.png',
  3: 'assets/images/ltc-icon.png',
  4: 'assets/images/dash-icon.png',
  5: 'assets/images/eth-icon.png',
  6: 'assets/images/omg-icon.png',

  // 21: 'assets/images/currency/adt-icon.png',
  22: 'assets/images/currency/arn-icon.png',
  23: 'assets/images/currency/ae-icon.png',
  24: 'assets/images/currency/ast-icon.png',
  25: 'assets/images/currency/amb-icon.png',
  26: 'assets/images/currency/appc-icon.png',
  // 27: 'assets/images/currency/link-icon.png',
  28: 'assets/images/currency/cnd-icon.png',
  29: 'assets/images/currency/dai-icon.png',
  30: 'assets/images/currency/mana-icon.png',
  31: 'assets/images/currency/dent-icon.png',
  32: 'assets/images/currency/dcn-icon.png',
  // 33: 'assets/images/currency/dgd-icon.png',
  34: 'assets/images/currency/drgn-icon.png',
  35: 'assets/images/currency/ethos-icon.png',
  36: 'assets/images/currency/1st-icon.png',
  37: 'assets/images/currency/gvt-icon.png',
  38: 'assets/images/currency/icn-icon.png',
  39: 'assets/images/currency/kin-icon.png',
  // 40: 'assets/images/currency/kcs-icon.png',
  41: 'assets/images/currency/lrc-icon.png',
  42: 'assets/images/currency/lun-icon.png',
  43: 'assets/images/currency/mkr-icon.png',
  44: 'assets/images/currency/mds-icon.png',
  45: 'assets/images/currency/mln-icon.png',
  46: 'assets/images/currency/mtl-icon.png',
  // 47: 'assets/images/currency/mith-icon.png',
  48: 'assets/images/currency/plr-icon.png',
  49: 'assets/images/currency/poe-icon.png',
  50: 'assets/images/currency/powr-icon.png',
  51: 'assets/images/currency/qash-icon.png',
  // 52: 'assets/images/currency/qtum-icon.png',
  53: 'assets/images/currency/qsp-icon.png',
  54: 'assets/images/currency/rdn-icon.png',
  // 55: 'assets/images/currency/rhoc-icon.png',
  56: 'assets/images/currency/req-icon.png',
  57: 'assets/images/currency/r-icon.png',
  58: 'assets/images/currency/rvt-icon.png',
  59: 'assets/images/currency/san-icon.png',
  60: 'assets/images/currency/sngls-icon.png',
  61: 'assets/images/currency/storm-icon.png',
  62: 'assets/images/currency/sub-icon.png',
  63: 'assets/images/currency/taas-icon.png',
  64: 'assets/images/currency/tnb-icon.png',
  65: 'assets/images/currency/veri-icon.png',
  66: 'assets/images/currency/vib-icon.png',
  67: 'assets/images/currency/wtc-icon.png',
  68: 'assets/images/currency/wax-icon.png',
  // 69: 'assets/images/currency/trst-icon.png',
  70: 'assets/images/currency/bnb-icon.png',
  71: 'assets/images/currency/gnt-icon.png',
  72: 'assets/images/currency/pay-icon.png',
  73: 'assets/images/currency/bat-icon.png',
  74: 'assets/images/currency/zrx-icon.png',
  75: 'assets/images/currency/ant-icon.png',
  // 76: 'assets/images/currency/rep-icon.png',
  77: 'assets/images/currency/bnt-icon.png',
  78: 'assets/images/currency/brd-icon.png',
  79: 'assets/images/currency/cvc-icon.png',
  // 80: 'assets/images/currency/dgb-icon.png',
  81: 'assets/images/currency/dnt-icon.png',
  82: 'assets/images/currency/fun-icon.png',
  83: 'assets/images/currency/gno-icon.png',
  84: 'assets/images/currency/rlc-icon.png',
  85: 'assets/images/currency/gup-icon.png',
  86: 'assets/images/currency/mco-icon.png',
  87: 'assets/images/currency/nmr-icon.png',
  88: 'assets/images/currency/poly-icon.png',
  89: 'assets/images/currency/ppt-icon.png',
  90: 'assets/images/currency/rcn-icon.png',
  91: 'assets/images/currency/salt-icon.png',
  92: 'assets/images/currency/snt-icon.png',
  93: 'assets/images/currency/storj-icon.png',
  94: 'assets/images/currency/wings-icon.png',
  95: 'assets/images/currency/utk-icon.png',
  96: 'assets/images/currency/elf-icon.png',
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
