#!/bin/bash

set -x

function cleanup() {
  ./stop-jaeger-with-docker.sh
}

# check whether jaeger is running
curl --head http://127.0.0.1:16686 &>"/dev/null"
if [[ "${?}" -ne 0 ]]; then
    echo "Jaeger container is not running. Starting it then"
    ./run-jaeger-with-docker.sh
fi

trap cleanup EXIT

export NODE_OPTIONS="--require ./lib/tracing/tracing.cjs"

# do not allow --only if running on cicd environment
if [[ -z "${GITHUB_ACTIONS}" ]]; then
  npm run test
else
  npm run test:ci
fi