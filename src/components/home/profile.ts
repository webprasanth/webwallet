import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeProfileTemplate from './profile.html!text';
import AndamanService from '../../model/andaman-service';
import { calcFee } from '../../model/utils';

@template(HomeProfileTemplate)
export default class HomeProfile extends Element {

    private userProfile = null;
    private avartarServer: string = null;
    private isUploadingImage: boolean = false;

    private isProfile = true;
    private isSetting = false;
    private isFountain = false;

    mounted() {
        this.userProfile = store.getState().userData.user;
        this.avartarServer = AndamanService.AvatarServer;
        this.mountComponents();
    }

    mountComponents() {
        riot.mount('#profile-avatar', 'profile-avatar', {});
        riot.mount('#user-info', 'user-info', {});
        riot.mount('#account-setting', 'account-setting', {});
        riot.mount('#fountain-setting', 'fountain-setting', {});
    }

    onTabSelect(tab) {
        if (tab == 'profile') {
            this.isProfile = true;
            this.isSetting = false;
            this.isFountain = false;
        } else if (tab == 'setting') {
            this.isProfile = false;
            this.isSetting = true;
            this.isFountain = false;
        } else if (tab == 'fountain') {
            this.isProfile = false;
            this.isSetting = false;
            this.isFountain = true;
        }
    }
}
