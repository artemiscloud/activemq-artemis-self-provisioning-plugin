#!/usr/bin/env sh

oc kustomize deploy/base | oc delete -f -
