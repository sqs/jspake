"use strict";
/*jslint indent: 2, bitwise: false, nomen: false, plusplus: false, white: false, regexp: false */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/ctypes.jsm");


var pake = {};

pake.client = function() {

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

function addjs(a, b) {
    var lib = ctypes.open("/home/sqs/src/jspake/c/add.so"); 

    var addc = lib.declare("add",
                           ctypes.default_abi,
                           ctypes.int32_t, // return type
                           ctypes.int32_t, // arg1 type
                           ctypes.int32_t // arg2 type
                           );
    return addc(a, b);
}