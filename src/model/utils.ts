import Big from 'big.js';

export function satoshiToFlash(num) {
  //if(num == undefined || num === '') return;
  return parseFloat(new Big(num).div(10000000).toString());
}

