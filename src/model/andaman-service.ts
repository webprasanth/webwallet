interface IAndaman{
    get_txns(pipe, credentials, callback: (resp) => any);
    get_session_token(pipe, credentials:{idToken: string, res?: string}, cb: (resp) => any);
    sso_login(pipe, credentials: {email: string, password: string, res?: string}, cb: (resp) => any);
    get_profile(pipe, opts:any, cb:(resp) => any);
}

export default class AndamanService{
    private static service = (<any>window).AndamanService;

    static ready(): Promise<{andaman: IAndaman, pipe: any}>{
        return AndamanService.service.ready();
    }
}