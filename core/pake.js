const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/ctypes.jsm");

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