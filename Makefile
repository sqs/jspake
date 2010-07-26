run_mozilla_sh=/usr/lib/xulrunner-2.0b3pre/run-mozilla.sh
xpcshell_bin=/usr/bin/xpcshell-2.0
export xpcshell=$(run_mozilla_sh) $(xpcshell_bin)

.PHONY: xpcshell test

xpcshell:
	@$(xpcshell)

test:
	$(MAKE) -k -C test && \
	$(MAKE) -k -C test/ctypes