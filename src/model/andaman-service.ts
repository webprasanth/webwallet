import Andaman from "Andaman";

interface IAndaman {
    get_txns(pipe, credentials, callback: (resp) => any);
    get_session_token_v2(pipe, credentials: { idToken: string, res?: string }, cb: (resp) => any);
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
}

export default class AndamanService {
    private static service = Andaman;
    public static opts = Andaman.opts;
    static ready(): Promise<{ andaman: IAndaman, pipe: any }> {
        return AndamanService.service.ready();
    }
}