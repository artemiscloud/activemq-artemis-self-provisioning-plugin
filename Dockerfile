FROM registry.access.redhat.com/ubi8/nodejs-16-minimal AS build

ADD . /usr/src/app
WORKDIR /usr/src/app

USER root

RUN npm install -g yarn && yarn install --network-timeout 1000000 && yarn build

FROM registry.access.redhat.com/ubi9/nginx-120

RUN chmod g+rwx /var/run /var/log/nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

LABEL name="artemiscloud/activemq-artemis-self-provisioning-plugin"
LABEL description="ActiveMQ Artemis Self Provisioning Plugin"
LABEL maintainer="Ajay Pratap <apratap@redhat.com>"
LABEL version="0.0.1"
