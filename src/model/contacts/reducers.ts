import { CONTACTS } from '../action-types';

export default function contactsReducer(state = { contacts: [], totalContacts: 0, contactWallet: {} }, action) {
    switch (action.type) {
        case CONTACTS.GET_ROSTER_SUCCESS:
            return Object.assign({}, state, { totalContacts: action.data.roster.total_subs });
        case CONTACTS.GET_USERS_BY_UID_SUCCESS:
            return Object.assign({}, state, { contacts: action.data });
        case CONTACTS.GET_WALLETS_BY_EMAIL_SUCCESS:
            return Object.assign({}, state, { contactWallet: action.data });
        default:
            return state;
    }
}