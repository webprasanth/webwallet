import AndamanService from '../andaman-service';

export default class ProfileService {
    private static _instance: ProfileService;

    static singleton() {
        if (!ProfileService._instance) {
            ProfileService._instance = new ProfileService();
        }

        return ProfileService._instance;
    }

    getUpdateProfile(params) {
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
            let percentCb = function(resp) {
                // TODO babv implement
            }

            let doneCb = function(resp) {
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
}