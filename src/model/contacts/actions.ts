import { CONTACTS } from '../action-types';
import { commonActions } from '../common/actions';
import ContactsService from './contacts-service';
import CommonService from '../common/common-service';

export const contactsActions = {
    getRoster(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ContactsService.singleton().getRoster(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(contactsActions.getRosterSuccess(resp));
                } else {
                    dispatch(contactsActions.getRosterFailed(resp));
                }
            });
        };
    },
    getRosterSuccess(resp) {
        return { type: CONTACTS.GET_ROSTER_SUCCESS, data: resp };
    },
    getRosterFailed(resp) {
        return { type: CONTACTS.GET_ROSTER_FAILED, data: resp };
    },
    getUsersByUid(params) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ContactsService.singleton().getUsersByUid(params).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(contactsActions.getUsersByUidSuccess(resp));
                } else {
                    dispatch(contactsActions.getUsersByUidFailed(resp));
                }
            });
        };
    },
    getUsersByUidSuccess(resp) {
        return { type: CONTACTS.GET_USERS_BY_UID_SUCCESS, data: resp.users };
    },
    getUsersByUidFailed(resp) {
        return { type: CONTACTS.GET_USERS_BY_UID_FAILED, data: resp };
    },
    removeUser(email) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            ContactsService.singleton().removeUser(email).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if (resp.rc == 1) {
                    dispatch(contactsActions.removeUserSuccess());
                } else {
                    dispatch(contactsActions.removeUserFailed(resp));
                }
            });
        };
    },
    removeUserSuccess() {
        return { type: CONTACTS.REMOVE_USER_SUCCESS };
    },
    removeUserFailed(resp) {
        return { type: CONTACTS.REMOVE_USER_FAILED, data: resp };
    },
    getWalletsByEmail(params) {
        return (dispatch) => {
            CommonService.singleton().getWalletsByEmail(params).then((resp: any) => {
                if (resp.rc == 1 && resp.results.length > 0) {
                    dispatch(contactsActions.getWalletsByEmailSuccess(resp));
                } else {
                    dispatch(contactsActions.getWalletsByEmailFailed(resp));
                }
            });
        };
    },
    getWalletsByEmailSuccess(resp) {
        return { type: CONTACTS.GET_WALLETS_BY_EMAIL_SUCCESS, data: resp.results[0] };
    },
    getWalletsByEmailFailed(resp) {
        return { type: CONTACTS.GET_WALLETS_BY_EMAIL_FAILED, data: resp };
    },
};