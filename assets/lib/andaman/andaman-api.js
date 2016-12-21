/**
 * Created by sontt on 8/24/15.
 */
const Event = require('./def/evt').Event;
const Err = require('./def/evt').Err;

var internals = {};
module.exports = internals.API = function () {

};

internals.API.prototype.signup = function (pipe, account, cb) {
	pipe.emit(Event.CREATE_ACCOUNT, account);
	pipe.once(Event.CREATE_ACCOUNT_ACK, cb);
};

/**
 *
 * @param pipe
 * @param account: email, name, callback_link, appId (unity or bnp), g_recaptcha_response
 * @param cb
 */
internals.API.prototype.create_account_easy = function (pipe, account, cb) {
	pipe.emit(Event.CREATE_ACCOUNT_EASY, account);
	pipe.once(Event.CREATE_ACCOUNT_EASY_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: password, token, privateKey, publicKey
 * @param {Function} cb: function(resp){}, resp -> {rc, profile}, profile -> {idToken}
 */
internals.API.prototype.set_password = function (pipe, request, cb) {
	pipe.emit(Event.SET_PASSWORD, request);
	pipe.once(Event.SET_PASSWORD_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: idToken, sc1, sc2, sc3
 * @param {Function} cb: function(resp){}, resp -> {rc}
 */
internals.API.prototype.set_recovery_keys = function (pipe, request, cb) {
	pipe.emit(Event.SSO_SET_RECOVERY_KEYS, request);
	pipe.once(Event.SSO_SET_RECOVERY_KEYS_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: idToken
 * @param {Function} cb: function(resp) {}, resp -> {rc, keys}
 */
internals.API.prototype.get_recovery_keys = function (pipe, request, cb) {
	pipe.emit(Event.SSO_GET_RECOVERY_KEYS, request);
	pipe.once(Event.SSO_GET_RECOVERY_KEYS_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: pin
 * @param cb
 * CHECK_PIN: 315, CHECK_PIN_ACK: 316,
 */
internals.API.prototype.check_pin = function (pipe, request, cb) {
	pipe.emit(Event.CHECK_PIN, request);
	pipe.once(Event.CHECK_PIN_ACK, cb);
};

/**
 *
 * @param pipe
 * @param account: email, password, name
 * @param {Function} cb: function(resp){} resp -> {rc, idToken}
 * SSO_SIGNUP: 301, SSO_SIGNUP_ACK: 302
 */
internals.API.prototype.sso_signup = function (pipe, account, cb) {
	pipe.emit(Event.SSO_SIGNUP, account);
	pipe.once(Event.SSO_SIGNUP_ACK, cb);
};

internals.API.prototype.login = function (pipe, credentials, cb) {
	pipe.emit(Event.LOGIN, credentials);
	pipe.once(Event.LOGIN_ACK, cb);
};

/**
 *
 * @param pipe
 * @param credentials: email, password, res
 * @param {Function} cb: function(resp){}, resp -> {rc, profile}, profile -> {sessionToken, idToken}
 */
internals.API.prototype.sso_login_v2 = function (pipe, credentials, cb) {
	pipe.emit(Event.SSO_LOGIN_V2, credentials);
	pipe.once(Event.SSO_LOGIN_V2_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: email
 * @param cb
 * PREPARE_UPGRADE_UNITY: 313, PREPARE_UPGRADE_UNITY_ACK: 314,
 */
internals.API.prototype.prepare_upgrade_unity = function (pipe, request, cb) {
	pipe.emit(Event.PREPARE_UPGRADE_UNITY, request);
	pipe.once(Event.PREPARE_UPGRADE_UNITY_ACK, cb);
};


/**
 *
 * @param pipe
 * @param {Object} request: idToken, res (resource of the client e.g 'web')
 * @param {Function} cb: function(resp){}, resp -> {rc, profile}, profile -> {sessionToken}
 */
internals.API.prototype.get_session_token = function (pipe, request, cb) {
	pipe.emit(Event.SSO_GET_SESSION_TOKEN, request);
	pipe.once(Event.SSO_GET_SESSION_TOKEN_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: sessionToken, res
 * @param {Function} cb: function(resp){}, resp -> {rc, profile}; rc = 404 if token is invalid
 */
internals.API.prototype.check_session_token = function (pipe, request, cb) {
	pipe.emit(Event.SSO_CHECK_SESSION_TOKEN, request);
	pipe.once(Event.SSO_CHECK_SESSION_TOKEN_ACK, cb);
};

internals.API.prototype.logout = function (pipe, cb) {
	pipe.emit(Event.LOGOUT);
	pipe.once(Event.LOGOUT_ACK, cb);
};

internals.API.prototype.update_profile = function (pipe, account, cb) {
	pipe.emit(Event.UPDATE_ACCOUNT, account);
	pipe.once(Event.UPDATE_ACCOUNT_ACK, cb);
};

internals.API.prototype.get_profile = function (pipe, request, cb) {
	pipe.emit(Event.GET_PROFILE, request);
	pipe.once(Event.GET_PROFILE_ACK, cb);
};

internals.API.prototype.upload_profile_pic = function (pipe, file, p_cb, cb) {
	var ctx = {};
	ctx.file_name = file.name;
	ctx.size = file.size;
	ctx.event = Event.UPLOAD_PROFILE_PIC;

	send_file(pipe, ctx, file, p_cb, function () {
		//console.log('Sent the profile pic ');
		// Listen in on the callback.
		pipe.once(Event.UPLOAD_PROFILE_PIC_ACK, cb);
	});
};

function send_file(pipe, ctx, file, p_cb, cb) {
	var size = 48 * 1024;
	pipe.sendfile(ctx, file, function (err, percent) {
		if (err === Err.ok) {
			//console.log('xfer complete');
			cb(null);
		} else if (err === Err.again) {
			//console.log('continuing...');
			p_cb(percent)
		} else if (err) {
			//console.log('xfer error', err);
			cb(err);
		}
	}, size);
}

/**
 *
 * @param pipe
 * @param request: idToken
 * @param {Function} cb: function(resp){}, resp -> {rc, wallet}, wallet -> {secret}
 */
internals.API.prototype.get_wallet_secret = function (pipe, request, cb) {
	pipe.emit(Event.GET_WALLET_SECRET, request);
	pipe.once(Event.GET_WALLET_SECRET_ACK, cb);
};

internals.API.prototype.send_verify_email = function (pipe, request, cb) {
	pipe.emit(Event.SEND_VERIF_EMAIL, request);
	pipe.once(Event.SEND_VERIF_EMAIL_ACK, cb);
};

internals.API.prototype.verify_email = function (pipe, request, cb) {
	pipe.emit(Event.VERIFY_EMAIL, request);
	pipe.once(Event.VERIFY_EMAIL_ACK, cb);
};

internals.API.prototype.check_email_in_use = function (pipe, request, cb) {
	pipe.emit(Event.CHECK_EMAIL_IN_USE, request);
	pipe.once(Event.CHECK_EMAIL_IN_USE_ACK, cb);
};

internals.API.prototype.check_phone_number_in_use = function (pipe, request, cb) {
	pipe.emit(Event.CHECK_PHONE_NUMBER_IN_USE, request);
	pipe.once(Event.CHECK_PHONE_NUMBER_IN_USE_ACK, cb);
};

// keys api
internals.API.prototype.search_wallet = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_SEARCH_WALLET, criteria);
	pipe.once(Event.KEYS_SEARCH_WALLET_ACK, cb);
};

internals.API.prototype.get_recv_money_req_by_id = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_RECV_MONEY_REQ_BY_ID, criteria);
	pipe.once(Event.KEYS_GET_RECV_MONEY_REQ_BY_ID_ACK, cb);
};

internals.API.prototype.get_requests = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_REQS, criteria);
	pipe.once(Event.KEYS_GET_REQS_ACK, cb);
};

internals.API.prototype.update_wallet_balance = function (pipe, balance_info, cb) {
	pipe.emit(Event.KEYS_UPDATE_WALLET_BALANCE, balance_info);
	pipe.once(Event.KEYS_UPDATE_WALLET_BALANCE_ACK, cb);
};

internals.API.prototype.get_txns = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_TXN, criteria);
	pipe.once(Event.KEYS_GET_TXN_ACK, cb);
};

/**
 *
 * @param pipe
 * @param criteria: transaction_id
 * @param {Function} cb: function(resp){}, resp = {rc, transaction}
 */
internals.API.prototype.get_txn_by_id = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_TXN_BY_ID, criteria);
	pipe.once(Event.KEYS_GET_TXN_BY_ID_ACK, cb);
};

internals.API.prototype.get_sent_txns = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_SENT_TXN, criteria);
	pipe.once(Event.KEYS_GET_SENT_TXN_ACK, cb);
};

