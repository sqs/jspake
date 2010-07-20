load("../core/pake.js");

function test_pake_client_new() {
    var pc = new pake(1);
    do_check_true(!!pc);
}

function test_pake_client_set_credentials() {
    /* kind of a stupid test, but... */
    var pc = new pake(1);
    pc.client_set_credentials("jsmith", "protected area", "jsmith");
    do_check_eq(pc._username, "jsmith");
    do_check_eq(pc._realm, "protected area");
    do_check_eq(pc._password, "jsmith");
}

function test_pake_debug() {
    var pc = new pake();
    // pc.debug();
}

function test_pake_recv_Y() {
    var pc = new pake(1);
    do_check_true(pc.client_recv_Y("abcdef0123456789"));
}

function test_pake_compute_respc() {
    let pc = new pake(1);
    pc.client_set_credentials("jsmith", "protected area", "jsmith");
    pc.client_recv_Y("abcd");
    do_check_true(!!pc.compute_respc(12345));
}

function test_pake_compute_resps() {
    let ps = new pake(0);
    ps.client_set_credentials("jsmith", "protected area", "jsmith");
    ps.server_recv_X("abcd");
    do_check_true(!!ps.compute_resps(12345)); /* TODO: check against value */
}
