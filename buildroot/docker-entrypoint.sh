#!/bin/bash

case "$1" in

clean)
	make BR2_EXTERNAL="$EXTERNAL_TREE_DIR" clean
	;;
menuconfig)
	make BR2_EXTERNAL="$EXTERNAL_TREE_DIR" test-agent_defconfig
	make menuconfig
	;;
save)
	make BR2_DEFCONFIG="${EXTERNAL_TREE_DIR}/configs/test-agent_defconfig" savedefconfig
	;;
*)
	make BR2_EXTERNAL="$EXTERNAL_TREE_DIR" test-agent_defconfig
	make


esac
