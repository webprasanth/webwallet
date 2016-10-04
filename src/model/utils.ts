import Big from 'big.js';

export function satoshiToFlash(num) {
  if(num == undefined || num === '') return;
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

