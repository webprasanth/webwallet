import {riot, template, Element} from '../riot-ts';
import store, {ApplicationState} from '../../model/store';
import HomeRequestTemplate from './request.html!text';

@template(HomeRequestTemplate)
export default class HomeRequest extends Element{
}