import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import AccountSettingTemplate from './setting.html!text';
import AndamanService from '../../../model/andaman-service';

@template(AccountSettingTemplate)
export default class HomeProfile extends Element {

    private userProfile = null;
    private accountType = null;
    private publicKeyList = [];

    mounted() {
        this.userProfile = store.getState().userData.user;
    }
}
