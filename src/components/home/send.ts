import {riot, template, Element} from '../riot-ts';
import store, {ApplicationState} from '../../model/store';
import HomeSendTemplate from './send.html!text';

@template(HomeSendTemplate)
export default class HomeSend extends Element{
    onContinueButtonClick(event: Event){
    }
}