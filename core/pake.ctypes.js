EXPORTED_SYMBOLS = ['pake'];

Components.utils.import("resource://gre/modules/ctypes.jsm");

const pake_info_t_ptr = ctypes.voidptr_t; //new ctypes.PointerType("struct_pake_info");
const BIGNUM_t_ptr = ctypes.char.ptr;
const EC_POINT_t_ptr = ctypes.char.ptr;


var pake = {};

pake = function(isclient) {
    this._username = null;
    this._realm = null;
    if (isclient) {
        this._password = null;
    } else {
        this._pi_0 = null;
        this._L = null;
    }

    let lib = ctypes.open("/home/sqs/src/ffpake/source/modules/ext/pake/libpake.so");

    /* declare function prototypes */
    this._pake_server_new =
        lib.declare("pake_server_new",
                    ctypes.default_abi,
                    pake_info_t_ptr);

    this._pake_server_init = 
        lib.declare("pake_server_init",
                    ctypes.default_abi,
                    ctypes.int,
                    pake_info_t_ptr,
                    BIGNUM_t_ptr);

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

    this._pake_server_set_credentials = 
        lib.declare("pake_server_set_credentials",
                    ctypes.default_abi,
                    ctypes.int,
                    pake_info_t_ptr,
                    ctypes.char.ptr,
                    ctypes.char.ptr,
                    BIGNUM_t_ptr,
                    EC_POINT_t_ptr);

    this._pake_server_get_Y_string = 
        lib.declare("pake_server_get_Y_string",
                    ctypes.default_abi,
                    ctypes.char.ptr,
                    pake_info_t_ptr);

    this._pake_client_get_X_string = 
        lib.declare("pake_client_get_X_string",
                    ctypes.default_abi,
                    ctypes.char.ptr,
                    pake_info_t_ptr);

    this._pake_client_recv_Y_string = 
        lib.declare("pake_client_recv_Y_string",
                    ctypes.default_abi,
                    ctypes.int,
                    pake_info_t_ptr,
                    ctypes.char.ptr);

    this._pake_server_recv_X_string = 
        lib.declare("pake_server_recv_X_string",
                    ctypes.default_abi,
                    ctypes.int,
                    pake_info_t_ptr,
                    ctypes.char.ptr);

    this._tcpcrypt_pake_compute_resps = 
        lib.declare("tcpcrypt_pake_compute_resps",
                    ctypes.default_abi,
                    ctypes.char.ptr,
                    pake_info_t_ptr,
                    ctypes.unsigned_long);

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
    
    if (isclient) {
        this._p = this._pake_client_new();
        this._pake_client_init(this._p);
    } else {
        this._p = this._pake_server_new();
        this._pake_server_init(this._p, null);
    }
};

pake.prototype = {
    /**
     * Set auth credentials for client.
     * @param {String} username
     * @param {String} realm
     * @param {String} password
     * @return {void}
     */
    client_set_credentials:function (username, realm, password) {
        this._username = username;
        this._realm = realm.toString();
        this._password = password;
        return this._pake_client_set_credentials(this._p, 
                                                 this._username, this._realm,
                                                 this._password);
    },

    /**
     * Set auth credentials for server.
     * @param {String} username
     * @param {String} realm
     * @param {BIGNUM *} pi_0
     * @param {EC_POINT *} L
     * @return {void}
     */
    server_set_credentials:function (username, realm, pi_0, L) {
        this._username = username;
        this._realm = realm;
        this._pi_0 = pi_0;
        this._L = L;
        return this._pake_server_set_credentials(this._p, 
                                                 this._username, this._realm,
                                                 this._pi_0, this._L);
    },

    server_get_Y_string:function () {
        return this._pake_server_get_Y_string(this._p);
    },

    client_get_X_string:function () {
        return this._pake_client_get_X_string(this._p);
    },

    /**
     * @return {int} success
     */
    client_recv_Y:function (server_Y_string) {
        return this._pake_client_recv_Y_string(this._p, server_Y_string);
    },

    /**
     * @return {int} success
     */
    server_recv_X:function (client_X_string) {
        return this._pake_server_recv_X_string(this._p, client_X_string);
    },
    
    /**
     * @return {String} respc
     */
    compute_respc:function (tcpcrypt_sid) {
        return this._tcpcrypt_pake_compute_respc(this._p, tcpcrypt_sid);
    },

    /**
     * @return {String} resps
     */
    compute_resps:function (tcpcrypt_sid) {
        return this._tcpcrypt_pake_compute_resps(this._p, tcpcrypt_sid);
    },

    /*************************************************************************/

    /**
     * Prints out a human-readable representation of this object's internal
     * state.
     * @return {void}
     */
    debug:function () {
        this._debug_pake_info(this._p);
    },



};
