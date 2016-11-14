import { riot, template, Element } from '../../riot-ts';
import LocationErrorTemplate from './location-error.html!text';

@template(LocationErrorTemplate)
export default class LocationError extends Element {

    constructor() {
        super();
    }

    mounted() {
        $('#locationErrorModal').modal('show');
    }

    onOk(event: Event) {
        if (this.opts.callback) {
            this.opts.callback();
        }
    }

}
