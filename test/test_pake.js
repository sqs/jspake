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
