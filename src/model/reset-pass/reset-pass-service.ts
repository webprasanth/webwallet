import AndamanService from '../andaman-service';
import store from '../store';

export default class ResetPassService {
    constructor() { }

    private static _instance: ResetPassService;

    static singleton() {
        if (!ResetPassService._instance) {
            ResetPassService._instance = new ResetPassService();
        }

        return ResetPassService._instance;
    }

    ssoResetPasswordMail(params) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.sso_reset_password_mail(pipe, params, resp => {
                    resolve(resp);
                });
            });
        });
    }

    getRecoveryKeys(params) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.get_recovery_keys(pipe, params, resp => {
                    resolve(resp);
                });
            });
        });
    }

    ssoResetPassword(params) {
        return new Promise((resolve) => {
            AndamanService.ready().then((opts) => {
                var andaman = opts.andaman;
                var pipe = opts.pipe;

                andaman.sso_reset_password(pipe, params, resp => {
                    resolve(resp);
                });
            });
        });
    }
}