import { USERS } from '../action-types';
import { commonActions } from '../common/actions';
import store from '../store';
import UserService from './user-service';
import { riot } from '../../components/riot-ts';
import * as utils from '../utils';
import Premium from 'Premium';
import Wallet from '../wallet';
import base64 from 'crypto-js';
import nacl from 'tweetnacl';
import Constants from '../constants';
import secrets from 'secrets.js-grempe';
import { CURRENCY_TYPE } from '../currency';

export const userActions = {
  setAuth(user) {
    UserService.singleton().setAuthInfo(user);
  },

  signup(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));

      UserService.singleton()
        .signup(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));

          if (resp.rc === 1) {
            dispatch(userActions.signupSuccess(resp));
          } else {
            dispatch(userActions.signupFailed(resp));
          }
        });
    };
  },

  signupSuccess(resp) {
    return { type: USERS.SIGNUP_SUCCESS, data: resp };
  },

  signupFailed(resp) {
    return { type: USERS.SIGNUP_FAILED, data: resp };
  },

  ssoLogin(params) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));

      UserService.singleton()
        .ssoLogin(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc === 1) {
            dispatch(userActions.getUserData(resp));
          } else {
          }
        });
    };
  },

  updateRecoveryKeys(
    questionA: string,
    answerA: string,
    questionB: string,
    answerB: string,
    questionC: string,
    answerC: string,
    password
  ) {
    let userKey = utils.getUserKey();
    let privKeyHex = Premium.xaesDecrypt(password, userKey.encryptedPrivKey);
    let keyByteSize = 256;

    let sc = secrets.share(privKeyHex, 3, 2);
    let answers = [answerA, answerB, answerC];

    // May hash one more time
    let checksum = answers.join('*');
    let encryptedSc1 = JSON.stringify(
      Premium.xaesEncrypt(keyByteSize, checksum, sc[0])
    );
    var state = store.getState();
    let user = state.userData.user;

    let params = {
      idToken: user.idToken,
      sc1: encryptedSc1,
      sc2: sc[1],
      sc3: sc[2],
      security_question_1: questionA,
      security_question_2: questionB,
      security_question_3: questionC,
    };

    return dispatch => {
      dispatch(commonActions.toggleLoading(true));

      UserService.singleton()
        .setRecoveryKeys(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));

          if (resp.rc === 1) {
            dispatch({
              type: USERS.UPDATE_SECURITY_QUESTIONS_SUCCESS,
              data: {},
            });
          } else {
            dispatch({ type: USERS.UPDATE_SECURITY_QUESTIONS_FAIL, data: {} });
          }
        });
    };
  },

  //setPassword(token: string, password: string) {
  setPassword(
    token: string,
    password: string,
    questionA: string,
    answerA: string,
    questionB: string,
    answerB: string,
    questionC: string,
    answerC: string
  ) {
    let keypair = nacl.box.keyPair();
    let pubKey = keypair.publicKey;
    let privKey = keypair.secretKey;
    let pubKeyBase64 = utils.encodeBase64(pubKey);
    let privKeyBase64 = utils.encodeBase64(privKey);

    let privKeyHex = utils.base64ToHex(privKeyBase64);
    let keyByteSize = 256;
    let encryptedPrivKey = JSON.stringify(
      Premium.xaesEncrypt(keyByteSize, password, privKeyHex)
    );

    let params = {
      password: password,
      token: token,
      privateKey: encryptedPrivKey,
      publicKey: pubKeyBase64,
    };

    let sc = secrets.share(privKeyHex, 3, 2);
    let answers = [answerA, answerB, answerC];

    // May hash one more time
    let checksum = answers.join('*');
    let encryptedSc1 = JSON.stringify(
      Premium.xaesEncrypt(keyByteSize, checksum, sc[0])
    );

    return dispatch => {
      dispatch(commonActions.toggleLoading(true));

      UserService.singleton()
        .setPassword(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));

          if (resp.rc === 1) {
            let _params = {
              idToken: resp.profile.idToken,
              sc1: encryptedSc1,
              sc2: sc[1],
              sc3: sc[2],
              security_question_1: questionA,
              security_question_2: questionB,
              security_question_3: questionC,
            };

            let userKey = {
              idToken: resp.profile.idToken,
              encryptedPrivKey: encryptedPrivKey,
              publicKey: pubKeyBase64,
            };

            //let _params = {
            let createWalletParams = {
              sessionToken: resp.profile.sessionToken,
              publicKey: userKey.publicKey,
              appId: 'flashcoin',
            };

            utils.storeUserKey(userKey);

            // resp.profile.auth_version
            //dispatch(userActions.createWallet(_params, password, resp.profile));
            dispatch(
              userActions.setRecoveryKeys(
                _params,
                createWalletParams,
                password,
                resp.profile
              )
            );
            dispatch(userActions.setPasswordSuccess(resp.profile));
          } else {
            dispatch(userActions.setPasswordFailed(resp));
          }
        });
    };
  },

  setPasswordSuccess(profile) {
    return { type: USERS.SET_PASSWORD_SUCCESS, data: profile };
  },

  setPasswordFailed(resp) {
    return { type: USERS.SET_PASSWORD_FAILED, data: resp };
  },

  setRecoveryKeys(params, createWalletParams, password, profile) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));

      //UserService.singleton().createFlashWallet(params).then((_resp: any) => {
      UserService.singleton()
        .setRecoveryKeys(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc === 1) {
            UserService.singleton()
              .createFlashWallet(createWalletParams)
              .then((_resp: any) => {
                if (_resp.rc === 1) {
                  dispatch(userActions.loginSuccess(profile));
                  dispatch(userActions.getBalance());
                  dispatch(userActions.getProfile(profile));
                  dispatch(
                    userActions.getMyWallets(profile.auth_version, password)
                  );
                } else {
                  console.log('+++++ createFlashWallet failed, reason:', _resp);
                }
              });
            if (profile.auth_version == 4) {
              UserService.singleton()
                .createBTCWallet(createWalletParams)
                .then((_resp: any) => {
                  if (_resp.rc === 1) {
                    /*In case of BTC wallet succes ,Not all action is required so commenting some calls*/
                    //dispatch(userActions.loginSuccess(profile));
                    dispatch(userActions.getBalance());
                    //dispatch(userActions.getProfile(profile));
                    dispatch(
                      userActions.getMyWallets(profile.auth_version, password)
                    );
                  } else {
                    console.log('+++++ createBTCWallet failed, reason:', _resp);
                  }
                });

              UserService.singleton()
                .createLTCWallet(createWalletParams)
                .then((_resp: any) => {
                  if (_resp.rc === 1) {
                    dispatch(userActions.getBalance());
                    dispatch(
                      userActions.getMyWallets(profile.auth_version, password)
                    );
                  } else {
                    console.log('+++++ createLTCWallet failed, reason:', _resp);
                  }
                });

              UserService.singleton()
                .createDASHWallet(createWalletParams)
                .then((_resp: any) => {
                  if (_resp.rc === 1) {
                    dispatch(userActions.getBalance());
                    dispatch(
                      userActions.getMyWallets(profile.auth_version, password)
                    );
                  } else {
                    console.log(
                      '+++++ createDASHWallet failed, reason:',
                      _resp
                    );
                  }
                });

              UserService.singleton()
                .createETHWallet(createWalletParams)
                .then((_resp: any) => {
                  if (_resp.rc === 1) {
                    dispatch(userActions.getBalance());
                    dispatch(
                      userActions.getMyWallets(profile.auth_version, password)
                    );
                  } else {
                    console.log('+++++ createETHWallet failed, reason:', _resp);
                  }
                });
            }
            UserService.singleton()
              .setRecoveryKeys(params)
              .then((___resp: any) => {});
            dispatch(userActions.setRecoveryKeysSuccess(resp));
          } else {
            dispatch(userActions.setRecoveryKeysFailed(resp));
          }
        });
    };
  },

  setRecoveryKeysSuccess(resp) {
    return { type: USERS.GET_PROFILE_SUCCESS, data: resp };
  },
  setRecoveryKeysFailed(resp) {
    return { type: USERS.SET_RECOVERY_KEY_FAILED, data: resp };
  },

  migrateAccount(
    password: string,
    questionA: string,
    answerA: string,
    questionB: string,
    answerB: string,
    questionC: string,
    answerC: string
  ) {
    let keypair = nacl.box.keyPair();
    let pubKey = keypair.publicKey;
    let privKey = keypair.secretKey;
    let pubKeyBase64 = utils.encodeBase64(pubKey);
    let privKeyBase64 = utils.encodeBase64(privKey);

    let privKeyHex = utils.base64ToHex(privKeyBase64);
    let keyByteSize = 256;
    let encryptedPrivKey = JSON.stringify(
      Premium.xaesEncrypt(keyByteSize, password, privKeyHex)
    );

    let params = {
      password: password,
      privateKey: encryptedPrivKey,
      publicKey: pubKeyBase64,
    };

    let sc = secrets.share(privKeyHex, 3, 2);
    let answers = [answerA, answerB, answerC];

    // May hash one more time
    let checksum = answers.join('*');
    let encryptedSc1 = JSON.stringify(
      Premium.xaesEncrypt(keyByteSize, checksum, sc[0])
    );

    return dispatch => {
      UserService.singleton()
        .migrateAccount(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));

          if (resp.rc === 1) {
            let _params = {
              idToken: resp.profile.idToken,
              sc1: encryptedSc1,
              sc2: sc[1],
              sc3: sc[2],
              security_question_1: questionA,
              security_question_2: questionB,
              security_question_3: questionC,
            };

            let userKey = {
              idToken: resp.profile.idToken,
              encryptedPrivKey: encryptedPrivKey,
              publicKey: pubKeyBase64,
            };

            let wallets = store.getState().userData.wallets;
            let currency_wallets = wallets.filter(function(wallet) {
              if (parseInt(wallet.currency_type) == 1) return true;
              else return false;
            });
            let wallet = currency_wallets[0];

            //let _params = {
            let createWalletParams = {
              sessionToken: resp.profile.sessionToken,
              publicKey: userKey.publicKey,
              appId: 'flashcoin',
              passphrase: wallet.pure_passphrase,
            };

            utils.storeUserKey(userKey);

            // resp.profile.auth_version
            //dispatch(userActions.createWallet(_params, password, resp.profile));
            dispatch(
              userActions.setRecoveryKeysForMigration(
                _params,
                createWalletParams,
                password,
                resp.profile
              )
            );
            //dispatch(userActions.migrateAccountSuccess(resp.profile));
          } else {
            dispatch(userActions.migrateAccountFailed(resp));
          }
        });
    };
  },

  migrateAccountSuccess() {
    return { type: USERS.MIGRATE_V1_TO_V2_SUCCESS, data: {} };
  },

  migrateAccountFailed(resp) {
    return { type: USERS.MIGRATE_V1_TO_V2_FAILED, data: resp };
  },

  setRecoveryKeysForMigration(params, createWalletParams, password, profile) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));

      //UserService.singleton().createFlashWallet(params).then((_resp: any) => {
      UserService.singleton()
        .setRecoveryKeys(params)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));
          if (resp.rc === 1) {
            UserService.singleton()
              .migrateFlashWallet(createWalletParams)
              .then((_resp: any) => {
                if (_resp.rc === 1) {
                  dispatch(userActions.migrateAccountSuccess());
                } else {
                  console.log(
                    '+++++ migrateFlashWallet failed, reason:',
                    _resp
                  );
                  dispatch(userActions.migrateAccountFailed(resp));
                }
              });
            //dispatch(userActions.setRecoveryKeysSuccess(resp));
          } else {
            dispatch(userActions.migrateAccountFailed(resp));
          }
        });
    };
  },

  login(email, password) {
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));

      UserService.singleton()
        .login(email, password)
        .then((resp: any) => {
          dispatch(commonActions.toggleLoading(false));

          if (resp.rc === 1) {
            utils.storeIdToken(resp.profile.idToken);

            if (resp.profile.totp_enabled === 1) {
              let loginData = { profile: resp.profile, password: password };
              dispatch({ type: USERS.NEED_VERIFY_GOOGLE_2FA, data: loginData });
            } else {
              dispatch(userActions.loginSuccess(resp.profile));
              dispatch(userActions.getBalance());
              dispatch(userActions.getProfile(resp.profile));
              dispatch(
                userActions.getMyWallets(resp.profile.auth_version, password)
              );
            }
          } else {
            dispatch(userActions.loginFailed(resp));
          }
        });
    };
  },

  getUserData(resp) {
    utils.storeIdToken(resp.profile.idToken);
    let password = resp.secretKey;
    let userKey = {
      idToken: resp.profile.idToken,
      encryptedPrivKey: resp.profile.privateKey,
      publicKey: resp.profile.publicKey,
    };
    utils.storeUserKey(userKey);

    return dispatch => {
      if (resp.rc === 1) {
        if (resp.profile.totp_enabled === 1) {
          let loginData = { profile: resp.profile, password: password };
          dispatch({ type: USERS.NEED_VERIFY_GOOGLE_2FA, data: loginData });
        } else if (resp.profile.auth_version === 3) {
          dispatch(
            userActions.getMyWallets(resp.profile.auth_version, password)
          );
        } else {
          dispatch(userActions.loginSuccess(resp.profile));
          dispatch(userActions.getBalance());
          dispatch(userActions.getProfile(resp.profile));
          dispatch(
            userActions.getMyWallets(resp.profile.auth_version, password)
          );
        }
      } else {
        dispatch(userActions.loginFailed(resp));
      }
    };
  },

  loginFailed(resp) {
    return { type: USERS.LOGIN_FAILED, data: resp };
  },
  loginSuccess(user) {
    return { type: USERS.LOGIN_SUCCESS, data: user };
  },
  logout() {
    return dispatch => {
      this.removeAccessToken();
      utils.removeUserKey();
      dispatch(userActions._logout());
    };
  },
  _logout() {
    return { type: USERS.LOGOUT };
  },
  getProfile(data) {
    return dispatch => {
      UserService.singleton()
        .getProfile()
        .then((resp: any) => {
          if (resp.rc === 1) {
            for (var key in resp.profile) {
              data[key] = resp.profile[key];
            }
            dispatch(userActions.getProfileSuccess(data));
          } else {
            dispatch(userActions.getProfileFailed(resp));
          }
        });
    };
  },
  getProfileSuccess(profile) {
    return { type: USERS.GET_PROFILE_SUCCESS, data: profile };
  },
  getProfileFailed(resp) {
    return { type: USERS.GET_PROFILE_FAILED, data: resp };
  },
  check2faCode(params) {
    return dispatch => {
      UserService.singleton()
        .check2faCode(params)
        .then((resp: any) => {
          if (resp.rc === 1) {
            dispatch(userActions.check2faCodeSuccess(resp));
          } else {
            dispatch(userActions.check2faCodeFailed(resp));
          }
        });
    };
  },
  check2faCodeSuccess(resp) {
    return { type: USERS.CHECK_2FA_CODE_SUCCESS, data: resp };
  },
  check2faCodeFailed(resp) {
    return { type: USERS.CHECK_2FA_CODE_FAILED, data: resp };
  },
  check2faCodeSendtxn(params) {
    return dispatch => {
      UserService.singleton()
        .check2faCodeSendtxn(params)
        .then((resp: any) => {
          if (resp.rc === 1) {
            dispatch(userActions.check2faCodeSuccessSendtxn(resp));
          } else {
            dispatch(userActions.check2faCodeFailedSendtxn(resp));
          }
        });
    };
  },
  check2faCodeSuccessSendtxn(resp) {
    return { type: USERS.CHECK_2FA_CODE_SUCCESS_TXN, data: resp };
  },
  check2faCodeFailedSendtxn(resp) {
    return { type: USERS.CHECK_2FA_CODE_FAILED_TXN, data: resp };
  },
  getMyWallets(auth_version, password) {
    return dispatch => {
      UserService.singleton()
        .getMyWallets()
        .then((resp: any) => {
          if (resp.rc === 1) {
            if (
              resp.my_wallets.length > 4 ||
              (resp.my_wallets.length == 1 && auth_version != 4)
            ) {
              decryptWallets(dispatch, resp.my_wallets, auth_version, password);
              if (auth_version == 3) {
                let loginData = { password: password };
                dispatch({ type: USERS.NEED_MIGRATION_TO_V2, data: loginData });
              }
            } else {
              let userProfile = store.getState().userData.user;
              let userKey = utils.getUserKey();
              let params = {
                sessionToken: userProfile.sessionToken,
                publicKey: userKey.publicKey,
                appId: 'flashcoin',
              };
              //if no FLASH wallet
              if (
                userActions.getCurrencyWallet(
                  resp.my_wallets,
                  CURRENCY_TYPE.FLASH
                ).length == 0
              ) {
                UserService.singleton()
                  .createFlashWallet(params)
                  .then((resp: any) => {
                    if (resp.rc === 1) {
                      UserService.singleton()
                        .getMyWallets()
                        .then((resp: any) => {
                          if (resp.rc === 1) {
                            decryptWallets(
                              dispatch,
                              resp.my_wallets,
                              auth_version,
                              password
                            );
                          } else {
                            dispatch(userActions.getMyWalletsFailed(resp));
                          }
                        });
                    } else {
                      console.log('createFlashWallet failed, reason:', resp);
                    }
                  });
              }
              //if no BTC wallet
              if (
                userActions.getCurrencyWallet(
                  resp.my_wallets,
                  CURRENCY_TYPE.BTC
                ).length == 0 &&
                auth_version == 4
              ) {
                UserService.singleton()
                  .createBTCWallet(params)
                  .then((resp: any) => {
                    if (resp.rc === 1) {
                      UserService.singleton()
                        .getMyWallets()
                        .then((resp: any) => {
                          if (resp.rc === 1) {
                            decryptWallets(
                              dispatch,
                              resp.my_wallets,
                              auth_version,
                              password
                            );
                          } else {
                            dispatch(userActions.getMyWalletsFailed(resp));
                          }
                        });
                    } else {
                      console.log('createBTCWallet failed, reason:', resp);
                    }
                  });
              }
              //if no LTC wallet
              if (
                userActions.getCurrencyWallet(
                  resp.my_wallets,
                  CURRENCY_TYPE.LTC
                ).length == 0
              ) {
                UserService.singleton()
                  .createLTCWallet(params)
                  .then((resp: any) => {
                    if (resp.rc === 1) {
                      UserService.singleton()
                        .getMyWallets()
                        .then((resp: any) => {
                          if (resp.rc === 1) {
                            decryptWallets(
                              dispatch,
                              resp.my_wallets,
                              auth_version,
                              password
                            );
                          } else {
                            dispatch(userActions.getMyWalletsFailed(resp));
                          }
                        });
                    } else {
                      console.log('createLTCWallet failed, reason:', resp);
                    }
                  });
              }
              //if no DASH wallet
              if (
                userActions.getCurrencyWallet(
                  resp.my_wallets,
                  CURRENCY_TYPE.DASH
                ).length == 0
              ) {
                UserService.singleton()
                  .createDASHWallet(params)
                  .then((resp: any) => {
                    if (resp.rc === 1) {
                      UserService.singleton()
                        .getMyWallets()
                        .then((resp: any) => {
                          if (resp.rc === 1) {
                            decryptWallets(
                              dispatch,
                              resp.my_wallets,
                              auth_version,
                              password
                            );
                          } else {
                            dispatch(userActions.getMyWalletsFailed(resp));
                          }
                        });
                    } else {
                      console.log('createDASHWallet failed, reason:', resp);
                    }
                  });
              }

              //if no ETH wallet
              if (
                userActions.getCurrencyWallet(
                  resp.my_wallets,
                  CURRENCY_TYPE.ETH
                ).length == 0
              ) {
                UserService.singleton()
                  .createETHWallet(params)
                  .then((resp: any) => {
                    if (resp.rc === 1) {
                      UserService.singleton()
                        .getMyWallets()
                        .then((resp: any) => {
                          if (resp.rc === 1) {
                            decryptWallets(
                              dispatch,
                              resp.my_wallets,
                              auth_version,
                              password
                            );
                          } else {
                            dispatch(userActions.getMyWalletsFailed(resp));
                          }
                        });
                    } else {
                      console.log('createETHWallet failed, reason:', resp);
                    }
                  });
              }
            }
          } else {
            dispatch(userActions.getMyWalletsFailed(resp));
          }
        });
    };
  },
  getMyWalletsSuccess(wallets) {
    return { type: USERS.GET_MY_WALLETS_SUCCESS, data: wallets };
  },
  getMyWalletsFailed(resp) {
    return { type: USERS.GET_MY_WALLETS_FAILED, data: resp };
  },
  getCurrencyWallet(wallets, currency_type) {
    if (!wallets) return [];
    return wallets.filter(function(wallet) {
      if (parseInt(wallet.currency_type) == currency_type) return true;
      else return false;
    });
  },
  getBalance() {
    return dispatch => {
      var userSelectedCurrency = parseInt(
        localStorage.getItem('currency_type')
      );
      let params = { currency_type: userSelectedCurrency };
      UserService.singleton()
        .getBalance(params)
        .then((resp: any) => {
          if (resp.rc === 1) {
            if (!resp.ubalance) {
              resp.ubalance = 0;
            }
            if (!resp.ebalance) {
              //Ether balance for Contract Addresses
              resp.ebalance = 0;
            }
            console.log('get Balance()', resp.balance);
            console.log('get uBalance()', resp.ubalance);
            console.log('get eBalance()', resp.ebalance);
            var balanceData = { balance: 0, ubalance: 0, ebalance: 0 };
            if (userSelectedCurrency == CURRENCY_TYPE.FLASH) {
              balanceData.balance = utils.satoshiToFlash(resp.balance);
              balanceData.ubalance = utils.satoshiToFlash(resp.ubalance);
              balanceData.ebalance = utils.satoshiToFlash(resp.ebalance);
            } else if (userSelectedCurrency != CURRENCY_TYPE.FLASH) {
              balanceData.balance = resp.balance;
              balanceData.ubalance = resp.ubalance;
              balanceData.ebalance = resp.ebalance;
            }
            dispatch(userActions.getBalanceSuccess(balanceData));
          } else {
            console.log('get getBalanceFailed()');
            dispatch(userActions.getBalanceFailed(resp));
          }
        });
    };
  },
  getBalanceSuccess(balanceData) {
    return { type: USERS.GET_BALANCE_SUCCESS, data: balanceData };
  },
  getBalanceFailed(resp) {
    return { type: USERS.GET_BALANCE_FAILED, data: resp };
  },
  rememberMe(remember) {
    return { type: USERS.REMEMBER_ME, data: remember };
  },
  saveAccessToken() {
    var state = store.getState();
    var user = state.userData.user;

    if (user) {
      localStorage.setItem('access_token', user.idToken);
    }

    return { type: USERS.SAVE_ACCESS_TOKEN };
  },
  removeAccessToken() {
    localStorage.removeItem('access_token');

    return { type: USERS.REMOVE_ACCESS_TOKEN };
  },
  forgotPassword() {
    let clientHost = window.location.host;
    if (!clientHost || clientHost.length === 0) {
      clientHost = Constants.clientHost;
    }
    route('reset_password?token=');
    return { type: USERS.FORGOT_PASSWORD };
  },
};

