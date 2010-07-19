load("../core/pake.js");

function test_add() {
    print("addjs(2,3) = " + addjs(2,3));
}

function test_pake_client() {
    var pc = new pake.client();
    print("pake.client = " + pc);
}

test_add();
test_pake_client();