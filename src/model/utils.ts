import Big from 'big.js';
import _tmp from 'moment-timezone';

interface UserKey {
  idToken: string;
  encryptedPrivKey: string;
  publicKey: string;
}

const MOMENT_FORMAT = {
  DATE: "MMM DD, YYYY",
  DATE_TIME: "MMM DD, YYYY hh:mm A",
  DATE_TIME_2: "MMM DD, YYYY hh:mm:ss A"
}

declare class Buffer extends Object {
  constructor(arr?: any, encode?: any);
  toString(encode?: string);
}

export function satoshiToFlash(num) {
  if (num == undefined || num === '') return;
  return parseFloat(new Big(num).div(10000000).toString());
}

export function flashToSatoshi(num) {
  if (num == undefined || num === '') return;
  return parseInt(new Big(num).times(10000000).toString(), 10);
}

export function storeUserKey(userKey: UserKey) {
  if (userKey) {
    localStorage.setItem("scuserkeys", JSON.stringify(userKey));
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

export function calcFee(amount) {
  return 1;
}

export function formatCurrency(amount) {
  return `${amount} Flash`;
}

export function getDisplayDate(date, toTimeZone) {
  if (toTimeZone && _tmp.tz.zone(toTimeZone) != null)
    return _tmp(date).tz(toTimeZone).format(MOMENT_FORMAT.DATE);
  return _tmp(date).local().format(MOMENT_FORMAT.DATE);
}

export function getDisplayDateTime(date, toTimeZone) {
  if (toTimeZone && _tmp.tz.zone(toTimeZone) != null)
    return _tmp(date).tz(toTimeZone).format(MOMENT_FORMAT.DATE_TIME_2);
  return _tmp(date).local().format(MOMENT_FORMAT.DATE_TIME_2);
}

export function setLocation(location) {
  localStorage.setItem('location', JSON.stringify(location));
  this.location = location;
}

export function getLocation() {
  let str = localStorage.getItem('location');
  let location = null;
  if (str && str.length > 0) {
    location = JSON.parse(str);
  }
  return location;
}

export function b64DecodeUnicode(str: string) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export function hexToBase64(str: string) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

export function strFromUtf8Ab(ab) {
  return decodeURIComponent(escape(String.fromCharCode.apply(null, ab)));
}

export function decodeBase64(s) {
  if (typeof atob === 'undefined') {
    return new Uint8Array(Array.prototype.slice.call(new Buffer(s, 'base64'), 0));
  } else {
    var i, d = atob(s), b = new Uint8Array(d.length);
    for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
  }
}

export function encodeBase64(arr) {
  if (typeof btoa === 'undefined') {
    return (new Buffer(arr)).toString('base64');
  } else {
    var i, s = [], len = arr.length;
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
      return (s.substring(0, n) + '...');
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
