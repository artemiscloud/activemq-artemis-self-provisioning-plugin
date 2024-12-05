#!/usr/bin/env sh

oc kustomize deploy/base | oc delete -f -

# remove only our plugin from list of deployed plugins
plugins=$(oc get consoles.operator.openshift.io cluster -o json | jq -c '.spec.plugins | map(select(. != "activemq-artemis-self-provisioning-plugin"))' )
patchPath="{ \"spec\": { \"plugins\": $plugins } }"
oc patch consoles.operator.openshift.io cluster --type=merge --patch "${patchPath}"
