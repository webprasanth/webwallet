import { TABS } from '../action-types';

/*
import {getText} from '../../components/localise'
let tabs = [
    { id: 'activity', name: getText('menu_label_activity'), isActive: true },
    { id: 'send', name: getText('menu_label_send'), isActive: false },
    { id: 'request', name: getText('menu_label_request'), isActive: false },
    { id: 'pending', name: getText('menu_label_pending'), isActive: false },
    { id: 'contacts', name: getText('menu_label_contact'), isActive: false },
    { id: 'profile', name: getText('menu_label_profile'), isActive: false }
];
*/

let tabs = [
    { id: 'activity', name: 'Activity', isActive: true },
    { id: 'send', name: 'Send', isActive: false },
    { id: 'request', name: 'Request', isActive: false },
    { id: 'pending', name: 'Pending', isActive: false },
    { id: 'contacts', name: 'Contacts', isActive: false },
    { id: 'profile', name: 'My Account', isActive: false }
];

export default function tabReducer(state = { tabs: tabs }, action) {
    switch (action.type) {
        case TABS.SET_ACTIVE:
            var oldList = state.tabs;
            var newList = oldList.map((tab) => {
                tab.isActive = (tab.id == action.data);
                return tab;
            });
            return Object.assign({}, state, { tabs: newList });
        default:
            return state;
    }
}