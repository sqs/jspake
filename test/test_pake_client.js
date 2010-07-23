load("../core/crypto.pake.js");

function test_client_ctr() {
    var pc = crypto.pake2plus.client();
    do_check_eq(0, pc.toString().indexOf('pake2plus.client{'));
}

function test_server_ctr() {
    var ps = crypto.pake2plus.server();
    do_check_eq(0, ps.toString().indexOf('pake2plus.server{'));
}