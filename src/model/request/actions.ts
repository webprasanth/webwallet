import { REQUEST } from '../action-types';
import { commonActions } from '../commons/actions';
import store from '../store';
import { riot } from '../../components/riot-ts';
import { removeUserKey, getUserKey } from '../utils';
import RequestService from './request-service';
import SendService from '../send/send-service';
import Wallet from '../wallet';
import { getLocation } from '../utils';

export const requestActions = {
    sendRequest(moneyInfo, receiverWallet) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));
            RequestService.singleton().requestMoney(moneyInfo).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));
                if (resp.rc === 1) {
                    dispatch(this.sendRequestSuccess());
                    RequestService.singleton().sendRequest(receiverWallet.email).then((resp: any) => {
                        if (resp.rc === 1) {
                            let criteria = {
                                bare_uid: receiverWallet.email
                            };
                            SendService.singleton().addToRoster(criteria).then((resp: any) => {
                                if (resp.rc === 1) {
                                    console.log('Add to roster success');
                                } else {
                                    console.log('Add to roster failed');
                                }
                            });
                        }
                    });
                } else {
                    dispatch(this.sendRequestFailed(resp));
                }
            })
        }
    },
    sendRequestSuccess() {
        return { type: REQUEST.REQUEST_MONEY_SUCCESS };
    },
    sendRequestFailed(resp) {
        let msg = (resp.rc === 499) ? "Request timed out. Please check your Internet connection." : resp.reason;
        return { type: REQUEST.REQUEST_MONEY_FAILED, data: msg }
    }
}