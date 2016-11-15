import { REQUEST, PENDING } from '../action-types';
import { commonActions } from '../common/actions';
import { contactsActions } from '../contacts/actions';
import store from '../store';
import { riot } from '../../components/riot-ts';
import { removeUserKey, getUserKey } from '../utils';
import RequestService from './request-service';
import SendService from '../send/send-service';
import Wallet from '../wallet';
import { getLocation } from '../utils';
import { PAGE_SIZE } from '../../components/home/contacts';

export const requestActions = {
    sendRequest(moneyInfo) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));
            RequestService.singleton().requestMoney(moneyInfo).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));
                if (resp.rc === 1) {
                    dispatch(this.sendRequestSuccess());
                    dispatch({ type: PENDING.NEED_UPDATE_PENDING_REQUESTS });
                    RequestService.singleton().sendRequest(moneyInfo.bare_uid).then((resp: any) => {
                        if (resp.rc === 1) {
                            let criteria = {
                                bare_uid: moneyInfo.bare_uid
                            };
                            SendService.singleton().addToRoster(criteria).then((resp: any) => {
                                if (resp.rc === 1) {
                                    let params = {
                                        subs_start: 0,
                                        subs_size: PAGE_SIZE,
                                        sent_start: -1,
                                        sent_size: 0,
                                        recv_start: -1,
                                        recv_size: 0
                                    };
                                    dispatch(contactsActions.getRoster(params));
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