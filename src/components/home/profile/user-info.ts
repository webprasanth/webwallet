import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import UserInfoTemplate from './user-info.html!text';
import AndamanService from '../../../model/andaman-service';
import { calcFee } from '../../../model/utils';

@template(UserInfoTemplate)
export default class UserInfo extends Element {

    private userProfile = null;
    private isChangingName: boolean = false;
    private isChangingPass: boolean = false;
    private isChangingTimezone: boolean = false;
    private timezones = [];
    
    mounted() {
        this.userProfile = store.getState().userData.user;
        this.update();
    }
}
