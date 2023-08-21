FROM registry.access.redhat.com/ubi8/nodejs-16 AS BUILD_IMAGE

ADD . /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

USER 0
RUN npm i -g yarn
RUN yarn install --network-timeout 1000000
RUN yarn build

FROM registry.access.redhat.com/ubi8/nodejs-16-minimal

USER 65532:65532
WORKDIR /app
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/http-server.sh ./http-server.sh

EXPOSE 9001
ENTRYPOINT [ "./http-server.sh", "./dist" ]

LABEL name="artemiscloud/activemq-artemis-self-provisioning-plugin"
LABEL description="ActiveMQ Artemis Self Provisioning Plugin"
LABEL maintainer="Ajay Pratap <apratap@redhat.com>"
LABEL version="0.0.1"
