load("../../core/pake.ctypes.js");

function test_pake_client_new() {
    var pc = new pake(1);
    do_check_true(!!pc);
}

function test_pake_client_set_credentials() {
    /* kind of a stupid test, but... */
    var pc = new pake(1);
    pc.client_set_credentials("jsmith", "protected area", "jsmith");
    do_check_eq(pc._username.readString(), "jsmith");
    do_check_eq(pc._realm.readString(), "protected area");
    do_check_eq(pc._password.readString(), "jsmith");
}

function test_pake_debug() {
    var pc = new pake();
    // pc.debug();
}

function test_pake_recv_Y() {
    var pc = new pake(1);
    do_check_true(pc.client_recv_Y("abcdef0123456789"));
}
