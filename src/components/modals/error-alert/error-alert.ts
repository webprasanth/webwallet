import { riot, template, Element } from '../../riot-ts';
import ErrorAlertTemplate from './error-alert.html!text';
import { getText } from '../../localise';

@template(ErrorAlertTemplate)
export default class ErrorAlert extends Element {
  private getText = getText;

  constructor() {
    super();
  }

  mounted() {
    $('#errorModal').modal('show');
  }

  onOk(event: Event) {
    if (this.opts.callback) {
      this.opts.callback();
    }
  }
}
