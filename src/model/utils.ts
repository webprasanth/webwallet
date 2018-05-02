import Big from 'big.js';
import _tmp from 'moment-timezone';
import bitcoin from 'bitcoinjs-lib';
import moment from 'moment-timezone';
import Wallet from './wallet';
import Premium from 'Premium';
import nacl from 'tweetnacl';
import { getText } from '../components/localise';

import { Address, NETWORKS } from './wallet';
import { CURRENCY_TYPE } from './currency';
import { APP_MODE } from './app-service';

interface UserKey {
  idToken: string;
  encryptedPrivKey: string;
  publicKey: string;
}

const MOMENT_FORMAT = {
  DATE: 'MMM DD, YYYY',
  DATE_TIME: 'MMM DD, YYYY hh:mm A',
  DATE_TIME_2: 'MMM DD, YYYY hh:mm:ss A',
};

declare class Buffer extends Object {
  constructor(arr?: any, encode?: any);
  toString(encode?: string);
}

export function getUrlParam(name) {
  var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(
    window.location.href
  );

  if (results == null) {
    return null;
  } else {
    return results[1] || 0;
  }
}

export function decryptPassphraseV2(email, wallets, password) {
  let userKey = getUserKey();
  let nonce = 'nnfyPFFbK7NdGtf73uGwt+CsS6mHAmAq';
  let casPubKey = 'vjPu6e8nhoxfLNxmNzNxXYr++1onlC1XuAt3VdxLISQ=';
  let box = null;
  let originMessage = null;
  let privKeyHex = Premium.xaesDecrypt(password, userKey.encryptedPrivKey);
  let privKeyBase64 = hexToBase64(privKeyHex);

  let keyPair = nacl.box.keyPair.fromSecretKey(decodeBase64(privKeyBase64));

  if (!keyPair) {
    return;
  }

  let decryptedWallets = wallets.map(w => {
    box = decodeBase64(w.passphrase);
    originMessage = nacl.box.open(
      box,
      decodeBase64(nonce),
      decodeBase64(casPubKey),
      keyPair.secretKey
    );
    w.pure_passphrase = strFromUtf8Ab(originMessage);
    w.email = email;
    return new Wallet().openWallet(w);
  });

  return decryptedWallets;
}

export function utcDateToLocal(str) {
  return moment(str)
    .local()
    .format('MMM DD YYYY hh:mm A');
}

export function satoshiToFlash(num) {
  if (num == undefined || num === '') return;
  return parseFloat(new Big(num).div(10000000000).toString());
}

export function satoshiToBtc(num) {
  if (num == undefined || num === '') return;
  return parseFloat(new Big(num).div(100000000).toString());
}

export function litoshiToLtc(num) {
  if (num == undefined || num === '') return;
  return parseFloat(new Big(num).div(100000000).toString());
}

export function duffToDash(num) {
  if (num == undefined || num === '') return;
  return parseFloat(new Big(num).div(100000000).toString());
}