internals.API.prototype.get_recv_txns = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_RECV_TXN, criteria);
	pipe.once(Event.KEYS_GET_RECV_TXN_ACK, cb);
};

internals.API.prototype.add_txn = function (pipe, txn_info, cb) {
	pipe.emit(Event.KEYS_ADD_TXN_LOG, txn_info);
	pipe.once(Event.KEYS_ADD_TXN_LOG_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request
 * @param {string} request.sessionToken
 * @param cb
 */
internals.API.prototype.get_my_wallets = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_GET_MY_WALLETS, request);
	pipe.once(Event.KEYS_GET_MY_WALLETS_ACK, cb);
};

internals.API.prototype.send_verification_sms = function (pipe, request, cb) {
	pipe.emit(Event.SEND_VERIF_SMS, request);
	pipe.once(Event.SEND_VERIF_SMS_ACK, cb);
};

/**
 * @param: to, amount, note, bare_uid
 */
internals.API.prototype.request_money = function (pipe, request, callback) {
	pipe.emit(Event.KEYS_ADD_MONEY_REQ, request);
	pipe.once(Event.KEYS_ADD_MONEY_REQ_ACK, callback);
};

internals.API.prototype.mark_sent_money_requests = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_MARK_SENT_MONEY_REQ, request);
	pipe.once(Event.KEYS_MARK_SENT_MONEY_REQ_ACK, cb);
};

