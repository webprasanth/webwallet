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
}