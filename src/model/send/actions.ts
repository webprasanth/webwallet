import { SEND, PENDING, COMMON } from '../action-types';
import { commonActions } from '../common/actions';
import { contactsActions } from '../contacts/actions';
import store from '../store';
import { riot } from '../../components/riot-ts';
import {
  removeUserKey,
  getUserKey,
  getLocation,
  ethToWei,
  calcSharingFee,
} from '../utils';
import SendService from './send-service';
import Wallet from '../wallet';
import { CURRENCY_TYPE } from '../currency';
import { PAGE_SIZE } from '../../components/home/contacts';

export const sendActions = {
  createRawTx(targetWallet, amount, custom_fee, message) {
    let tx = null;
    let wallet = sendActions.getActiveWallet();
    var userSelectedCurrency = localStorage.getItem('currency_type');
    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      SendService.singleton()
        .createRawTx(targetWallet.address, amount, custom_fee, message)
        .then((resp: any) => {
          if (resp.rc === 1) {
            tx = wallet.signTx(resp.transaction.rawtx);
            let txn_info: any = {
              ip: getLocation().info.ip,
              amount: amount,
              currency_type: userSelectedCurrency,
              receiver_bare_uid: targetWallet.email,
              receiver_public_address: targetWallet.address,
              receiver_id: targetWallet.username,
              transaction_id: tx.getId(),
              transaction_hex: tx.toHex(),
              memo: message,
            };

            if (targetWallet.needUpdateRequestId) {
              txn_info.request_id = targetWallet.RequestId;
              txn_info.status = 0;
            }
            SendService.singleton()
              .addTxn(txn_info, wallet)
              .then((resp: any) => {
                if (resp.rc == 1) {
                  if (targetWallet.needUpdateRequestId) {
                    let criteria = {
                      request_id: targetWallet.RequestId,
                      sender_bare_uid: targetWallet.email,
                      note_processing: targetWallet.memo,
                      currency_type: userSelectedCurrency,
                    };

                    SendService.singleton()
                      .markSentMoneyRequests(criteria)
                      .then((resp: any) => {
                        // TODO: Reload all TXN in pending page
                        if (resp.rc == 1) {
                          dispatch(
                            sendActions.markSentMoneyRequestsSuccess(resp)
                          );
                        } else {
                          console.log('markSentMoneyRequests failed');
                        }
                      });
                  } else {
                    dispatch(sendActions.clearForm());
                  }
                  //Auto Approve
                  if (targetWallet.email) {
                    let criteria = {
                      bare_uid: targetWallet.email,
                    };
                    SendService.singleton()
                      .addToRoster(criteria)
                      .then((resp: any) => {
                        if (resp.rc === 1) {
                          let params = {
                            subs_start: 0,
                            subs_size: PAGE_SIZE,
                            sent_start: -1,
                            sent_size: 0,
                            recv_start: -1,
                            recv_size: 0,
                          };
                          dispatch(contactsActions.getRoster(params));
                        } else {
                          console.log('Add to roster failed');
                        }
                      });
                  }

                  let count = 0;
                  let checkTx = () => {
                    SendService.singleton()
                      .getTxnById(txn_info)
                      .then((resp: any) => {
                        count++;
                        if (
                          resp &&
                          resp.rc === 1 &&
                          (resp.txn.status === 1 ||
                            userSelectedCurrency != CURRENCY_TYPE.FLASH)
                        ) {
                          dispatch(
                            sendActions.sendTXNSuccess(
                              resp.txn.processing_duration.toFixed(3)
                            )
                          );
                        } else if (count < 5) {
                          setTimeout(checkTx, 1000);
                        } else {
                          dispatch(
                            sendActions.sendTXNSuccess(Number(2).toFixed(3))
                          );
                        }
                      });
                  };
                  // TODO: dispatch action "wallet-ready"
                  checkTx();
                  dispatch(commonActions.toggleLoading(false));
                  dispatch({ type: COMMON.NEED_UPDATE_BALANCE, data: {} });
                } else {
                  dispatch(this.sendTXNFailed(resp));
                }
              });
          } else {
            dispatch(this.sendTXNFailed(resp));
          }
        });
    };
  },

  createRawTxMulti(
    targetWallet,
    amount,
    custom_fee,
    message,
    sharing_fee,
    payout_info
  ) {
    let tx = null;
    let wallet = sendActions.getActiveWallet();
    let userSelectedCurrency = localStorage.getItem('currency_type');

    let toAddresses = [];
    toAddresses.push({ address: targetWallet.address, amount: amount });

    sharing_fee = parseFloat(
      calcSharingFee(amount, payout_info.payout_sharing_fee)
    );
    let remaining_sharing_fee = sharing_fee;

    console.log(payout_info);

    for (var i = 0; i < payout_info.addresses.length; i++) {
      if (remaining_sharing_fee <= 0) continue;
      var address = payout_info.addresses[i];
      console.log(address);
      var address_sharing_fee = parseFloat(
        calcSharingFee(sharing_fee, address.percentage, 8)
      );

      if (
        address_sharing_fee > remaining_sharing_fee ||
        i == payout_info.addresses.length
      )
        //to manage any fraction change, mostly last address
        address_sharing_fee = remaining_sharing_fee;

      toAddresses.push({
        address: address.address,
        amount: address_sharing_fee,
      });
      remaining_sharing_fee = parseFloat(
        (remaining_sharing_fee - address_sharing_fee).toFixed(8)
      );
    }

    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      SendService.singleton()
        .createRawTxMulti(toAddresses, custom_fee, message)
        .then((resp: any) => {
          if (resp.rc === 1) {
            tx = wallet.signTx(resp.transaction.rawtx);
            let txn_info: any = {
              ip: getLocation().info.ip,
              amount: amount,
              currency_type: userSelectedCurrency,
              receiver_bare_uid: targetWallet.email,
              receiver_public_address: targetWallet.address,
              receiver_id: targetWallet.username,
              transaction_id: tx.getId(),
              transaction_hex: tx.toHex(),
              toAddresses: toAddresses,
              sharing_fee_percentage: payout_info.payout_sharing_fee,
              payout_code: payout_info.payout_code,
              memo: message,
            };

            if (targetWallet.needUpdateRequestId) {
              txn_info.request_id = targetWallet.RequestId;
              txn_info.status = 0;
            }
            SendService.singleton()
              .addTxnMulti(txn_info, wallet)
              .then((resp: any) => {
                if (resp.rc == 1) {
                  if (targetWallet.needUpdateRequestId) {
                    let criteria = {
                      request_id: targetWallet.RequestId,
                      sender_bare_uid: targetWallet.email,
                      note_processing: targetWallet.memo,
                      currency_type: userSelectedCurrency,
                    };

                    SendService.singleton()
                      .markSentMoneyRequests(criteria)
                      .then((resp: any) => {
                        // TODO: Reload all TXN in pending page
                        if (resp.rc == 1) {
                          dispatch(
                            sendActions.markSentMoneyRequestsSuccess(resp)
                          );
                        } else {
                          console.log('markSentMoneyRequests failed');
                        }
                      });
                  } else {
                    dispatch(sendActions.clearForm());
                  }
                  //Auto Approve
                  if (targetWallet.email) {
                    let criteria = {
                      bare_uid: targetWallet.email,
                    };
                    SendService.singleton()
                      .addToRoster(criteria)
                      .then((resp: any) => {
                        if (resp.rc === 1) {
                          let params = {
                            subs_start: 0,
                            subs_size: PAGE_SIZE,
                            sent_start: -1,
                            sent_size: 0,
                            recv_start: -1,
                            recv_size: 0,
                          };
                          dispatch(contactsActions.getRoster(params));
                        } else {
                          console.log('Add to roster failed');
                        }
                      });
                  }

                  let count = 0;
                  let checkTx = () => {
                    SendService.singleton()
                      .getTxnById(txn_info)
                      .then((resp: any) => {
                        count++;
                        if (
                          resp &&
                          resp.rc === 1 &&
                          (resp.txn.status === 1 ||
                            userSelectedCurrency != CURRENCY_TYPE.FLASH)
                        ) {
                          dispatch(
                            sendActions.sendTXNSuccess(
                              resp.txn.processing_duration.toFixed(3)
                            )
                          );
                        } else if (count < 5) {
                          setTimeout(checkTx, 1000);
                        } else {
                          dispatch(
                            sendActions.sendTXNSuccess(Number(2).toFixed(3))
                          );
                        }
                      });
                  };
                  // TODO: dispatch action "wallet-ready"
                  checkTx();
                  dispatch(commonActions.toggleLoading(false));
                  dispatch({ type: COMMON.NEED_UPDATE_BALANCE, data: {} });
                } else {
                  dispatch(this.sendTXNFailed(resp));
                }
              });
          } else {
            dispatch(this.sendTXNFailed(resp));
          }
        });
    };
  },

  createAndSignRawTx(
    targetWallet,
    amount,
    message,
    sender_address,
    gasPrice,
    gasLimit
  ) {
    let tx = null;
    let wallet = sendActions.getActiveWallet();
    var userSelectedCurrency = localStorage.getItem('currency_type');
    let rawTx = {
      nonce: 0, //will be changed below
      to: targetWallet.address,
      value: ethToWei(amount),
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      chainId: 0, //will be changed while signing
    };

    return dispatch => {
      dispatch(commonActions.toggleLoading(true));
      SendService.singleton()
        .getEthTransactionCount({
          address: sender_address,
          currency_type: parseInt(localStorage.getItem('currency_type')),
        })
        .then((resp: any) => {
          if (resp.rc === 1) {
            rawTx.nonce = resp.tx_count;
            tx = wallet.signEtherBasedTx(rawTx);
            var serializedTx = tx.serialize();
            let txn_info: any = {
              ip: getLocation().info.ip,
              amount: amount,
              currency_type: userSelectedCurrency,
              receiver_bare_uid: targetWallet.email,
              receiver_public_address: targetWallet.address,
              receiver_id: targetWallet.username,
              transaction_id: '',
              transaction_hex: serializedTx.toString('hex'),
              memo: message,
            };

            if (targetWallet.needUpdateRequestId) {
              txn_info.request_id = targetWallet.RequestId;
              txn_info.status = 0;
            }
            SendService.singleton()
              .addTxn(txn_info, wallet)
              .then((resp: any) => {
                if (resp.rc == 1) {
                  txn_info.transaction_id = resp.transaction_id;

                  if (targetWallet.needUpdateRequestId) {
                    let criteria = {
                      request_id: targetWallet.RequestId,
                      sender_bare_uid: targetWallet.email,
                      note_processing: targetWallet.memo,
                      currency_type: userSelectedCurrency,
                    };

                    SendService.singleton()
                      .markSentMoneyRequests(criteria)
                      .then((resp: any) => {
                        // TODO: Reload all TXN in pending page
                        if (resp.rc == 1) {
                          dispatch(
                            sendActions.markSentMoneyRequestsSuccess(resp)
                          );
                        } else {
                          console.log('markSentMoneyRequests failed');
                        }
                      });
                  } else {
                    dispatch(sendActions.clearForm());
                  }
                  //Auto Approve
                  if (targetWallet.email) {
                    let criteria = {
                      bare_uid: targetWallet.email,
                    };
                    SendService.singleton()
                      .addToRoster(criteria)
                      .then((resp: any) => {
                        if (resp.rc === 1) {
                          let params = {
                            subs_start: 0,
                            subs_size: PAGE_SIZE,
                            sent_start: -1,
                            sent_size: 0,
                            recv_start: -1,
                            recv_size: 0,
                          };
                          dispatch(contactsActions.getRoster(params));
                        } else {
                          console.log('Add to roster failed');
                        }
                      });
                  }

                  let count = 0;
                  let checkTx = () => {
                    SendService.singleton()
                      .getTxnById(txn_info)
                      .then((resp: any) => {
                        count++;
                        if (
                          resp &&
                          resp.rc === 1 &&
                          (resp.txn.status === 1 ||
                            userSelectedCurrency != CURRENCY_TYPE.FLASH)
                        ) {
                          dispatch(
                            sendActions.sendTXNSuccess(
                              resp.txn.processing_duration.toFixed(3)
                            )
                          );
                        } else if (count < 5) {
                          setTimeout(checkTx, 1000);
                        } else {
                          dispatch(
                            sendActions.sendTXNSuccess(Number(2).toFixed(3))
                          );
                        }
                      });
                  };
                  // TODO: dispatch action "wallet-ready"
                  checkTx();
                  dispatch(commonActions.toggleLoading(false));
                  dispatch({ type: COMMON.NEED_UPDATE_BALANCE, data: {} });
                } else {
                  dispatch(this.sendTXNFailed(resp));
                }
              });
          } else {
            dispatch(this.sendTXNFailed(resp));
          }
        });
    };
  },

  clearForm() {
    return { type: SEND.CLEAR_FORM };
  },
  getActiveWallet() {
    let wallets = store.getState().userData.wallets;
    let currency_type = localStorage.getItem('currency_type');
    let currency_wallets = wallets.filter(function(wallet) {
      if (parseInt(wallet.currency_type) == currency_type) return true;
      else return false;
    });
    return currency_wallets[0];
  },
  sendTXNSuccess(processing_duration) {
    return { type: SEND.SEND_TXN_SUCCESSFUL, data: processing_duration };
  },
  sendTXNFailed(resp) {
    let msg =
      resp.rc === 499
        ? 'Request timed out. Please check your Internet connection.'
        : resp.reason;
    return { type: SEND.SEND_TXN_FAILED, data: msg };
  },
  markSentMoneyRequestsSuccess(resp) {
    return { type: PENDING.MARK_SENT_MONEY_REQUESTS_SUCCESS, data: resp };
  },
};
