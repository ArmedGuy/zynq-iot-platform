#!/bin/sh

set -e

BASEDIR="$(dirname "$0")"

if [ "$#" -eq 1 ] && [ "$1" = "contained" ]; then
	echo "Bulding from a contained container"
	docker build -t netrounds/build-ta-contained -f ${BASEDIR}/Dockerfile-contained ${BASEDIR}
	docker run \
		-it \
		--rm \
		-v ${BASEDIR}/../build/images:/buildroot/output/images \
		netrounds/build-ta-contained
	exit 
fi

BUILDROOT_TAR="${BASEDIR}/buildroot.tar.gz"
BUILDROOT_DIR="${BASEDIR}/buildroot"
EXTERNAL_TREE="${BASEDIR}/external-tree"

if [ ! -d "$BUILDROOT_DIR" ]; then
	curl -o "$BUILDROOT_TAR" https://buildroot.uclibc.org/downloads/buildroot-2017.05.tar.gz
	mkdir "$BUILDROOT_DIR"
	tar xvf "$BUILDROOT_TAR" -C "$BUILDROOT_DIR" --strip-components=1
else
	echo "$BUILDROOT_DIR exists, using it."
fi

if [ -f "$BUILDROOT_TAR" ]; then
	rm "$BUILDROOT_TAR"
fi

docker build -t netrounds/build-ta -f ${BASEDIR}/Dockerfile ${BASEDIR}
docker run \
	-it \
	--rm \
	-v "${BUILDROOT_DIR}:/buildroot" \
	-v "${EXTERNAL_TREE}:/external-tree" \
	-v "${BASEDIR}/../build/images:/buildroot/output/images" \
	netrounds/build-ta $1