internals.API.prototype.mark_rejected_money_requests = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_MARK_REJECTED_MONEY_REQ, criteria);
	pipe.once(Event.KEYS_MARK_REJECTED_MONEY_REQ_ACK, cb);
};

internals.API.prototype.mark_cancelled_money_requests = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_MARK_CANCELLED_MONEY_REQ, criteria);
	pipe.once(Event.KEYS_MARK_CANCELLED_MONEY_REQ_ACK, cb);
};

internals.API.prototype.mark_read_money_requests = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_MARK_READ_MONEY_REQ, criteria);
	pipe.once(Event.KEYS_MARK_READ_MONEY_REQ_ACK, cb);
};

internals.API.prototype.get_roster = function (pipe, criteria, cb) {
	pipe.emit(Event.ROS_GET, criteria);
	pipe.once(Event.ROS_GET_ACK, cb);
};

internals.API.prototype.add_contact = function (pipe, criteria, cb) {
	pipe.emit(Event.ROS_ADD, criteria);
	pipe.once(Event.ROS_ADD_ACK, cb);
};

internals.API.prototype.remove_contact = function (pipe, criteria, cb) {
	criteria.op = 3;
	pipe.emit(Event.ROS_OP, criteria);
	pipe.once(Event.ROS_OP_ACK, cb);
};


internals.API.prototype.store_wallet_data = function (pipe, request, cb) {
	pipe.emit(Event.CL_STORE_WALLET_DATA, request);
	pipe.once(Event.CL_STORE_WALLET_DATA_ACK, cb);
};

internals.API.prototype.restore_wallet_data = function (pipe, request, cb) {
	pipe.emit(Event.CL_RESTORE_WALLET_DATA, request);
	pipe.once(Event.CL_RESTORE_WALLET_DATA_ACK, cb);
};

