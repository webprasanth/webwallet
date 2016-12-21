import Andaman from "Andaman";

interface IAndaman {
    get_txns(pipe, credentials, callback: (resp) => any);
    get_session_token(pipe, credentials: { idToken: string, res?: string }, cb: (resp) => any);
    sso_login_v2(pipe, credentials: { email: string, password: string, res?: string }, cb: (resp) => any);
    get_profile(pipe, opts: any, cb: (resp) => any);
    get_txn_details(pipe, params: { transaction_id: string }, cb: (resp) => any);
    search_wallet(pipe, params: { term: string, start: number, size: number }, cb: (resp) => any);
    get_my_wallets(pipe, params: {}, cb: (resp) => any);
    create_unsigned_raw_txn(pipe, params: {}, cb: (resp) => any);
    add_txn(pipe, params: {}, cb: (resp) => any);
    mark_sent_money_requests(pipe, params: {}, cb: (resp) => any);
    add_to_roster(pipe, params: {}, cb: (resp) => any);
    get_txn_by_id(pipe, params: {}, cb: (resp) => any);
    get_wallet_secret(pipe, params: {}, cb: (resp) => any);
    request_money(pipe, params: {}, cb: (resp) => any);
    send_request(pipe, params: {}, cb: (resp) => any);
    get_requests(pipe, params: {}, cb: (resp) => any);
    get_wallets_by_email(pipe, params: {}, cb: (resp) => any);
    get_balance(pipe, params: {}, cb: (resp) => any);
    mark_rejected_money_requests(pipe, params: {}, cb: (resp) => any);
    mark_cancelled_money_requests(pipe, params: {}, cb: (resp) => any);
    get_roster(pipe, params: {}, cb: (resp) => any);
    get_users_by_uid(pipe, params: {}, cb: (resp) => any);
    remove_user(pipe, params: {}, cb: (resp) => any);
    create_account_easy(pipe, params: {}, cb: (resp) => any);
    set_password_v2(pipe, params: {}, cb: (resp) => any);
    set_recovery_keys(pipe, params: {}, cb: (resp) => any);
    create_flash_wallet(pipe, params: {}, cb: (resp) => any);
    check_session_token(pipe, params: {}, cb: (resp) => any);

    sso_get_keypair(pipe, params: {}, cb: (resp) => any);
    sso_change_password(pipe, params: {}, cb: (resp) => any);
    update_profile(pipe, params: {}, cb: (resp) => any);
    upload_profile_pic(pipe, file: any, percentCb: (resp) => any, doneCb: (resp) => any);
    start_tfa_code(pipe, params: {}, cb: (resp) => any);
    turn_off_tfa(pipe, params: {}, cb: (resp) => any);
    confirm_tfa_code(pipe, params: {}, cb: (resp) => any);
    check_tfa_code(pipe, params: {}, cb: (resp) => any);
    update_fountain(pipe, params: {}, cb: (resp) => any);
    enable_fountain(pipe, params: {}, cb: (resp) => any);
    disable_fountain(pipe, params: {}, cb: (resp) => any);
    get_my_fountain(pipe, params: {}, cb: (resp) => any);
    verify_phone(pipe, params: { sms_code: string }, cb: (resp) => any);
    send_verification_sms(pipe, params: { phone_number: string }, cb: (resp) => any);

    sso_reset_password_mail(pipe, params: {}, cb: (resp) => any);
    get_recovery_keys(pipe, params: {}, cb: (resp) => any);
    sso_reset_password(pipe, params: {}, cb: (resp) => any);

    // Listen to server event
    add_session_invalid_listener(pipe, cb: (resp) => any);
    add_listener_add_txn(pipe, cb: (resp) => any);
    add_listener_request_money(pipe, cb: (resp) => any);
    add_listener_mark_money_requests(pipe, cb: (resp) => any);

    // Listen to local event
    add_disconnect_status_listener(pipe, cb: (resp) => any);
    add_connect_status_listener(pipe, cb: (resp) => any);

    remove_all_listeners(pipe);
}

export default class AndamanService {
    private static service = Andaman;
    public static readonly AvatarServer = `https://${Andaman.opts.host}/profile/`;
    public static readonly clientHost = 'flashcoin.io';

    static ready(): Promise<{ andaman: IAndaman, pipe: any }> {
        return AndamanService.service.ready();
    }
}