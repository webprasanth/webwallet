import { COMMON } from '../action-types';
import CommonService from './common-service';
import store from '../../model/store';
import Constants from '../constants'

export const commonActions = {
    toggleLoading(isLoading) {
        return { type: COMMON.TOGGLE_LOADING, data: isLoading };
    },
    getWalletsByEmail(params) {
        return (dispatch) => {
            CommonService.singleton().getWalletsByEmail(params).then((resp: any) => {
                if (resp.rc == 1 && resp.results.length > 0) {
                    dispatch(commonActions.getWalletsByEmailSuccess(resp));
                } else {
                    dispatch(commonActions.getWalletsByEmailFailed(resp));
                }
            });
        };
    },
    getWalletsByEmailSuccess(resp) {
        return { type: COMMON.GET_WALLETS_BY_EMAIL_SUCCESS, data: resp };
    },
    getWalletsByEmailFailed(resp) {
        return { type: COMMON.GET_WALLETS_BY_EMAIL_FAILED, data: resp };
    },

    addListeners() {
        CommonService.singleton().addListeners(this.messageHandler.bind(this))
    },

    messageHandler(resp) {
        if (resp.rc == 1 && resp.messages.length > 0) {
            let messages = resp.messages;

            for (var i = 0; i < messages.length; i++) {
                let message = messages[i]

                if (this.isValidType(message.message_type) && this.isNewMessage(message)) {
                    this.showMessageContent(message);
                    break;
                }
            }
        }
    },

    showMessageContent(message) {
        let messageBody = JSON.parse(message.message_content)
        switch (message.message_type) {
            case Constants.KEYS_ADD_MONEY_REQ_RECV:
                this.onBeRequested(messageBody)
                break;
            case Constants.KEYS_ADD_TXN_LOG_RECV:
                this.onTxAdded(messageBody);
                break;
            case Constants.KEYS_MARK_MONEY_REQ_RECV:
                this.onRequestStateChanged(messageBody)
                break;
            default:
                break;
        }
    },

    isNewMessage(message) {
        let STORAGE_KEY = 'flc-read-message-ids';
        let str = localStorage.getItem(STORAGE_KEY);
        let ids = [];

        if (str) {
            ids = JSON.parse(str);
        }

        if (0 <= ids.indexOf(message.id)) {
            return false;
        }

        ids.push(message.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));

        return true
    },

    isValidType(messageType) {
        let validTypes = [Constants.KEYS_ADD_MONEY_REQ_RECV, Constants.KEYS_ADD_TXN_LOG_RECV, Constants.KEYS_MARK_MONEY_REQ_RECV];
        return 0 <= validTypes.indexOf(messageType);
    },

    needUpdatePending(resp) {
        return { type: COMMON.NEED_UPDATE_PENDING_REQUEST, data: resp };
    },

    removeAllListeners() {
        CommonService.singleton().removeAllListeners();
    },

    onTxAdded(resp) {
        store.dispatch({ type: COMMON.ON_NEW_TX_ADDED, data: resp });
        store.dispatch({ type: COMMON.NEED_UPDATE_BALANCE, data: resp });
        store.dispatch({ type: COMMON.NEED_UPDATE_CONTACT, data: resp });
    },

    onSessionExpired(resp) {
        store.dispatch({ type: COMMON.ON_SESSION_EXPIRED, data: resp });
    },

    onBeRequested(resp) {
        store.dispatch({ type: COMMON.ON_BE_REQUESTED, data: resp });
        store.dispatch({ type: COMMON.NEED_UPDATE_PENDING_REQUEST, data: resp });
    },

    onRequestStateChanged(resp) {
        store.dispatch({ type: COMMON.ON_REQUEST_STATE_CHANGED, data: resp });
        store.dispatch(commonActions.needUpdatePending(resp));
    },

    onDisconnect() {
        store.dispatch({ type: COMMON.ON_DISCONNECT });
    },

    onConnect() {
        store.dispatch({ type: COMMON.ON_CONNECT });
    }
};