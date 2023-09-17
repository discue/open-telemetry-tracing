#!/bin/bash

function cleanup() {
  ./scripts/stop-jaeger-with-docker.sh
}

trap cleanup EXIT

# check whether jaeger is running
curl --head http://127.0.0.1:16686 &>"/dev/null"
if [[ "${?}" -ne 0 ]]; then
    echo "Jaeger container is not running. Starting it then"
    ./scripts/run-jaeger-with-docker.sh

elif [[ "${#args[@]}" -eq 0 ]]; then
    echo "Ensuring we are connected to firebase DEFAULT project"
    npx firebase use ci 
fi

# do not allow --only if running on cicd environment
if [[ -z "${GITHUB_ACTIONS}" ]]; then
  npm run test
else
  npm run test:ci
fi