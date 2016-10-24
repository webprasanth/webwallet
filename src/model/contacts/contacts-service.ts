import AndamanService from '../andaman-service';

export default class ContactsService {
    private static _instance: ContactsService;

    static singleton() {
        if (!ContactsService._instance) {
            ContactsService._instance = new ContactsService();
        }

        return ContactsService._instance;
    }

    getRoster(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.get_roster(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    getUsersByUid(params) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.get_users_by_uid(pipe, params, resp => {
                    resolve(resp);
                });
            })
        });
    }

    removeUser(email) {
        return new Promise((resolve, reject) => {
            AndamanService.ready().then(opts => {
                let andaman = opts.andaman;
                let pipe = opts.pipe;

                andaman.remove_user(pipe, email, resp => {
                    resolve(resp);
                });
            })
        });
    }
}

