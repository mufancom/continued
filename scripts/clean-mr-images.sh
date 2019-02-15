#!/bin/sh

image_ids=$(docker images makeflow-web-mr-$MERGE_REQUEST_SUBDOMAIN --quiet)

if [ -n "$image_ids" ]
then
  # tolerate removing failure on images using by running (exiting) container.
  docker rmi --force $image_ids || true
fi

docker image prune --force
