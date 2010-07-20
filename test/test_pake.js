load("../core/pake.js");

function test_pake_client_new() {
    var pc = new pake.client();
    do_check_true(pc);
}

test_pake_client_new();