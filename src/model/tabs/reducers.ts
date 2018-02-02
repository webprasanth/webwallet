import { TABS } from '../action-types';
import { getText } from '../../components/localise';

let tabs = [];

export default function tabReducer(state = { tabs: tabs }, action) {
  switch (action.type) {
    case TABS.SET_ACTIVE:
      var oldList = state.tabs.length > 0 ? state.tabs : initTabs();
      var newList = oldList.map(tab => {
        tab.isActive = tab.id == action.data;
        return tab;
      });
      return Object.assign({}, state, { tabs: newList });
    default:
      return state;
  }
}

function initTabs() {
  return [
    { id: 'activity', name: getText('menu_label_activity'), isActive: true },
    { id: 'send', name: getText('menu_label_send'), isActive: false },
    { id: 'request', name: getText('menu_label_request'), isActive: false },
    { id: 'pending', name: getText('menu_label_pending'), isActive: false },
    { id: 'contacts', name: getText('menu_label_contact'), isActive: false },
    { id: 'merchant-tools', name: getText('menu_label_merchant_tools'), isActive: false },
    { id: 'profile', name: getText('menu_label_profile'), isActive: false },
  ];
}
