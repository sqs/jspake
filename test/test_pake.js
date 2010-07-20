load("../core/pake.js");

function test_pake_client_new() {
    var pc = new pake.client();
    do_check_true(!!pc);
}

function test_pake_client_set_credentials() {
    /* kind of a stupid test, but... */
    var pc = new pake.client();
    pc.set_credentials("jsmith", "protected area", "jsmith");
    do_check_eq(pc._username, "jsmith");
    do_check_eq(pc._realm, "protected area");
    do_check_eq(pc._password, "jsmith");
}

function test_pake_debug() {
    var pc = new pake.client();
    // pc.debug();
}

function test_pake_recv_Y() {
    var pc = new pake.client();
    do_check_true(pc.recv_Y("abcdef0123456789"));
}

function test_pake_compute_respc() {
    let pc = new pake.client();
    pc.set_credentials("jsmith", "protected area", "jsmith");
    pc.recv_Y("abcd");
    do_check_true(!!pc.compute_respc(12345));
}

function test_pake_check_resps() {
    let pc = new pake.client();
    pc.set_credentials("jsmith", "protected area", "jsmith");
    pc.recv_Y("abcd");
    pc.check_resps(12345, "abc123"); /* TODO: check against value */
}