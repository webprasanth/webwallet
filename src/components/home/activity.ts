import { riot, template, Element } from '../riot-ts';
import store, { ApplicationState } from '../../model/store';
import { activityActions } from '../../model/activities/actions';
import { ACTIVITIES } from '../../model/action-types';
import HomeActivityTemplate from './activity.html!text';
import {getDisplayDate} from '../../model/utils';

@template(HomeActivityTemplate)
export default class HomeActivity extends Element {
    private fromDateObject = null;
    private toDateObject = null;
    private paginationObject;
    private pageIndex = 0;

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
        UIkit.ready(() => {
            this.loadTxns();
        });
    }

    unmounted() {
        this.fromDateObject = null;
        this.toDateObject = null;
        this.paginationObject = null;
    }

    initDatePickers() {
        var state = store.getState();

        // var fromDateInput = this.root.querySelector('.activity-from-date');
        // var toDateInput = this.root.querySelector('.activity-to-date');

        //var dateOpts = { format: this.DATE_PICKER_FORMAT };

        //var moment = UIkit.Utils.moment;
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
        var pagination = this.paginationObject;

        if (!pagination) {
            var paginationEl = this.root.querySelector('.txn-pagination');
            pagination = UIkit.pagination(paginationEl, { items: total_txns, itemsOnPage: page_size, currentPage: this.pageIndex });
            pagination.on('select.uk.pagination', (e, pageIndex) => {
                this.pageIndex = pageIndex;
                this.loadTxns();
            });
            this.paginationObject = pagination;
        }
        else {
            var opts = pagination.options;
            if (opts.items != total_txns || opts.itemsOnPage != page_size) {
                opts.items = total_txns;
                opts.itemsOnPage = page_size;

                var pages = Math.ceil(opts.items / opts.itemsOnPage);
                pagination.render(pages);
            }
        }
    }

    loadTxns() {
        var data = store.getState().activityData;

        var pageSize = data.page_size;
        var fromDate = this.fromDateObject.datepicker('getDate').toISOString();
        var toDate = this.toDateObject.datepicker('getDate').toISOString();

        var activeTab = data.tabs.filter((tab) => {
            return tab.isActive;
        })[0];
        var type = activeTab ? activeTab.id : 0;

        var pageSettings = {
            type: type,
            date_from: fromDate,
            date_to: toDate,
            start: this.pageIndex * pageSize,
            size: pageSize,
            order: 'desc'
        };

        store.dispatch(activityActions.getMoreTxns(pageSettings));
    }

    reloadTxns() {
        this.pageIndex = 0;

        var state = store.getState();
        var {total_txns, page_size} = state.activityData;

        var pagination = this.paginationObject;
        var opts = pagination.options;
        opts.items = total_txns;
        opts.itemsOnPage = page_size;

        var pages = Math.ceil(opts.items / opts.itemsOnPage);

        pagination.selectPage(this.pageIndex, pages);
    }

    onApplicationStateChanged() {
        var state = store.getState();
        var data = state.activityData;
        var type = state.lastAction.type;

        if (type == ACTIVITIES.GET_MORE_TXN_SUCCESS) {
            this.buildPagination();
            this.txns = data.txns;
            this.tabs = data.tabs;
        } else if (type == ACTIVITIES.GET_TXN_DETAIL_SUCCESS) {
            riot.mount('#transaction-detail', 'transaction-details');
        }
        this.update();
    }

    getDisplayDate = getDisplayDate;

    onShowButtonClick(event: Event) {
        this.reloadTxns();
    }

    onShowAllButtonClick(event: Event) {
        this.initDatePickers();
        this.reloadTxns();
    }

    onTabItemClick(event: Event1) {
        event.preventDefault();
        event.stopPropagation();

        store.dispatch(activityActions.setActiveTab(event.item.tabItem.id));
        this.reloadTxns();
    }

    showTransactionDetail(event: Event1) {
        event.preventDefault();
        event.stopPropagation();

        let state = store.getState();
        store.dispatch(activityActions.getTransactionDetail(event.item.txn));
    }
}

interface Event1 extends Event {
    item: any;
}