export function localizeFlash(num) {
  if (num == undefined || num === '') return;
  return parseFloat(num).toLocaleString('en', { maximumFractionDigits: 8 });
}
export function flashNFormatter(num, digits) {
  if (num == undefined || num === '') return 0.00;
  num = parseFloat(num);
  if(num <= 10000)
    return num.toLocaleString('en',{maximumFractionDigits:8});
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export function flashToSatoshi(num) {
  if (num == undefined || num === '') return;
  return parseInt(new Big(num).times(10000000000).toString(), 10);
}

export function storeIdToken(idToken: string) {
  if (idToken) {
    localStorage.setItem('fl-idtoken-2606', idToken);
  }
}

export function getIdToken() {
  return localStorage.getItem('fl-idtoken-2606');
}

export function removeIdToken() {
  localStorage.removeItem('fl-idtoken-2606');
}

export function storeUserKey(userKey: UserKey) {
  if (userKey) {
    localStorage.setItem('scuserkeys', JSON.stringify(userKey));
  }
}

export function removeUserKey() {
  localStorage.removeItem('scuserkeys');
}

export function getUserKey(): UserKey | any {
  let str = localStorage.getItem('scuserkeys');
  let userKey = null;
  if (str && str.length > 0) {
    userKey = JSON.parse(str);
  }
  return userKey;
}

export function calcFee(amount, bcMedianTxSize, fastestFee) {
  let currency_type = parseInt(localStorage.getItem('currency_type'));
  switch (currency_type) {
    case CURRENCY_TYPE.FLASH:
    default:
      return 0.001; // default fee for web-wallet transaction
      break;
    case CURRENCY_TYPE.BTC:
    console.log(bcMedianTxSize, fastestFee);
      let satoshis = bcMedianTxSize * fastestFee;
      console.log(satoshis);
      return satoshiToBtc(satoshis);
      break;
    case CURRENCY_TYPE.LTC:
      fastestFee = new Big(fastestFee).div(1024); //Converting fee rate in per byte
      console.log(bcMedianTxSize, fastestFee);
      let litoshis = bcMedianTxSize * fastestFee;
      console.log(litoshis);
      return litoshiToLtc(litoshis.toFixed(0));
      break;
    case CURRENCY_TYPE.DASH:
      fastestFee = new Big(fastestFee).div(1024); //Converting fee rate in per byte
      console.log(bcMedianTxSize, fastestFee);
      let duff = bcMedianTxSize * fastestFee;
      console.log(duff);
      return duffToDash(duff.toFixed(0));
      break;
  }
}

export function formatCurrency(amount) {
  let currency_type = parseInt(localStorage.getItem('currency_type'));
  switch (currency_type) {
    case CURRENCY_TYPE.FLASH:
    default:
      return `${amount} Flash`;
      break;
    case CURRENCY_TYPE.BTC: 
      return `${amount} BTC`;
      break;
    case CURRENCY_TYPE.LTC:
      return `${amount} LTC`;
      break;
    case CURRENCY_TYPE.DASH:
      return `${amount} DASH`;
      break;
  }
}

export function getDisplayDate(date, toTimeZone) {
  if (toTimeZone && _tmp.tz.zone(toTimeZone) != null)
    return _tmp(date)
      .tz(toTimeZone)
      .format(MOMENT_FORMAT.DATE);
  return _tmp(date)
    .local()
    .format(MOMENT_FORMAT.DATE);
}

export function getDisplayDateTime(date, toTimeZone) {
  if (toTimeZone && _tmp.tz.zone(toTimeZone) != null)
    return _tmp(date)
      .tz(toTimeZone)
      .format(MOMENT_FORMAT.DATE_TIME_2);
  return _tmp(date)
    .local()
    .format(MOMENT_FORMAT.DATE_TIME_2);
}

export function getLocation() {
  let str = localStorage.getItem('flc-location');
  let location = {};
  if (str && str.length > 0) {
    location = JSON.parse(str);
  }
  return location;
}

export function calcPasswordStreng(password: string): number {
  if (!password) {
    return;
  }

  // Initial strength
  let strength = 0;

  // If the password length is less than 6, return message.
  if (password.length < 6) {
    return strength;
  }

  // length is ok, lets continue.

  // If length is 8 characters or more, increase strength value
  if (password.length > 7) strength += 1;

  // If password contains both lower and uppercase characters, increase strength value
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;

  // If it has numbers and characters, increase strength value
  if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1;

  // If it has one special character, increase strength value
  if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

  // If it has two special characters, increase strength value
  if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/))
    strength += 1;

  return strength;
}

// Base64 to unicode string
export function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

export function hexToBase64(str: string) {
  return btoa(
    String.fromCharCode.apply(
      null,
      str
        .replace(/\r|\n/g, '')
        .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
        .replace(/ +$/, '')
        .split(' ')
    )
  );
}

export function base64ToHex(str: string) {
  for (
    var i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = [];
    i < bin.length;
    ++i
  ) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = '0' + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join('');
}

export function strFromUtf8Ab(ab) {
  return decodeURIComponent(escape(String.fromCharCode.apply(null, ab)));
}

export function decodeBase64(s) {
  if (typeof atob === 'undefined') {
    return new Uint8Array(
      Array.prototype.slice.call(new Buffer(s, 'base64'), 0)
    );
  } else {
    var i,
      d = atob(s),
      b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
  }
}

export function encodeBase64(arr) {
  if (typeof btoa === 'undefined') {
    return new Buffer(arr).toString('base64');
  } else {
    var i,
      s = [],
      len = arr.length;
    for (i = 0; i < len; i++) s.push(String.fromCharCode(arr[i]));
    return btoa(s.join(''));
  }
}

