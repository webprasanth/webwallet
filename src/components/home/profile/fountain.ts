import { riot, template, Element } from '../../riot-ts';
import store, { ApplicationState } from '../../../model/store';
import HomeProfileTemplate from './fountain.html!text';
import AndamanService from '../../../model/andaman-service';
import { calcFee } from '../../../model/utils';

@template(HomeProfileTemplate)
export default class HomeProfile extends Element {

    private userProfile = null;
    private totpTurningOn: boolean = false;
    private fountainEnabled: boolean = false;

    private selectedTimeUnit = 1;
    private isHourUnit: boolean = true;
    private isMinuteUnit: boolean = false;
    private memo: string = '';

    private domainStr: string = '';
    private hostname: string = 'babv.com';
    private fountainId: string = 'a4444AfountainID';
    private amount: number = 0;
    private duration: number = 0;

    mounted() {
        this.userProfile = store.getState().userData.user;
    }
}
