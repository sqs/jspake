run_mozilla_sh=~/src/mozilla-central/objdir-ff-debug/dist/bin/run-mozilla.sh
xpcshell_bin=~/src/mozilla-central/objdir-ff-debug/dist/bin/xpcshell
export xpcshell=$(run_mozilla_sh) $(xpcshell_bin)

.PHONY: xpcshell test

xpcshell:
	@$(xpcshell)

test:
	$(MAKE) -k -C test && \
	$(MAKE) -k -C test/ctypes