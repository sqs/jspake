"use strict";
/*jslint indent: 2, bitwise: false, nomen: false, plusplus: false, white: false, regexp: false */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/ctypes.jsm");
const pake_info_t_ptr = ctypes.voidptr_t; //new ctypes.PointerType("struct_pake_info");
const EC_POINT_t_ptr = ctypes.voidptr_t;


var pake = {};

pake.client = function() {
    this._username = null;
    this._realm = null;
    this._password = null;

    let lib = ctypes.open("/home/sqs/src/pake/libpake.so");

    /* declare function prototypes */
    this._pake_client_new =
        lib.declare("pake_client_new",
                    ctypes.default_abi,
                    pake_info_t_ptr);

    this._pake_client_init = 
        lib.declare("pake_client_init",
                    ctypes.default_abi,
                    ctypes.int,
                    pake_info_t_ptr);

    this._pake_client_set_credentials = 
        lib.declare("pake_client_set_credentials",
                    ctypes.default_abi,
                    ctypes.int,
                    pake_info_t_ptr,
                    ctypes.char.ptr,
                    ctypes.char.ptr,
                    ctypes.char.ptr);

    this._pake_client_recv_Y_string = 
        lib.declare("pake_client_recv_Y_string",
                    ctypes.default_abi,
                    ctypes.int,
                    pake_info_t_ptr,
                    ctypes.char.ptr);

    this._tcpcrypt_pake_compute_respc = 
        lib.declare("tcpcrypt_pake_compute_respc",
                    ctypes.default_abi,
                    ctypes.char.ptr,
                    pake_info_t_ptr,
                    ctypes.unsigned_long);

    this._debug_pake_info = 
        lib.declare("debug_pake_info",
                    ctypes.default_abi,
                    ctypes.void_t,
                    pake_info_t_ptr);
    
    this._p = this._pake_client_new();
    this._pake_client_init(this._p);
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
        this._pake_client_set_credentials(this._p, this._username,
                                          this._realm, this._password);
    },

    /**
     * @return {int} success
     */
    recv_Y:function (server_Y_string) {
        return this._pake_client_recv_Y_string(this._p, server_Y_string);
    },
    
    /**
     * @return {String} respc
     */
    compute_respc:function (tcpcrypt_sid) {
        return this._tcpcrypt_pake_compute_respc(this._p, tcpcrypt_sid);
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
        this._debug_pake_info(this._p);
    },


    /*************************************************************************/
    _compute_h:function () {

    },
};
