#!/usr/bin/env sh

set -u

PUBLIC_PATH="$1"
shift
SERVER_OPTS="$@"

echo "starting server with options: $SERVER_OPTS"
./node_modules/.bin/http-server $PUBLIC_PATH -c-1 --cors $SERVER_OPTS