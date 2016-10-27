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
                console.log('+++++++++++++++++++ babv upload image percentCb resp: ' + JSON.stringify(resp));
            }

            let doneCb = function(resp) {
                console.log('+++++++++++++++++++ babv upload image doneCb resp: ' + JSON.stringify(resp));
                resolve(resp);
            }

            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;
                andaman.upload_profile_pic(pipe, file, percentCb, doneCb);
            })
        });
    }
}