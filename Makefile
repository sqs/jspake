run_mozilla_sh=/usr/lib/xulrunner-1.9.2.8pre/run-mozilla.sh
xpcshell_bin=/usr/lib/xulrunner-1.9.2.8pre/xpcshell
xpcshell=$(run_mozilla_sh) $(xpcshell_bin)

.PHONY: xpcshell

clib:
	$(MAKE) -C c

xpcshell:
	@$(xpcshell)

test:
	$(MAKE) -C tests