import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import HomePendingTemplate from './pending.html!text';
import AndamanService from '../../model/andaman-service';
import { pendingActions } from '../../model/pending/actions';
import { SEND, PENDING, COMMON } from '../../model/action-types';
import * as utils from '../../model/utils';
import { TAB } from '../../model/pending/types';
import { FCEvent } from '../../model/types';

@template(HomePendingTemplate)
export default class HomePending extends Element {
    private fromDateObject = null;
    private toDateObject = null;
    private paginationObject = null;
    private currentActiveTabId = 2;
    private static unsubscribe = null;
    /**
     * Flag for reset Pagination
     * + true when change Tab or reload data
     * + false when navigate to another page
     */
    private resetPagination = false;
    private AvatarServer = AndamanService.AvatarServer;
    private DATE_PICKER_FORMAT: string = "M dd, yyyy";
    private ONE_MONTH: number = 30 * 24 * 60 * 60 * 1000;
    private timeZone = null;
    private getDisplayDate = utils.getDisplayDate;
    private getDisplayDateTime = utils.getDisplayDateTime;
    private strimString = utils.strimString;
    private decimalFormat = utils.decimalFormat;
    private TAB = TAB;
    private tabs = store.getState().pendingData.tabs;
    private money_requests = [];

    mounted() {
        let state = store.getState();
        this.timeZone = state.userData.user.timezone;
        if (HomePending.unsubscribe) HomePending.unsubscribe();
        HomePending.unsubscribe = store.subscribe(this.onApplicationStateChanged.bind(this));
        this.initDatePickers(false);

        // Preload data to shown pending number on menu
        if (this.opts.isPreloadData) {
            this.updateAll();
        }
    }

    updateAll() {
        let self = this;
        let currentTab = this.currentActiveTabId;
        this.currentActiveTabId = currentTab == TAB.OUTGOING ? TAB.INCOMING : TAB.OUTGOING;
        this.loadData();

        setTimeout(function () {
            self.currentActiveTabId = currentTab;
            self.loadData();
        }, 2000);
    }

    initDatePickers(showAll: boolean) {
        let state = store.getState();
        if (!this.fromDateObject) {
            this.fromDateObject = $("#pendingFromDate").parent().datepicker({
                format: this.DATE_PICKER_FORMAT,
                autoclose: true
            });
        }

        if (!this.toDateObject) {
            this.toDateObject = $("#pendingToDate").parent().datepicker({
                format: this.DATE_PICKER_FORMAT,
                autoclose: true
            });
        }
        if (showAll) {
            this.fromDateObject.datepicker('setDate', new Date(new Date(state.userData.user.created_ts).setHours(0, 0, 0, 0)));
        } else {
            let s = this.getDisplayDate(new Date(state.userData.user.created_ts), state.userData.user.timezone);
            let timeSignup = new Date(s);

            let to = new Date(this.getDisplayDate(new Date(), state.userData.user.timezone)).getTime();
            let from = new Date(to - this.ONE_MONTH + 24 * 60 * 60 * 1000);

            // Start from timeSignup.
            if (timeSignup > from) {
                from = timeSignup;
            }

            this.fromDateObject.datepicker('setDate', new Date(new Date(from).setHours(0, 0, 0, 0)));
        }

        this.toDateObject.datepicker('setDate', '-0d');

        // Auto set date range validation
        this.fromDateObject.datepicker('setStartDate', new Date(state.userData.user.created_ts));
        this.fromDateObject.datepicker('setEndDate', this.toDateObject.datepicker('getDate'));
        this.toDateObject.datepicker('setStartDate', this.fromDateObject.datepicker('getDate'));
        this.toDateObject.datepicker('setEndDate', '+0d');

        // Add date range validation on change
        this.fromDateObject.on('changeDate', selectedDate => {
            this.toDateObject.datepicker('setStartDate', selectedDate.date);
        });
        this.toDateObject.on('changeDate', selectedDate => {
            this.fromDateObject.datepicker('setEndDate', selectedDate.date);
        });
    }

    getPendingRequestStatus(status, type): string {
        switch (status) {
            case 0: return (type == 1 ? 'Awaiting Acceptance' : 'Pending');
            case 1: return 'Paid';
            case 2: return 'Denied';
            case 3: return 'Cancelled';
            default: return '';
        }
    }

