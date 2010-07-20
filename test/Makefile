.PHONY: default

TEST_SCRIPTS=test_pake.js

$(TEST_SCRIPTS:.js=): $(TEST_SCRIPTS)
	$(xpcshell) -f harness/head.js -f $@.js -f harness/tail.js