/**
 * Cut string s if s.length > n
 */
export function strimString(s, n) {
  if (s) {
    if (s.length > n) {
      return s.substring(0, n) + '...';
    } else {
      return s;
    }
  } else {
    return s;
  }
}

export function isValidEmail(email) {
  let emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  let checkEmail = email.toLowerCase().match(emailRegex);
  if (checkEmail === null) return false;
  return true;
}

export function isValidFlashAddress(value) {
  try {
    let address = Address.fromBase58Check(value);
    if (
      address.version === NETWORK.pubKeyHash ||
      address.version === NETWORK.scriptHash
    ) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export function isValidCryptoAddress(value) {
  try {
    let address = Address.fromBase58Check(value);
    var network;
    switch (parseInt(localStorage.getItem('currency_type'))) {
      case CURRENCY_TYPE.BTC:
        if (APP_MODE == 'PROD') {
          network = NETWORKS.BTC;
        }
        else
            network = NETWORKS.BTC_TESTNET;
        break;
      case CURRENCY_TYPE.LTC:
        if (APP_MODE == 'PROD') {
          network = NETWORKS.LTC;
        } else network = NETWORKS.LTC_TESTNET;
        break;
      case CURRENCY_TYPE.DASH:
        if (APP_MODE == 'PROD') {
          network = NETWORKS.DASH;
        } else network = NETWORKS.DASH_TESTNET;
        break;
      case CURRENCY_TYPE.FLASH:
      default:
        network = NETWORKS.FLASH;
        break;
    }
    if (
      address.version === network.pubKeyHash ||
      address.version === network.scriptHash
    ) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export function filterNumberEdit(event) {
  let keyCode = event.key;
  let isValidAmountCharCode =
    (parseInt(keyCode) >= 0 && parseInt(keyCode) <= 9) ||
    keyCode == 'Backspace' ||
    keyCode == 'Tab' ||
    keyCode == 'Delete' ||
    keyCode == '.';
  if (!isValidAmountCharCode) {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
  } else {
    event.returnValue = true;
  }
}

export function decimalFormat(number, n?, x?) {
  if (typeof number == 'undefined' || number == 'undefined') return '';
  //Converback to number format without comma
  number = toOrginalNumber(number);
  n = n || 1;

  let arr = number.toString().split('.');
  let max = 2;
  if (arr.length > 1 && arr[1].length > max) {
    max = arr[1].length;

    if (max > 8) {
      max = 8;
    }
  }

  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return toFixedFloor(parseFloat(number), Math.max(max, ~~n)).replace(
    new RegExp(re, 'g'),
    '$&,'
  );
}

function toFixedFloor(x, decimal) {
  var factor = Math.pow(10, decimal);
  var y = parseInt(new Big(x).times(factor));
  return (y / factor).toFixed(decimal);
}

export function toOrginalNumber(Decimalnumber = '') {
  return Number(Decimalnumber.toString().replace(/,/g, ''));
}

export function formatAmountInput(amount?) {
  if (isNaN(amount)) {
    amount = this.value;
    amount = toOrginalNumber(amount);
    if (!isNaN(amount) && amount > 0) {
      this.value = decimalFormat(amount, 1);
    }
  } else {
    amount = toOrginalNumber(amount);
    if (!isNaN(amount) && amount > 0) {
      return decimalFormat(amount, 1);
    }
  }
}

export function isDesktop() {
  return window.innerWidth > 766;
}

export function isMobile() {
  let isMobile = /Android.+Mobile|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return isMobile;
}

export function isAndroid() {
  let isAndroid = /Android.+Mobile/i.test(
    navigator.userAgent
  );
  return isAndroid;
}

export function getSecurityQuestion() {
  return {
    A: [
      getText('sc_question_a1'),
      getText('sc_question_a2'),
      getText('sc_question_a3'),
    ],
    B: [
      getText('sc_question_b1'),
      getText('sc_question_b2'),
      getText('sc_question_b3'),
    ],
    C: [
      getText('sc_question_c1'),
      getText('sc_question_c2'),
      getText('sc_question_c3'),
    ],
  };
}
