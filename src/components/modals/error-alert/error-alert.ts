import { riot, template, Element } from '../../riot-ts';
import ErrorAlertTemplate from './error-alert.html!text';

@template(ErrorAlertTemplate)
export default class ErrorAlert extends Element {

    constructor() {
        super();
    }

    mounted() {
        $('#errorModal').modal('show');
    }

}
