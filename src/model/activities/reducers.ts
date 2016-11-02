import { ACTIVITIES } from '../action-types';

var homeTabs = [
    { id: 0, code: 'ALL', name: 'All Transactions', isActive: true },
    { id: 2, code: 'RECEIVED', name: 'Payments Received', isActive: false },
    { id: 1, code: 'SENT', name: 'Payments Sent', isActive: false }
];

export default function activityReducer(state = { txns: [], total_txns: 0, page_size: 10, tabs: homeTabs, txn_detail: {}, showTransactionDetail: false }, action) {
    switch (action.type) {
        case ACTIVITIES.GET_MORE_TXN_SUCCESS:
            var txns = action.data.txns || [];
            return Object.assign({}, state, { txns: txns, total_txns: action.data.total_txns });
        case ACTIVITIES.SET_ACTIVE_TAB:
            var oldList = state.tabs;
            var newList = oldList.map((tab) => {
                tab.isActive = (tab.id == action.data);
                return tab;
            });
            return Object.assign({}, state, { tabs: newList });
        case ACTIVITIES.GET_TXN_DETAIL_SUCCESS:
            return Object.assign({}, state, { txn_detail: action.data, showTransactionDetail: true });
        default:
            return state;
    }
}