internals.API.prototype.create_wallet = function (pipe, wallet, cb) {
	pipe.emit(Event.KEYS_CREATE_WALLET, wallet);
	pipe.once(Event.KEYS_CREATE_WALLET_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: wallet_secret, idToken, appId (safecash -> unity, bnb -> bnb)
 * @param cb: function(resp){}, resp -> {rc, wallet}, wallet -> {passphrase, currency_type, wallet_id, address, label}
 * KEYS_CREATE_UNITY_WALLET: 1028, KEYS_CREATE_UNITY_WALLET_ACK: 1528,
 */
internals.API.prototype.create_unity_wallet = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_CREATE_UNITY_WALLET, request);
	pipe.once(Event.KEYS_CREATE_UNITY_WALLET_ACK, cb);
};

internals.API.prototype.add_wallet_address = function (pipe, addr_info, cb) {
	pipe.emit(Event.KEYS_ADD_WALLET_ADDRESS, addr_info);
	pipe.once(Event.KEYS_ADD_WALLET_ADDRESS_ACK, cb);
};

internals.API.prototype.create_wallet_and_address = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_CREATE_WALLET_AND_ADDRESS, request);
	pipe.once(Event.KEYS_CREATE_WALLET_AND_ADDRESS_ACK, cb);
};

internals.API.prototype.get_txns_by_contact = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_TXN_BY_CONTACT, criteria);
	pipe.once(Event.KEYS_GET_TXN_BY_CONTACT_ACK, cb);
};

internals.API.prototype.get_money_requests = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_RECV_MONEY_REQ, criteria);
	pipe.once(Event.KEYS_GET_RECV_MONEY_REQ_ACK, cb);
};

internals.API.prototype.get_sent_money_requests = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_SENT_MONEY_REQ, criteria);
	pipe.once(Event.KEYS_GET_SENT_MONEY_REQ_ACK, cb);
};