    buildPagination() {
        if (this.resetPagination) {
            let state = store.getState();
            let {total_money_reqs, page_size} = state.pendingData;

            this.paginationObject = $(() => {
                $('#pending-pagination').pagination({
                    items: total_money_reqs,
                    itemsOnPage: page_size,
                    displayedPages: 3,
                    edges: 1,
                    onPageClick: this.loadData
                });
            });
        }
    }

    onApplicationStateChanged() {
        let state = store.getState();
        let data = state.pendingData;
        let type = state.lastAction.type;

        switch (type) {
            case PENDING.GET_MORE_REQUEST_SUCCESS:
                this.buildPagination();
                this.money_requests = data.money_requests;
                this.tabs = data.tabs;
                break;
            case PENDING.SET_ACTIVE_TAB:
                let activeTab = data.tabs.filter((tab) => {
                    return tab.isActive;
                })[0];

                let type = activeTab ? activeTab.id : TAB.INCOMING;
                this.currentActiveTabId = type;
                this.loadData();
            case PENDING.MARK_CANCELLED_MONEY_REQUESTS_SUCCESS:
            case PENDING.MARK_SENT_MONEY_REQUESTS_SUCCESS:
            case PENDING.MARK_REJECTED_MONEY_REQUESTS_SUCCESS:
                this.loadData();
                break;
            case COMMON.NEED_UPDATE_PENDING_REQUEST:
                this.updateAll();
                break;
            case PENDING.NEED_UPDATE_PENDING_REQUESTS:
                this.timeZone = state.userData.user.timezone;
                this.initDatePickers(false);
                this.updateAll();
                break;
            default:
                break;
        }

        this.update();
    }

    loadData = (pageNumber?, event?) => {
        if (!pageNumber) {
            this.resetPagination = true;
            pageNumber = 1;
        } else {
            this.resetPagination = false;
        }

        let data = store.getState().pendingData;

        let pageSize = data.page_size;
        let fromDateTmp = this.fromDateObject.datepicker('getDate');
        let fromDate = new Date(fromDateTmp.setHours(0, 0, 0, 0)).toISOString();
        let toDateTmp = this.toDateObject.datepicker('getDate');
        let toDate = new Date(toDateTmp.setHours(23, 59, 59, 999)).toISOString();

        let pageSettings = {
            type: this.currentActiveTabId,
            date_from: fromDate,
            date_to: toDate,
            start: (pageNumber - 1) * pageSize,
            size: pageSize,
            status: [0]
        };

        store.dispatch(pendingActions.getMoreRequest(pageSettings));
    }

    onShowButtonClick(event: Event) {
        this.loadData();
    }

    onShowAllButtonClick(event: Event) {
        this.initDatePickers(true);
        this.loadData();
    }

    onTabItemClick(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();
        store.dispatch(pendingActions.setActiveTab(event.item.tabItem.id));
    }

    acceptRequest(event: FCEvent) {
        riot.mount('#confirm-send', 'accept-money-request', {
            uid: event.item.sender,
            amount: event.item.amount,
            receive_id: event.item.id,
            sender_email: event.item.sender_email
        });
    }

    rejectRequest(event: FCEvent) {
        riot.mount('#confirm-send', 'reject-money-request', {
            request_id: event.item.id,
            sender: event.item.sender_email,
            sendAddr: {
                profile_pic_url: event.item.sender_profile_pic_url,
                display_name: event.item.sender_display_name,
                username: event.item.sender,
                email: event.item.sender_email
            }
        });
    }

    cancelRequest(event: FCEvent) {
        riot.mount('#confirm-send', 'confirm-dialog', {
            title: 'Cancel request',
            message: 'Are you sure you want to cancel this request?',
            callback: function (result) {

                if (result) {
                    let criteria = {
                        request_id: event.item.id,
                        receiver_bare_uid: event.item.receiver_email
                    }

                    store.dispatch(pendingActions.markCancelledMoneyRequests(criteria));
                }
            }
        });
    }

    getAvatarURL(profilePicURL) {
        if (profilePicURL) {
            return this.AvatarServer + profilePicURL;
        } else {
            return 'assets/images/pages/coin.png';
        }
    }

    showDetail(event: FCEvent) {
        let acceptCb = () => {
            this.acceptRequest(event);
        }

        let rejectCb = () => {
            this.rejectRequest(event);
        }

        let cancelCb = () => {
            this.cancelRequest(event);
        }

        let opts = {
            detail: event.item,
            pendingRequestStatus: this.getPendingRequestStatus(event.item.status, event.item.type),
            cancelCb,
            acceptCb,
            rejectCb
        }

        riot.mount('#transaction-detail', 'request-detail', opts);
    }
}
