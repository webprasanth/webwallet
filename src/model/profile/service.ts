import AndamanService from '../andaman-service';

export default class ProfileService {
    private static _instance: ProfileService;

    static singleton() {
        if (!ProfileService._instance) {
            ProfileService._instance = new ProfileService();
        }

        return ProfileService._instance;
    }

    updateProfile(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.update_profile(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    updateAvatar(file) {
        return new Promise((resolve, reject) => {
            let percentCb = function (resp) {
                // TODO babv implement
            }

            let doneCb = function (resp) {
                // TODO babv implement
                resolve(resp);
            }

            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;
                andaman.upload_profile_pic(pipe, file, percentCb, doneCb);
            })
        });
    }

    getSSOKeypair(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.sso_get_keypair(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    changePassword(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.sso_change_password(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    enable2FA(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.start_tfa_code(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    disable2FA(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.turn_off_tfa(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    confirm2FACode(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.confirm_tfa_code(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    enableFountain(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.enable_fountain(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    updateFountain(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.update_fountain(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    disableFountain(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.disable_fountain(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    getFountain(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.get_my_fountain(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    verifyPhone(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.verify_phone(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    sendVerificationSms(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.send_verification_sms(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }
}