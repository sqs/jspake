TEST_SCRIPTS=$(wildcard *.js)

.PHONY: default $(TEST_SCRIPTS:.js=)

default: $(TEST_SCRIPTS:.js=)

$(TEST_SCRIPTS:.js=): $(TEST_SCRIPTS)
	$(xpcshell) -f harness/head.js -f $@.js -f harness/tail.js