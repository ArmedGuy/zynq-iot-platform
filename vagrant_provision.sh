#!/bin/bash
apt-get update
apt-get install -y \
    debootstrap \
    docker.io \
    jq \
    kpartx \
    parted \
    python-docopt \
    python-functools32 \
    python-fysom \
    python-jsonschema \
    python-requests \
    python-setuptools \
    python-termcolor \
    python-yaml \
    qemu-utils

adduser vagrant docker
