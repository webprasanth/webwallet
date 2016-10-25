import { riot, template, Element } from './riot-ts';

import LandingPage from './landing-page/landing-page';
import Home from './home/index';
import HomeHeader from './home/header';
import LoadingIndicator from './loading-indicator/loading-indicator';
import TransactionDetails from './modals/transaction-details/transaction-details';
import App from './app/app';
import SubmitEmail from './reset-pass/submit-email';
import ProfileAvatar from './home/profile/avatar';
import UserInfo from './home/profile/user-info';
import AccountSetting from './home/profile/setting';
import FountainSetting from './home/profile/fountain';
import ErrorAlert from './modals/error-alert/error-alert';
import SendMoneyConfirm from './modals/send-money-confirm/send-money-confirm';
import SendRequestConfirm from './modals/send-request-confirm/send-request-confirm';
import AcceptMoneyRequest from './modals/accept-money-request/accept-money-request';
import RejectMoneyRequest from './modals/reject-money-request/reject-money-request';
import ConfirmDialog from './modals/confirm-dialog/confirm-dialog';
import ContactRequestMoney from './modals/contact-request-money/contact-request-money';
import ContactSendMoney from './modals/contact-send-money/contact-send-money';

export {
    LoadingIndicator, ProfileAvatar, UserInfo, AccountSetting, FountainSetting, TransactionDetails, LandingPage, Home, HomeHeader, App, SubmitEmail, ErrorAlert, SendMoneyConfirm, SendRequestConfirm,
    AcceptMoneyRequest, RejectMoneyRequest, ConfirmDialog, ContactRequestMoney, ContactSendMoney
};

export function initialize() {
    riot.mount('app');
}


