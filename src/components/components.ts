import { riot, template, Element } from './riot-ts';

import LandingPage from './landing-page/landing-page';
import Home from './home/index';
import HomeHeader from './home/header';
import LoadingIndicator from './loading-indicator/loading-indicator';
import TransactionDetails from './modals/transaction-details/transaction-details';
import App from './app/app';
import SubmitEmail from './reset-pass/submit-email';
import ErrorAlert from './modals/error-alert/error-alert';
import SendMoneyConfirm from './modals/send-money-confirm/send-money-confirm';
import SendRequestConfirm from './modals/send-request-confirm/send-request-confirm';

export { LoadingIndicator, TransactionDetails, LandingPage, Home, HomeHeader, App, SubmitEmail, ErrorAlert, SendMoneyConfirm, SendRequestConfirm };

export function initialize() {
    riot.mount('app');
}


