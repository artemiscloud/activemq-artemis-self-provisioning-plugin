FROM registry.access.redhat.com/ubi8/nodejs-20:latest AS BUILD_IMAGE

### BEGIN REMOTE SOURCE
# Use the COPY instruction only inside the REMOTE SOURCE block
# Use the COPY instruction only to copy files to the container path $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app
ARG REMOTE_SOURCES_DIR=/tmp/remote_source
RUN mkdir -p $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app
WORKDIR $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app
# Copy package.json and yarn.lock to the container
COPY package.json package.json
COPY yarn.lock yarn.lock
ADD . $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app
RUN command -v yarn || npm i -g yarn
### END REMOTE SOURCE

USER root

## Set directory
RUN mkdir -p /usr/src/
RUN cp -r $REMOTE_SOURCES_DIR/activemq-artemis-self-provisioning-plugin/app /usr/src/
WORKDIR /usr/src/app

## Install dependencies
RUN yarn install  --network-timeout 1000000

## Build application
RUN yarn build
RUN yarn build-server

FROM registry.access.redhat.com/ubi8/nodejs-20-minimal:latest

USER root

WORKDIR /app

COPY --from=BUILD_IMAGE /usr/src/app/dist /usr/share/amq-spp/dist
COPY --from=BUILD_IMAGE /usr/src/app/.env /usr/share/amq-spp/.env
COPY --from=BUILD_IMAGE /usr/src/app/server /usr/share/amq-spp/server

WORKDIR /usr/share/amq-spp

RUN npm install connect \
cors \
express \
express-openapi-validator \
swagger-routes-express \
typescript \
validator \
yamljs \
base-64 \
jsonwebtoken \
dotenv \
express-rate-limit

RUN echo "node /usr/share/amq-spp/server/app.js /usr/share/amq-spp/dist" > run.sh
RUN chmod +x run.sh

USER 1001

ENV NODE_ENV=production

CMD ["node", "server/app.js", "dist"]

## Labels
LABEL name="artemiscloud/activemq-artemis-self-provisioning-plugin"
LABEL description="ActiveMQ Artemis Self Provisioning Plugin"
LABEL maintainer="Roderick Kieley <rkieley@redhat.com>"
LABEL version="0.1.0"
