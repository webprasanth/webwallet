import AppService from '../app-service';

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
      AppService.getInstance().getRoster(params, resp => {
        resolve(resp);
      });
    });
  }

  getUsersByUid(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().getUsersByUid(params, resp => {
        resolve(resp);
      });
    });
  }

  removeUser(email) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().rosterRemove({ email: email }, resp => {
        resolve(resp);
      });
    });
  }
}
