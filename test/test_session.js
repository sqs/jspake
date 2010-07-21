load("../core/pake.js");

function test_session() {
    var ps = new pake(0);
    var pc = new pake(1);

    /* TODO: server_set_credentials */
    do_check_true(ps.client_set_credentials("jsmith", "protected area", "jsmith"));
    do_check_true(pc.client_set_credentials("jsmith", "protected area", "jsmith"));

    do_check_true(ps.server_recv_X(pc.client_get_X_string()));
    do_check_true(pc.client_recv_Y(ps.server_get_Y_string()));

    let sid = 123456;
    let ss = ps.compute_resps(sid).readString();
    let sc = ps.compute_respc(sid).readString();
    let cs = pc.compute_resps(sid).readString();
    let cc = pc.compute_respc(sid).readString();

    do_check_neq(ss, "");
    do_check_eq(ss, cs);
    do_check_neq(sc, "");
    do_check_eq(sc, cc);
}