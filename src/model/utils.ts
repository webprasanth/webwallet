import Big from 'big.js';
import _tmp from 'moment-timezone';

export function satoshiToFlash(num) {
  if (num == undefined || num === '') return;
  return parseFloat(new Big(num).div(10000000).toString());
}

export function storeUserKey(userKey) {
  if (userKey && userKey.idToken && userKey.encryptedPrivKey && userKey.publicKey) {
    localStorage.setItem("scuserkeys", JSON.stringify(userKey));
  }
}

export function removeUserKey() {
  localStorage.removeItem('scuserkeys');
}

export function getUserKey() {
  var str = localStorage.getItem('scuserkeys');
  if (str && str.length > 0) {
    var userKey = JSON.parse(str);

    if (userKey && userKey.idToken && userKey.encryptedPrivKey && userKey.publicKey) {
      return userKey;
    }
  }
  return null;
}

export function calcFee(amount) {
  return 1;
}

export function formatCurrency(amount) {
  return `${amount} Flash`;
}

const MOMENT_FORMAT = {
    DATE: "MMM DD, YYYY",
    DATE_TIME: "MMM DD, YYYY hh:mm A",
    DATE_TIME_2: "MMM DD, YYYY hh:mm:ss A"
}

export function getDisplayDate(date, toTimeZone) {
    if (toTimeZone)
        return _tmp(date).tz(toTimeZone).format(MOMENT_FORMAT.DATE);
    return _tmp(date).local().format(MOMENT_FORMAT.DATE);
}

export function getDisplayDateTime(date, toTimeZone) {
    if (toTimeZone)
        return _tmp(date).tz(toTimeZone).format(MOMENT_FORMAT.DATE_TIME_2);
    return _tmp(date).local().format(MOMENT_FORMAT.DATE_TIME_2);
}

     

