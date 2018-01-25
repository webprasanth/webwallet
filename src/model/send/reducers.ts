import { SEND } from '../action-types';

export default function sendReducer(
  state = { processing_duration: 2.0 },
  action
) {
  switch (action.type) {
    case SEND.SEND_TXN_SUCCESSFUL:
      return Object.assign({}, state, { processing_duration: action.data });
    default:
      return state;
  }
}
