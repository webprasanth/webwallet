import AppService from '../app-service';

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
      AppService.getInstance().updateProfile(params, resp => {
        resolve(resp);
      });
    });
  }

  updateAvatar(file) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().uploadProfileImage(file, resp => {
        resolve(resp);
      });
    });
  }

  getSSOKeypair(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().getKeypair(params, resp => {
        resolve(resp);
      });
    });
  }

  changePassword(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().changePassword(params, resp => {
        resolve(resp);
      });
    });
  }

  enable2FA(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().start2faCode(params, resp => {
        resolve(resp);
      });
    });
  }

  disable2FA(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().turnOff2fa(params, resp => {
        resolve(resp);
      });
    });
  }

  confirm2FACode(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().confirm2faCode(params, resp => {
        resolve(resp);
      });
    });
  }

  enableFountain(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().enableFountain(params, resp => {
        resolve(resp);
      });
    });
  }

  updateFountain(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().updateFountain(params, resp => {
        resolve(resp);
      });
    });
  }

  disableFountain(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().disableFountain(params, resp => {
        resolve(resp);
      });
    });
  }

  getFountain(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().myFountain(params, resp => {
        resolve(resp);
      });
    });
  }

  verifyPhone(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().verifyPhone(params, resp => {
        resolve(resp);
      });
    });
  }

  sendVerificationSms(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().sendVerificationSms(params, resp => {
        resolve(resp);
      });
    });
  }

  addSharecoinDetails(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().addSharecoinDetails(params, resp => {
        resolve(resp);
      });
    });
  }

  getSharingCode(params) {
    return new Promise((resolve, reject) => {
      AppService.getInstance().getSharingCode(params, resp => {
        resolve(resp);
      });
    });
  }  
}