internals.API.prototype.get_wallets_by_email = function (pipe, criteria, cb) {
	pipe.emit(Event.KEYS_GET_WALLET_BY_EMAIL, criteria);
	pipe.once(Event.KEYS_GET_WALLET_BY_EMAIL_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: from_address, to_address, amount, message
 * @param {Function} cb: function(resp){}, where resp -> {rc, transaction}, transaction -> {txid, rawtx}
 * const: KEYS_CREATE_USN_RAW_TXN: 1031, KEYS_CREATE_USN_RAW_TXN_ACK: 1032,
 */
internals.API.prototype.create_unsigned_raw_txn = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_CREATE_USN_RAW_TXN, request);
	pipe.once(Event.KEYS_CREATE_USN_RAW_TXN_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: transaction_id
 * @param {Function} cb: function(resp){}, where resp -> {rc, transaction}, transaction -> data from blockchain
 * const: KEYS_GET_TXN_DETAILS: 1033, KEYS_GET_TXN_DETAILS_ACK: 1034,
 */
internals.API.prototype.get_txn_details = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_GET_TXN_DETAILS, request);
	pipe.once(Event.KEYS_GET_TXN_DETAILS_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: {}
 * @param {Function} cb: function(resp){}, where resp -> {rc, balance}
 * const: KEYS_GET_BALANCE: 1035, KEYS_GET_BALANCE_ACK: 1036,
 */
internals.API.prototype.get_balance = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_GET_BALANCE, request);
	pipe.once(Event.KEYS_GET_BALANCE_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: idToken
 * @param {Function} cb: function(resp) {}, resp -> {rc, keypair}
 */
internals.API.prototype.sso_get_keypair = function (pipe, request, cb) {
	pipe.emit(Event.SSO_GET_KEYPAIR, request);
	pipe.once(Event.SSO_GET_KEYPAIR_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: idToken, password, newPassword, newPrivateKey
 * @param cb
 */
internals.API.prototype.sso_change_password = function (pipe, request, cb) {
	pipe.emit(Event.SSO_CHANGE_PASSWORD, request);
	pipe.once(Event.SSO_CHANGE_PASSWORD_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request:{sessionToken}
 * @param cb
 */
internals.API.prototype.start_tfa_code = function (pipe, request, cb) {
	pipe.emit(Event.START_TFA_CODE, request);
	pipe.once(Event.START_TFA_CODE_ACK, cb);
};

internals.API.prototype.turn_off_tfa = function (pipe, request, cb) {
	pipe.emit(Event.TURN_OFF_TFA, request);
	pipe.once(Event.TURN_OFF_TFA_ACK, cb);
};

internals.API.prototype.confirm_tfa_code = function (pipe, request, cb) {
	pipe.emit(Event.CONFIRM_TFA_CODE, request);
	pipe.once(Event.CONFIRM_TFA_CODE_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: idToken, code
 * @param cb
 */
internals.API.prototype.check_tfa_code = function (pipe, request, cb) {
	pipe.emit(Event.CHECK_TFA_CODE, request);
	pipe.once(Event.CHECK_TFA_CODE_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: password, token, privateKey, publicKey
 * @param cb
 */
internals.API.prototype.set_password_v2 = function (pipe, request, cb) {
	pipe.emit(Event.SSO_SET_PASSWORD_V2, request);
	pipe.once(Event.SSO_SET_PASSWORD_V2_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: idToken, sessionToken, domains (array of allowd domain), amount (Unity unit)
 * @param {Function} cb: function(resp){}, where resp -> {rc}
 * const: KEYS_FOUNTAIN_ENABLE: 1045, KEYS_FOUNTAIN_ENABLE_ACK: 1046,
 */
internals.API.prototype.enable_fountain = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_FOUNTAIN_ENABLE, request);
	pipe.once(Event.KEYS_FOUNTAIN_ENABLE_ACK, cb);
};

/**
 * @param pipe
 * @param {Object} request: sessionToken, fountainId, {Object} settings -> {amount, domains}
 * @param {Function} cb: function(resp) {}, where resp -> {rc}
 * const: KEYS_FOUNTAIN_UPDATE: 1051, KEYS_FOUNTAIN_UPDATE_ACK: 1052,
 */
internals.API.prototype.update_fountain = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_FOUNTAIN_UPDATE, request);
	pipe.once(Event.KEYS_FOUNTAIN_UPDATE_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: fountainId
 * @param {Function} cb: function(resp){}, where resp -> {rc}
 * const: KEYS_FOUNTAIN_DISABLE: 1047, KEYS_FOUNTAIN_DISABLE_ACK: 1048,
 */
internals.API.prototype.disable_fountain = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_FOUNTAIN_DISABLE, request);
	pipe.once(Event.KEYS_FOUNTAIN_DISABLE_ACK, cb);
};

/**
 *
 * @param pipe
 * @param {Object} request: {}
 * @param {Function} cb: function(resp){}, where resp -> {rc, fountain}
 * const: KEYS_FOUNTAIN_MY: 1049, KEYS_FOUNTAIN_MY_ACK: 1050,
 */
internals.API.prototype.get_my_fountain = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_FOUNTAIN_MY, request);
	pipe.once(Event.KEYS_FOUNTAIN_MY_ACK, cb);
};

internals.API.prototype.admin_get_signup_daily_stats = function (pipe, criteria, cb) {
	pipe.emit(Event.ADMIN_GET_SIGNUP_DAILY_STATS, criteria);
	pipe.once(Event.ADMIN_GET_SIGNUP_DAILY_STATS_ACK, cb);
};

/**
 *
 * @param pipe
 * @param request: sessionToken, publicKey, appId
 * @param cb
 */
internals.API.prototype.create_flash_wallet = function (pipe, request, cb) {
	pipe.emit(Event.KEYS_CREATE_FLASH_WALLET, request);
	pipe.once(Event.KEYS_CREATE_FLASH_WALLET_ACK, cb);
};

internals.API.prototype.add_to_roster = function (pipe, request, cb) {
	pipe.emit(Event.ROS_ADD, request);
	pipe.once(Event.ROS_ADD_ACK, cb);
};

internals.API.prototype.send_request = function (pipe, email, cb) {
	var op = {
		op: ROSTER_OP.REQUEST,
		to: email
	};
	pipe.emit(Event.ROS_OP, op);
	pipe.once(Event.ROS_OP_ACK, cb);
};

internals.API.prototype.remove_user = function (pipe, email, cb) {
	var op = {
		op: ROSTER_OP.REMOVE,
		to: email
	};
	pipe.emit(Event.ROS_OP, op);
	pipe.once(Event.ROS_OP_ACK, cb);
};

internals.API.prototype.get_users_by_uid = function (pipe, request, cb) {
	pipe.emit(Event.GET_USERS_BY_UID, request);
	pipe.once(Event.GET_USERS_BY_UID_ACK, cb);
};

internals.API.prototype.sso_reset_password = function (pipe, request, cb) {
	pipe.emit(Event.SSO_RESET_PASSWORD, request);
	pipe.once(Event.SSO_RESET_PASSWORD_ACK, cb);
};

internals.API.prototype.sso_reset_password_mail = function (pipe, request, cb) {
	pipe.emit(Event.SSO_RESET_PASSWORD_MAIL, request);
	pipe.once(Event.SSO_RESET_PASSWORD_MAIL_ACK, cb);
};

internals.API.prototype.verify_phone = function (pipe, request, cb) {
	pipe.emit(Event.VERIFY_PHONE, request);
	pipe.once(Event.VERIFY_PHONE_ACK, cb);
};

internals.API.prototype.send_verification_sms = function (pipe, request, cb) {
	pipe.emit(Event.SEND_VERIF_SMS, request);
	pipe.once(Event.SEND_VERIF_SMS_ACK, cb);
};

internals.API.prototype._on = function (pipe, ev, cb) {
	// register for the event
	var listener;
	if (ev && cb) {
		listener = function () {
			//console.log('Andaman resp received for  - ', ev, ' resp ', JSON.stringify(arguments));
			// remove timer
			if (arguments.length > 0) {
				cb.apply(this, arguments);
			} else {
				cb();
			}
		};

		pipe.on(ev, listener);
	}
};

// Listen to server events
internals.API.prototype.add_session_invalid_listener = function (pipe, callback) {
	pipe.removeAllListeners(Event.SESSION_INVALID);
	pipe.on(Event.SESSION_INVALID, callback);
};

internals.API.prototype.add_listener_add_txn = function (pipe, callback) {
	pipe.removeAllListeners(Event.KEYS_ADD_TXN_LOG_RECV);
	pipe.on(Event.KEYS_ADD_TXN_LOG_RECV, callback);
};

internals.API.prototype.add_listener_request_money = function (pipe, callback) {
	pipe.removeAllListeners(Event.KEYS_ADD_MONEY_REQ_RECV);
	pipe.on(Event.KEYS_ADD_MONEY_REQ_RECV, callback);
};

internals.API.prototype.add_listener_mark_money_requests = function (pipe, callback) {
	pipe.removeAllListeners(Event.KEYS_MARK_MONEY_REQ_RECV);
	pipe.on(Event.KEYS_MARK_MONEY_REQ_RECV, callback);
};

internals.API.prototype.remove_all_listeners = function (pipe) {
	pipe.removeAllListeners(Event.SESSION_INVALID);
	pipe.removeAllListeners(Event.KEYS_ADD_TXN_LOG_RECV);
	pipe.removeAllListeners(Event.KEYS_ADD_MONEY_REQ_RECV);
	pipe.removeAllListeners(Event.KEYS_MARK_MONEY_REQ_RECV);
};

//Listen to local events
internals.API.prototype.add_disconnect_status_listener = function (pipe, callback) {
	pipe.removeAllListeners('disconnect');
	pipe.on('disconnect', callback);
};

internals.API.prototype.add_connect_status_listener = function (pipe, callback) {
	pipe.removeAllListeners('connect');
	pipe.on('connect', callback);
};

var ROSTER_OP = {
	REQUEST: 1,
	APPROVE: 2,
	REMOVE: 3,
	BLOCK: 4,
	UNBLOCK: 5,
	EDIT_ALIAS: 6 // Set user alias
};