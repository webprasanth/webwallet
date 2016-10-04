import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeSendTemplate from './send.html!text';
import AndamanService from '../../model/andaman-service';

@template(HomeSendTemplate)
export default class HomeSend extends Element {

    onContinueButtonClick(event: Event) {

    }

    mounted() {
        UIkit.autocomplete($('.wrap-email-input'), {
            source: this.searchWallet,
            minLength: 1,
            template: `<ul class="uk-nav uk-nav-autocomplete uk-autocomplete-results">
                            {{~items}}
                            <li data-value="{{$item.email}}">
                                <a>{{$item.email}}</a>
                            </li>
                            {{/items}}
                       </ul>`
        });
    }

    searchWallet(release) {
        let term: string = $('#to_email_id').val();

        AndamanService.ready().then(opts => {
            let andaman = opts.andaman;
            let pipe = opts.pipe;

            let params = {
                term,
                start: 0,
                size: 20
            };

            andaman.search_wallet(pipe, params, (resp: any) => {
                if (resp.rc === 1 && resp.wallets.length > 0) {
                    release(resp.wallets);
                } else {
                    release([]);
                }
                
            });
        });
    }

}