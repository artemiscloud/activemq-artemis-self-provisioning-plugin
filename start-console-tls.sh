#!/usr/bin/env bash

set -euo pipefail

CONSOLE_IMAGE=${CONSOLE_IMAGE:="quay.io/openshift/origin-console:latest"}
CONSOLE_PORT=${CONSOLE_PORT:=9442}

echo "Starting local OpenShift console in https mode..."

BRIDGE_LISTEN="https://0.0.0.0:${CONSOLE_PORT}"
BRIDGE_TLS_CERT_FILE=/console-cert/domain.crt
BRIDGE_TLS_KEY_FILE=/console-cert/domain.key
BRIDGE_USER_AUTH="disabled"
BRIDGE_K8S_MODE="off-cluster"
BRIDGE_K8S_AUTH="bearer-token"
BRIDGE_K8S_MODE_OFF_CLUSTER_SKIP_VERIFY_TLS=true
BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT=$(oc whoami --show-server)
# The monitoring operator is not always installed (e.g. for local OpenShift). Tolerate missing config maps.
set +e
BRIDGE_K8S_MODE_OFF_CLUSTER_THANOS=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath='{.data.thanosPublicURL}' 2>/dev/null)
BRIDGE_K8S_MODE_OFF_CLUSTER_ALERTMANAGER=$(oc -n openshift-config-managed get configmap monitoring-shared-config -o jsonpath='{.data.alertmanagerPublicURL}' 2>/dev/null)
set -e
BRIDGE_K8S_AUTH_BEARER_TOKEN=$(oc whoami --show-token 2>/dev/null)
BRIDGE_USER_SETTINGS_LOCATION="localstorage"

# Don't fail if the cluster doesn't have gitops.
set +e
GITOPS_HOSTNAME=$(oc -n openshift-gitops get route cluster -o jsonpath='{.spec.host}' 2>/dev/null)
set -e
if [ -n "$GITOPS_HOSTNAME" ]; then
    BRIDGE_K8S_MODE_OFF_CLUSTER_GITOPS="https://$GITOPS_HOSTNAME"
fi

echo "API Server: $BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT"
echo "Console Image: $CONSOLE_IMAGE"
echo "Console URL: https://localhost:${CONSOLE_PORT}"

# Prefer podman if installed. Otherwise, fall back to docker.
if [ -x "$(command -v podman)" ]; then
    if [ "$(uname -s)" = "Linux" ]; then
        echo "Starting on linux with podman"
        # Use host networking on Linux since host.containers.internal is unreachable in some environments.
        BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=https://localhost:9443"
        echo "bridge plugins: $BRIDGE_PLUGINS"
        FLAG=$(set | grep BRIDGE)
        echo "running podman with opts:"
        echo "${FLAG}"
        podman run --pull always -v ./console-cert:/console-cert:z --rm --network=host --env-file <(set | grep BRIDGE) $CONSOLE_IMAGE
    else
        echo "Starting on $(uname -s) with podman"
        BRIDGE_PLUGINS="${npm_package_consolePlugin_name}=https://host.containers.internal:9443"
        echo "bridge plugins: $BRIDGE_PLUGINS"
        FLAG=$(set | grep BRIDGE)
        echo "running podman with opts:"
        echo "${FLAG}"
        podman run --pull always -v ./console-cert:/console-cert:z --rm -p "$CONSOLE_PORT":9442 --env-file <(set | grep BRIDGE) $CONSOLE_IMAGE
    fi
else
    echo "Cannot find podman to run"
fi
