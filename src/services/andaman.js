var io = require('../../assets/lib/andaman/io/event-pipe-b');
//var Event = require('../../assets/lib/andaman/def/evt').Event;
var API = require('../../assets/lib/andaman/andaman-api');

var srv_pub_p = '5Jz3NhPHKUYP2JfU2n+xsT8Q5xC57yhhWa2Mdprva0A=';
var clt_pub_p = 'r4dHh2mSrijGSOK76k1DssBNcrjyGrV4LA9abowFTAk=';
var clt_priv_p = 'Uih8sq+XRSbQO4ySOs0a0WovV8YDdw28efPf+NPt9M4=';

var opts = {
    host: 'keys.flashcoin.io',
    proto: 'wss',
    port: 443,

    // TODO babv for testing only, remove when deploy to product
    proto: 'ws',
    port: 8098,
    
    server_publicKey: '5Jz3NhPHKUYP2JfU2n+xsT8Q5xC57yhhWa2Mdprva0A='
};

var readyPromise = null;
var isReady = false;
var andamanApi = new API();
var customEventPipe = {};

module.exports = {
    ready: function () {
        if (isReady) return Promise.resolve({ andaman: andamanApi, pipe: customEventPipe });
        if (readyPromise) return readyPromise;

        readyPromise = new Promise(function (resolve) {
            var buffer = new Buffer(2048);
            var eventPipe = io({
                host: opts.host,
                port: opts.port,
                proto: opts.proto,
                //namespace: 'simple',
                buf: buffer,
                server_publicKey: srv_pub_p,
                publicKey: clt_pub_p,
                secretKey: clt_priv_p,
            });

            customEventPipe.emit = function (e, payload) {
                payload.sessionToken = this.session_token;
                payload.auth_version = this.auth_version;
                eventPipe.emit(e, payload);
            };

            customEventPipe.once = function (e, fn) {
                eventPipe.once(e, fn);
            };

            customEventPipe.setAuthInfo = function (authVersion, sessionToken) {
                this.auth_version = authVersion;
                this.session_token = sessionToken;
            };

            eventPipe.on('connect', function () {
                //console.log(eventPipe.id, 'connected with the server');
                readyPromise = null;
                isReady = true;
                resolve({ andaman: andamanApi, pipe: customEventPipe });
            });
        });
        return readyPromise;
    },
    opts: opts
};