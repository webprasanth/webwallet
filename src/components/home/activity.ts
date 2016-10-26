import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import { activityActions } from '../../model/activities/actions';
import { ACTIVITIES } from '../../model/action-types';
import HomeActivityTemplate from './activity.html!text';
import { getDisplayDate } from '../../model/utils';
import { FCEvent } from '../../model/types';

@template(HomeActivityTemplate)
export default class HomeActivity extends Element {
    private fromDateObject = null;
    private toDateObject = null;
    private paginationObject = null;
    /**
     * flag for reset Pagination
     * + equal true when change Tab or reload data
     * + equal false when navigate to another page
     */
    private resetPagination = false;
    private currentActiveTabId = 0;

    private DATE_PICKER_FORMAT: string = "M dd, yyyy";
    private ONE_MONTH: number = 30 * 24 * 60 * 60 * 1000;
    private timeZone = null;

    public txns = [];
    public tabs = store.getState().activityData.tabs;

    constructor() {
        super();
    }

    mounted() {
        var state = store.getState();
        this.timeZone = state.userData.user.timezone;
        store.subscribe(this.onApplicationStateChanged.bind(this));
        this.initDatePickers();
        this.loadTxns();
    }

    unmounted() {
        this.fromDateObject = null;
        this.toDateObject = null;
        this.paginationObject = null;
    }

    initDatePickers() {
        var state = store.getState();
        if (!this.fromDateObject) {
            this.fromDateObject = $("#fromDate").parent().datepicker({
                format: this.DATE_PICKER_FORMAT,
                autoclose: true
            });
        }

        if (!this.toDateObject) {
            this.toDateObject = $("#toDate").parent().datepicker({
                format: this.DATE_PICKER_FORMAT,
                autoclose: true
            });
        }

        this.fromDateObject.datepicker('setDate', new Date(state.userData.user.created_ts));
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

    buildPagination() {
        var state = store.getState();
        var {total_txns, page_size} = state.activityData;
        if (this.resetPagination) {
            this.paginationObject = $(() => {
                $('.txn-pagination').pagination({
                    items: total_txns,
                    itemsOnPage: page_size,
                    cssStyle: 'light-theme',
                    onPageClick: this.loadTxns
                });
            });
        }
    }

    loadTxns = (pageNumber?, event?) => {
        if (!pageNumber) {
            this.resetPagination = true;
            pageNumber = 1;
        } else {
            this.resetPagination = false;
        }
        var data = store.getState().activityData;

        var pageSize = data.page_size;
        let fromDateTmp = this.fromDateObject.datepicker('getDate');
        let fromDate = new Date(fromDateTmp.setHours(0, 0, 0, 0)).toISOString();
        let toDateTmp = this.toDateObject.datepicker('getDate');
        let toDate = new Date(toDateTmp.setHours(23, 59, 59, 999)).toISOString();

        var pageSettings = {
            type: this.currentActiveTabId,
            date_from: fromDate,
            date_to: toDate,
            start: (pageNumber - 1) * pageSize,
            size: pageSize,
            order: 'desc'
        };

        store.dispatch(activityActions.getMoreTxns(pageSettings));
    }

    onApplicationStateChanged() {
        var state = store.getState();
        var data = state.activityData;
        var type = state.lastAction.type;

        if (type == ACTIVITIES.GET_MORE_TXN_SUCCESS) {
            this.buildPagination();
            this.txns = data.txns;
            this.tabs = data.tabs;
        } else if (type == ACTIVITIES.SET_ACTIVE_TAB) {
            let activeTab = data.tabs.filter((tab) => {
                return tab.isActive;
            })[0];
            let type = activeTab ? activeTab.id : 0;
            this.currentActiveTabId = type;
            this.loadTxns();
        } else if (type == ACTIVITIES.GET_TXN_DETAIL_SUCCESS) {
            riot.mount('#transaction-detail', 'transaction-details');
        }
        this.update();
    }

    getDisplayDate = getDisplayDate;

    onShowButtonClick(event: Event) {
        this.loadTxns();
    }

    onShowAllButtonClick(event: Event) {
        this.initDatePickers();
        this.loadTxns();
    }

    onTabItemClick(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();
        store.dispatch(activityActions.setActiveTab(event.item.tabItem.id));
    }

    showTransactionDetail(event: FCEvent) {
        event.preventDefault();
        event.stopPropagation();

        let state = store.getState();
        store.dispatch(activityActions.getTransactionDetail(event.item.txn));
    }
}
