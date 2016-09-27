import {riot, template, Element} from './riot-ts';

import LandingPage from './landing-page/landing-page';
import Home from './home/index';
import HomeHeader from './home/header';
import LoadingIndicator from './loading-indicator/loading-indicator';
import App from './app/app';
import SubmitEmail from './reset-pass/submit-email';

export {LoadingIndicator, LandingPage, Home, HomeHeader, App, SubmitEmail};

export function initialize(){
    riot.mount('*');
}





