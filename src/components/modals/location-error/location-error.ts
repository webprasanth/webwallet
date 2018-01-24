import { riot, template, Element } from '../../riot-ts';
import LocationErrorTemplate from './location-error.html!text';
import { getText } from '../../localise';

@template(LocationErrorTemplate)
export default class LocationError extends Element {
  private getText = getText;

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
