import { storeUserKey, getUserKey } from './utils';
const HOST_URL = 'https://keys.flashcoin.io/';
export const APP_MODE = 'PROD'; //DEV, PROD

export default class AppService {
  private authVersion = 4;
  private sessionToken = '';
  private static _instance: AppService;

  constructor() {}

  static getInstance() {
    if (!AppService._instance) {
      AppService._instance = new AppService();
    }

    return AppService._instance;
  }

  uploadProfileImage(file, cb) {
    let options = this.makeUploadOption('profile/upload', file, cb);
    $.ajax(options);
  }

  getMessages(params, cb) {
    let options = this.makeRequestOption(
      'api/get-messages',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  transactionById(params, cb) {
    let options = this.makeRequestOption(
      'api/transaction-by-id',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  rosterAdd(params, cb) {
    let options = this.makeRequestOption('api/roster-add', params, 'post', cb);
    $.ajax(options);
  }

  markSentMoneyRequests(params, cb) {
    let options = this.makeRequestOption(
      'api/mark-sent-money-requests',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  addTransaction(params, cb) {
    let options = this.makeRequestOption(
      'api/add-transaction',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  addTransactionMulti(params, cb) {
    let options = this.makeRequestOption(
      'api/add-transaction-multi',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  rawTransaction(params, cb) {
    let options = this.makeRequestOption(
      'api/raw-transaction',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  rawTransactionMulti(params, cb) {
    let options = this.makeRequestOption(
      'api/raw-transaction-multi',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  rosterOperation(params, cb) {
    let options = this.makeRequestOption(
      'api/roster-operation',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  addMoneyRequest(params, cb) {
    let options = this.makeRequestOption(
      'api/add-money-request',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  sendVerificationSms(params, cb) {
    let options = this.makeRequestOption(
      'api/send-verification-sms',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  verifyPhone(params, cb) {
    let options = this.makeRequestOption(
      'api/verify-phone',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  myFountain(params, cb) {
    let options = this.makeRequestOption('api/my-fountain', params, 'get', cb);
    $.ajax(options);
  }

  disableFountain(params, cb) {
    let options = this.makeRequestOption(
      'api/disable-fountain',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  updateFountain(params, cb) {
    let options = this.makeRequestOption(
      'api/update-fountain',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  enableFountain(params, cb) {
    let options = this.makeRequestOption(
      'api/enable-fountain',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  confirm2faCode(params, cb) {
    let options = this.makeRequestOption(
      'api/confirm-2fa-code',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  turnOff2fa(params, cb) {
    let options = this.makeRequestOption(
      'api/turn-off-2fa',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  start2faCode(params, cb) {
    let options = this.makeRequestOption(
      'api/start-2fa-code',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  changePassword(params, cb) {
    let options = this.makeRequestOption(
      'api/change-password',
      params,
      'post',
      cb
    );
    options.headers.authorization = params.idToken;
    params.idToken = '';
    $.ajax(options);
  }

  getKeypair(params, cb) {
    let options = this.makeRequestOption('api/get-keypair', {}, 'get', cb);
    options.headers.authorization = params.idToken;
    $.ajax(options);
  }

  updateProfile(params, cb) {
    let options = this.makeRequestOption(
      'api/update-profile',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  markCancelledMoneyRequests(params, cb) {
    let options = this.makeRequestOption(
      'api/mark-cancelled-money-requests',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  markRejectedMoneyRequests(params, cb) {
    let options = this.makeRequestOption(
      'api/mark-rejected-money-requests',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getRequests(params, cb) {
    let options = this.makeRequestOption(
      'api/get-requests',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  rosterRemove(params, cb) {
    let options = this.makeRequestOption(
      'api/roster-remove',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getUsersByUid(params, cb) {
    let options = this.makeRequestOption(
      'api/get-users-by-uid',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getRoster(params, cb) {
    let options = this.makeRequestOption('api/get-roster', params, 'post', cb);
    $.ajax(options);
  }

  searchWallet(params, cb) {
    let options = this.makeRequestOption(
      'api/search-wallet',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getWalletsByEmail(params, cb) {
    let options = this.makeRequestOption(
      'api/get-wallets-by-email',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  balance(params, cb) {
    //alert('in app balance API services params is ' + params.currency_type);
    let options = this.makeRequestOption('api/balance', params, 'get', cb);
    $.ajax(options);
  }

  walletSecret(idToken, cb) {
    let options = this.makeRequestOption('api/wallet-secret', {}, 'get', cb);
    options.headers.authorization = idToken;
    $.ajax(options);
  }

  myWallets(params, cb) {
    let options = this.makeRequestOption('api/my-wallets', params, 'get', cb);
    $.ajax(options);
  }

  check2faCode(params, cb) {
    let self = this;
    let _cb = function(resp) {
      if (resp.rc == 1) {
        self.sessionToken = resp.profile.sessionToken;
      }
      cb(resp);
    };
    let options = this.makeRequestOption(
      'api/check-2fa-code',
      params,
      'post',
      _cb
    );
    $.ajax(options);
  }

  check2faCodeSendtxn(params, cb) {
    let self = this;
    let _cb = function(resp) {
      if (resp.rc == 1) {
        self.sessionToken = resp.profile.sessionToken;
      }
      cb(resp);
    };
    let options = this.makeRequestOption(
      'api/check-2fa-code',
      params,
      'post',
      _cb
    );
    $.ajax(options);
  }
  profile(params, cb) {
    let options = this.makeRequestOption('api/profile', params, 'get', cb);
    $.ajax(options);
  }

  login(params, cb) {
    let self = this;
    let _cb = function(resp) {
      if (resp.rc == 1) {
        self.setAuthInfo(resp.profile.auth_version, resp.profile.sessionToken);
        let userKey = {
          idToken: resp.profile.idToken,
          encryptedPrivKey: resp.profile.privateKey,
          publicKey: resp.profile.publicKey,
        };
        storeUserKey(userKey);
      }
      cb(resp);
    };
    let options = this.makeRequestOption('api/login', params, 'post', _cb);
    $.ajax(options);
  }

  session(params, cb) {
    let options = this.makeRequestOption('api/session', {}, 'post', cb);
    options.headers.authorization = params.idToken;
    $.ajax(options);
  }

  resetPassword(params, cb) {
    let options = this.makeRequestOption(
      'api/reset-password',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  resetPasswordMail(params, cb) {
    let options = this.makeRequestOption(
      'api/reset-password-mail',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getRecoveryKeys(params, cb) {
    let options = this.makeRequestOption(
      'api/getRecoveryKeys',
      params,
      'get',
      cb
    );
    options.headers.authorization = params.idToken;
    $.ajax(options);
  }

  enableAccount(params, cb) {
    let options = this.makeRequestOption(
      'api/enableAccount',
      params,
      'get',
      cb
    );
    options.headers.authorization = params.idToken;
    $.ajax(options);
  }

  createFlashWallet(params, cb) {
    let options = this.makeRequestOption(
      'api/createFlashWallet',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  createBTCWallet(params, cb) {
    let options = this.makeRequestOption(
      'api/createBtcWallet',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  createLTCWallet(params, cb) {
    let options = this.makeRequestOption(
      'api/createLtcWallet',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  createDASHWallet(params, cb) {
    let options = this.makeRequestOption(
      'api/createDashWallet',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  createETHWallet(params, cb) {
    let options = this.makeRequestOption(
      'api/createEthWallet',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  setRecoveryKeys(params, cb) {
    let options = this.makeRequestOption(
      'api/setRecoveryKeys',
      params,
      'post',
      cb
    );
    options.headers.authorization = params.idToken;
    $.ajax(options);
  }

  setPassword(params, cb) {
    let self = this;
    let _cb = function(resp) {
      if (resp.rc == 1) {
        self.setAuthInfo(resp.profile.auth_version, resp.profile.sessionToken);
      }
      cb(resp);
    };
    let options = this.makeRequestOption(
      'api/setPassword',
      params,
      'post',
      _cb
    );
    $.ajax(options);
  }

  migrateAccount(params, cb) {
    let self = this;
    let _cb = function(resp) {
      if (resp.rc == 1) {
        self.setAuthInfo(resp.profile.auth_version, resp.profile.sessionToken);
      }
      cb(resp);
    };
    let options = this.makeRequestOption(
      'api/migrateAccountV1ToV2',
      params,
      'post',
      _cb
    );
    $.ajax(options);
  }

  migrateFlashWallet(params, cb) {
    let options = this.makeRequestOption(
      'api/migrateFlashWallet',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  createEasy(params, cb) {
    let options = this.makeRequestOption('api/createEasy', params, 'post', cb);
    $.ajax(options);
  }

  getTransactions(params, cb) {
    let options = this.makeRequestOption(
      'api/get-transactions',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getTransactionDetail(params, cb) {
    let options = this.makeRequestOption(
      'api/transaction-detail',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  getSharingTransactionDetail(params, cb) {
    let options = this.makeRequestOption(
      'api/sharing-transaction-detail',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  getBCMedianTxSize(params, cb) {
    let options = this.makeRequestOption(
      'api/bc-median-tx-size',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  getThresHoldAmount(params, cb) {
    let options = this.makeRequestOption(
      'api/threshold-amount',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  getBTCSatoshiPerByte(cb) {
    let options = {
      url: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
      type: 'get',
      contentType: 'application/json',
      success: cb,
    };
    $.ajax(options);
  }

  getLTCSatoshiPerByte(cb) {
    let options = {
      url: 'https://api.blockcypher.com/v1/ltc/main',
      type: 'get',
      contentType: 'application/json',
      success: cb,
    };
    $.ajax(options);
  }

  getDASHSatoshiPerByte(cb) {
    let options = {
      url: 'https://api.blockcypher.com/v1/dash/main',
      type: 'get',
      contentType: 'application/json',
      success: cb,
    };
    $.ajax(options);
  }

  getFixedTransactionFee(params, cb) {
    let options = this.makeRequestOption(
      'api/fixed-txn-fee',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  getEtherGasValues(params, cb) {
    let options = this.makeRequestOption('api/gas-values', params, 'get', cb);
    $.ajax(options);
  }

  getEthTransactionCount(params, cb) {
    let options = this.makeRequestOption(
      'api/eth-txn-count',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  getContractTransferData(params, cb) {
    let options = this.makeRequestOption(
      'api/get-contract-transfer-data',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getPayoutInfo(cb) {
    let options = this.makeRequestOption('api/get-payout-info', {}, 'get', cb);
    $.ajax(options);
  }

  setAuthInfo(authVersion, sessionToken) {
    this.authVersion = authVersion;
    this.sessionToken = sessionToken;
  }

  private makeRequestOption(url, params, method, cb) {
    return {
      url: HOST_URL + url,
      type: method,
      data: this.encodeParam(params, method),
      headers: {
        authorization: this.sessionToken,
        fl_auth_version: this.authVersion,
      },
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: cb,
    };
  }

  private encodeParam(params, method) {
    if (method == 'post') {
      return JSON.stringify(params);
    }

    return params;
  }

  private makeUploadOption(url, file, cb) {
    let formData = new FormData();
    formData.append('avatar', file);

    return {
      url: HOST_URL + url,
      type: 'post',
      processData: false,
      contentType: false,
      dataType: 'json',
      data: formData,
      headers: {
        authorization: this.sessionToken,
        fl_auth_version: this.authVersion,
      },
      success: cb,
    };
  }

  addSharecoinDetails(params, cb) {
    let options = this.makeRequestOption(
      'api/add-sharing-code',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  updateSharecoinDetails(params, cb) {
    let options = this.makeRequestOption(
      'api/update-sharing-code',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getSharingCode(params, cb) {
    let options = this.makeRequestOption(
      'api/get-sharing-code',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  addPayoutCode(params, cb) {
    let options = this.makeRequestOption(
      'api/add-payout-code',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getCurrentPayoutCode(params, cb) {
    let options = this.makeRequestOption(
      'api/get-payout-code',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  removePayoutCode(params, cb) {
    let options = this.makeRequestOption(
      'api/remove-payout-code',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  validateNewSharingCode(params, cb) {
    let options = this.makeRequestOption(
      'api/is-sharing-code-available',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  getERC20Tokens(params, cb) {
    let options = this.makeRequestOption(
      'api/get-selected-currencies',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }

  updateERC20Tokens(params, cb) {
    let options = this.makeRequestOption(
      'api/update-selected-currencies',
      params,
      'post',
      cb
    );
    $.ajax(options);
  }

  getActiveCurrencies(params, cb) {
    let options = this.makeRequestOption(
      'api/get-active-currencies',
      params,
      'get',
      cb
    );
    $.ajax(options);
  }
}
