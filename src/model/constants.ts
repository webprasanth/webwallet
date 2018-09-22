import { APP_MODE } from './app-service';

export default class Constants {
  public static readonly AvatarServer =
    APP_MODE == 'DEV'
      ? 'https://dev03keys.flashcoin.io/profile/'
      : 'https://keys.flashcoin.io/profile/';
  public static readonly clientHost = 'flashcoin.io';

  public static readonly ROSTER_OPERATION = {
    REQUEST: 1,
    APPROVE: 2,
    REMOVE: 3,
    BLOCK: 4,
    UNBLOCK: 5,
  };

  //KEYS OPERATIONS RECV
  public static readonly KEYS_ADD_MONEY_REQ_RECV = 1714;
  public static readonly KEYS_ADD_TXN_LOG_RECV = 1711;
  public static readonly KEYS_MARK_MONEY_REQ_RECV = 1719;
}
