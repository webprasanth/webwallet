import { SEND, PENDING, COMMON } from '../action-types';
import { commonActions } from '../common/actions';
import { contactsActions } from '../contacts/actions';
import store from '../store';
import { riot } from '../../components/riot-ts';
import { removeUserKey, getUserKey, getLocation } from '../utils';
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
                        if (resp && resp.rc === 1 && (resp.txn.status === 1 || userSelectedCurrency != CURRENCY_TYPE.FLASH)) {
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
          }
          else {
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
      if(parseInt(wallet.currency_type) == currency_type)
        return true;
      else
        return false;
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
