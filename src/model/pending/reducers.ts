import { PENDING } from '../action-types';
import { TAB } from './types';
import {getText} from '../../components/localise'

var homeTabs = [];

export default function pendingReducer(state = { type: TAB.INCOMING, total_money_reqs: 0, money_requests: [], page_size: 10, tabs: homeTabs }, action) {
    switch (action.type) {
        case PENDING.SET_ACTIVE_TAB:
            var oldList = state.tabs.length > 0 ? state.tabs : initTabs();
            var newList = oldList.map((tab) => {
                tab.isActive = (tab.id == action.data);
                return tab;
            });
            return Object.assign({}, state, { tabs: newList });
        case PENDING.GET_MORE_REQUEST_SUCCESS:
            if (state.tabs.length == 0) {
                state.tabs = initTabs()
            }
            var money_requests = action.data.money_requests || [];
            return Object.assign({}, state, { type: action.data.type, money_requests: money_requests, total_money_reqs: action.data.total_money_reqs });
        default:
            return state;
    }
}

function initTabs() {
    return [
        { id: TAB.INCOMING, name: getText('pending_tab_incoming_request'), shortName: 'Incoming', isActive: true },
        { id: TAB.OUTGOING, name: getText('pending_tab_outgoing_request'), shortName: 'Outgoing', isActive: false }
    ]
}