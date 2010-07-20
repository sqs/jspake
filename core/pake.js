"use strict";
/*jslint indent: 2, bitwise: false, nomen: false, plusplus: false, white: false, regexp: false */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/ctypes.jsm");
const pake_info_t_ptr = ctypes.voidptr_t; //new ctypes.PointerType("struct_pake_info");


var pake = {};

pake.client = function() {
    this._username = null;
    this._realm = null;
    this._password = null;

    let lib = ctypes.open("/home/sqs/src/pake/libpake.so");

    this._pake_client_init = lib.declare("pake_client_new",
                                         ctypes.default_abi,
                                         pake_info_t_ptr);
    
    this._p = this._pake_client_init();
};

pake.client.prototype = {
    /**
     * Set auth credentials.
     * @param {String} username
     * @param {String} realm
     * @param {String} password
     * @return {void}
     */
    set_credentials:function (username, realm, password) {
        this._username = username;
        this._realm = realm;
        this._password = password;
    },

    /**
     * @return {void}
     */
    set_server_Y:function (server_Y) {
        
    },
    
    /**
     * @return {String} respc
     */
    compute_respc:function (tcpcrypt_sid) {

    },

    /**
     * @param {??} tcpcrypt_sid
     * @return {bool} True only if server_resps is valid.
     */
    check_resps:function (tcpcrypt_sid, server_resps) {

    },

    /**
     * Prints out a human-readable representation of this object's internal
     * state.
     * @return {void}
     */
    debug:function () {

    },


    /*************************************************************************/
    _compute_h:function () {

    },
};
