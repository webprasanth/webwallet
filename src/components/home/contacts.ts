import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomeContactsTemplate from './contacts.html!text';
import AndamanService from '../../model/andaman-service';
import { contactsActions } from '../../model/contacts/actions';
import { CONTACTS, COMMON } from '../../model/action-types';
import { strimString } from '../../model/utils';
import { FCEvent } from '../../model/types';

export const PAGE_SIZE = 10;
const ACTION_SEND = 0;
const ACTION_REQUEST = 1;

let tag = null;

@template(HomeContactsTemplate)
export default class HomeContacts extends Element {
    private paginationObject = null;
    private static unsubscribe = null;
    /**
     * Flag for reset Pagination
     * + true when change Tab or reload data
     * + false when navigate to another page
     */
    private resetPagination = false;
    private AvatarServer = AndamanService.AvatarServer;
    private contacts = [];
    private contactUids = [];
    private currentPage = 1;
    /**
     * do actionSelected with contact: Send money or Request money
     */
    private actionSelected = 0;

    mounted() {
        tag = this;
        let state = store.getState();
        if (HomeContacts.unsubscribe) HomeContacts.unsubscribe();
        HomeContacts.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.prepareContactUids();
    }

    buildPagination() {
        if (this.resetPagination) {
            let state = store.getState();
            let {contacts, totalContacts} = state.contactsData;

            this.paginationObject = $(() => {
                $('#contact-pagination').pagination({
                    items: totalContacts,
                    itemsOnPage: PAGE_SIZE,
                    displayedPages: 3,
                    edges: 1,
                    onPageClick: this.prepareContactUids
                });
            });
        }
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.contactsData;
        let type = state.lastAction.type;

        switch (type) {
            case CONTACTS.GET_ROSTER_SUCCESS:
                this.contactUids = state.lastAction.data.roster.subs.map(item => {
                    return item.bare_uid;
                });
                this.loadData();
                break;
            case CONTACTS.GET_USERS_BY_UID_SUCCESS:
                this.buildPagination();
                this.contacts = data.contacts;
                break;
            case CONTACTS.REMOVE_USER_SUCCESS:
            case COMMON.NEED_UPDATE_CONTACT:
                this.prepareContactUids();
                break;
            case CONTACTS.GET_WALLETS_BY_EMAIL_SUCCESS:
                if (tag.actionSelected == ACTION_REQUEST) {
                    riot.mount('#confirm-send', 'contact-request-money', {
                        sendAddr: data.contactWallet
                    });
                } else if (tag.actionSelected == ACTION_SEND) {
                    riot.mount('#confirm-send', 'contact-send-money', {
                        sendAddr: data.contactWallet
                    });
                }
                break;
            default:
                break;
        }

        this.update();
    }

    loadData() {
        let pageSettings = {
            uids: this.contactUids,
            start: (this.currentPage - 1) * PAGE_SIZE,
            size: PAGE_SIZE
        };
        store.dispatch(contactsActions.getUsersByUid(pageSettings));
    }

    prepareContactUids = (pageNumber?, event?) => {
        if (!pageNumber) {
            this.resetPagination = true;
            pageNumber = 1;
        } else {
            this.resetPagination = false;
        }
        this.currentPage = pageNumber;

        let params = {
            subs_start: (pageNumber - 1) * PAGE_SIZE,
            subs_size: PAGE_SIZE,
            sent_start: -1,
            sent_size: 0,
            recv_start: -1,
            recv_size: 0
        };

        store.dispatch(contactsActions.getRoster(params));
    }

    removeContact(event: FCEvent) {
        riot.mount('#confirm-send', 'confirm-dialog', {
            title: 'Delete contact',
            message: 'Are you sure you want to delete this contact?',
            callback: function (result) {

                if (result) {
                    store.dispatch(contactsActions.removeUser(event.item.email));
                }
            }
        });
    }

    requestForm(event: FCEvent) {
        tag.actionSelected = ACTION_REQUEST;
        let account = {
            email: event.item.email,
            start: 0,
            size: 1
        };
        store.dispatch(contactsActions.getWalletsByEmail(account));
    }

    sendForm(event: FCEvent) {
        tag.actionSelected = ACTION_SEND;
        let account = {
            email: event.item.email,
            start: 0,
            size: 1
        };
        store.dispatch(contactsActions.getWalletsByEmail(account));
    }
}
