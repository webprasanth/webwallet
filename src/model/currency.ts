/**
 * add new currency here
 */
export const CURRENCY_TYPE = {
  FLASH: 1,
  BTC: 2,
};

export const CURRENCY_TYPE_UNIT = {
  1: 'Flash',
  2: 'BTC',
};

export const CURRENCY_TYPE_UNIT_UPCASE = {
  1: 'FLASH',
  2: 'BTC',
};

export function getCurrencyUnitUpcase(currency_type) {
  if(!currency_type)
	currency_type = localStorage.getItem('currency_type');
  return CURRENCY_TYPE_UNIT_UPCASE[currency_type];
}

export function getCurrencyUnit() {
  return CURRENCY_TYPE_UNIT[localStorage.getItem('currency_type')];
}