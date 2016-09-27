import {USERS} from '../action-types';
import {commonActions} from '../commons/actions';
import store from '../store';
import UserService from './user-service';
import {riot} from '../../components/ts/riot-ts';

export const userActions = {
    login(email, password) {
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().login(email, password).then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if(resp.rc === 1){
                    dispatch(userActions.loginSuccess(resp.profile));
                    dispatch(userActions.saveAccessToken());
                    dispatch(userActions.getProfile());
                }
                else {
                    dispatch(userActions.loginFailed(resp));
                }
            });
        };
    },
    loginFailed(error){
        return {type: USERS.LOGIN_FAILED, data: {error}};
    },
    loginSuccess(user){
        return {type: USERS.LOGIN_SUCCESS, data: user};
    },
    logout(){
        return (dispatch) => {
            dispatch(userActions.removeAccessToken());
            dispatch(userActions._logout());
        };
    },
    _logout(){
        return {type: USERS.LOGOUT};
    },
    getProfile(){
        return (dispatch) => {
            UserService.singleton().getProfile().then((resp: any) => {
                console.log('+++++ get_profile resp = ' + JSON.stringify(resp));

                if(resp.rc === 1){
                    dispatch(userActions.getProfileSuccess(resp.profile));
                }
                else {
                    dispatch(userActions.getProfileFailed(resp));
                }
            });
        };
    },
    getProfileSuccess(profile){
        return {type: USERS.GET_PROFILE_SUCCESS, data: profile};
    },
    getProfileFailed(resp){
        return {type: USERS.GET_PROFILE_FAILED, data: resp};
    },
    rememberMe(remember){
        return {type: USERS.REMEMBER_ME, data: remember};
    },
    ssoLogin(){
        return (dispatch) => {
            dispatch(commonActions.toggleLoading(true));

            UserService.singleton().ssoLogin().then((resp: any) => {
                dispatch(commonActions.toggleLoading(false));

                if(resp){
                    if(resp.rc == 1){
                        dispatch(userActions.ssoLoginSuccess(resp.profile));
                        dispatch(userActions.getProfile());
                    }
                    else {
                        dispatch(userActions.ssoLoginFailed(resp));
                    }
                }
            });
        };
    },
    ssoLoginSuccess(profile){
        return {type: USERS.SSO_LOGIN_SUCCESS, data: profile};
    },
    ssoLoginFailed(resp){
        return {type: USERS.SSO_LOGIN_FAILED, data: resp};
    },
    saveAccessToken(){
        var state = store.getState();
        var user = state.userData.user;

        if (user) localStorage.setItem('access_token', user.idToken);

        return {type: USERS.SAVE_ACCESS_TOKEN};
    },
    removeAccessToken(){
        localStorage.removeItem('access_token');

        return {type: USERS.REMOVE_ACCESS_TOKEN};
    },
    forgotPassword() {
        let clientHost = window.location.host;

        riot.route("reset_password?token=");
        return {type: USERS.FORGOT_PASSWORD};
    }
};
