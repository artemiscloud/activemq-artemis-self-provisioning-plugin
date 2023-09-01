FROM registry.access.redhat.com/ubi8/nodejs-16:latest AS BUILD_IMAGE

### BEGIN REMOTE SOURCE
# Use the COPY instruction only inside the REMOTE SOURCE block
# Use the COPY instruction only to copy files to the container path $REMOTE_SOURCE_DIR/app
ARG REMOTE_SOURCE_DIR=/tmp/remote_source
RUN mkdir -p $REMOTE_SOURCE_DIR/app
WORKDIR $REMOTE_SOURCE_DIR/app
# Copy package.json and yarn.lock to the container
COPY package.json package.json
COPY yarn.lock yarn.lock
### END REMOTE SOURCE

USER root
RUN command -v yarn || npm i -g yarn

## Set directory
ADD . /usr/src/app
WORKDIR /usr/src/app

## Install dependencies
RUN yarn install  --network-timeout 1000000

## Build application
RUN yarn build

FROM registry.access.redhat.com/ubi8/nodejs-16-minimal

USER 1001

WORKDIR /app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/http-server.sh ./http-server.sh

ENTRYPOINT [ "./http-server.sh", "./dist" ]

## Labels
LABEL name="artemiscloud/activemq-artemis-self-provisioning-plugin"
LABEL description="ActiveMQ Artemis Self Provisioning Plugin"
LABEL maintainer="Ajay Pratap <apratap@redhat.com>"
LABEL version="0.0.1"
