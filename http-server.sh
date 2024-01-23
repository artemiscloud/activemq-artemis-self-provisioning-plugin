#!/usr/bin/env sh

set -u

PUBLIC_PATH="$1"
shift
SERVER_OPTS="$@"

if [ ${TLS_ENABLED} == "true" ]; then
  echo "starting server in https mode"
  ./node_modules/.bin/http-server $PUBLIC_PATH -c-1 --cors -p 9443 -S -C /var/serving-cert/tls.crt -K /var/serving-cert/tls.key $SERVER_OPTS
else
  echo "starting server in http mode"
  ./node_modules/.bin/http-server $PUBLIC_PATH -c-1 --cors -p 9001 $SERVER_OPTS
fi
