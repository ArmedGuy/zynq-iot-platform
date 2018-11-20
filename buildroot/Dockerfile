# Dockerfile for building with shared external tree and buildroot

FROM ubuntu:16.04

RUN apt-get update && apt-get install -y \
        sed make binutils build-essential gcc \
        g++ bash patch gzip bzip2 perl tar cpio python \
        unzip rsync file bc wget parted kpartx \ 
		mtools dosfstools ncurses-dev

ENV EXTERNAL_TREE_DIR ../external-tree
ENV BUILDROOT_DIR /buildroot

RUN mkdir $BUILDROOT_DIR
WORKDIR $BUILDROOT_DIR
RUN mkdir $EXTERNAL_TREE_DIR

COPY docker-entrypoint.sh /docker-entrypoint.sh

WORKDIR $BUILDROOT_DIR
ENTRYPOINT ["/docker-entrypoint.sh"]