function decryptWallets(dispatch, wallets, auth_version, password) {
  if (auth_version === 3) {
    decryptPassphraseV1(dispatch, wallets);
  } else {
    if (password) {
      decryptPassphraseV2(dispatch, wallets, password);
    } else {
      // Store CAS version 2 account wallet
      // Only decrypt wallet if user send money
      dispatch(userActions.getMyWalletsSuccess(wallets));
    }
  }
}

/**
 * Decrypt CAS version 1 account wallet
 *
 * 1. Get the secrete key from server
 * 2. Using secrete key to decrypt wallet passphrase
 */
function decryptPassphraseV1(dispatch, wallets) {
  let userProfile = store.getState().userData.user;
  let userKey = utils.getUserKey();
  UserService.singleton()
    .getWalletSecret(userKey.idToken)
    .then((resp: any) => {
      if (resp.rc === 1) {
        let decryptedWallets = wallets.map(w => {
          let str = utils.b64DecodeUnicode(w.passphrase);
          w.pure_passphrase = Premium.xaesDecrypt(resp.wallet.secret, str);
          if (userProfile && userProfile.email) w.email = userProfile.email;
          return new Wallet().openWallet(w, true);
        });
        dispatch(userActions.getMyWalletsSuccess(decryptedWallets));
        if (userProfile) {
          dispatch({
            type: USERS.STORE_FOUNTAIN_SECRET,
            data: resp.wallet.secret,
          });
        }
      }
    });
}

/**
 * Decrypt CAS version 2 account wallet
 *
 * Using password to decrypt wallet passphrase
 */
function decryptPassphraseV2(dispatch, wallets, password) {
  let userProfile = store.getState().userData.user;
  let decryptedWallets = utils.decryptPassphraseV2(
    userProfile.email,
    wallets,
    password
  );

  dispatch(userActions.getMyWalletsSuccess(decryptedWallets));
  dispatch({ type: USERS.STORE_FOUNTAIN_SECRET, data: password });
}
