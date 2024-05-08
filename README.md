# ActiveMQ Artemis Self Provisioning Plugin

This project is a ActiveMQ Artemis Self Provisioning Plugin to the Administrator perspective in OpenShift console. It requires OpenShift 4.10 to use.

## Local development

In one terminal window, run:

1. `yarn install`
2. `yarn build-server`
3. `yarn build-dev`
4. `yarn run start-dev`

Note: The commands `yarn run start-dev` and `yarn run start` default to starting the plugin in https mode.

In another terminal window, run:

1. `oc login`
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman](https://podman.io))

This will run the OpenShift console in a container connected to the cluster
you've logged into. The plugin HTTP server runs on port 9001 with CORS enabled.
Navigate to <http://localhost:9000> to see the running plugin.

If you want the console to run in `https` mode, run:

`yarn run start-console-tls`

This command will run the console in `https` mode on port 9442.
The console url is <https://localhost:9442>

The console in https mode requires a private key and a server certificate that are generated
with openssl command. They are located under `console-cert` directory. The domain.key is the
private key and domain.crt is the server certificate. Please read the `console-cert/readme`
for instructions on how they are generated.

To run the console in https mode, you need to mount the private key and server cert to the
docker container and pass the locations to the console using BRIDGE_TLS_CERT_FILE and
BRIDGE_TLS_KEY_FILE environment variables respectively. Please see the `start-console-tls.sh`
for details.

## Docker image

1. Build the image:
   ```sh
   docker build -t quay.io/artemiscloud/activemq-artemis-self-provisioning-plugin:latest .
   ```
2. Run the image:
   ```sh
   docker run -it --rm -d -p 9001:80 quay.io/artemiscloud/activemq-artemis-self-provisioning-plugin:latest
   ```
3. Push the image to image registry:
   ```sh
   docker push quay.io/artemiscloud/activemq-artemis-self-provisioning-plugin:latest
   ```

## Deployment on cluster

You can deploy the plugin to a cluster by running this following command:

```sh
./deploy-plugin.sh [-i <image> -n]
```

Without any arguments, the plugin will run in https mode on port 9443.

The optional `-i <image>` (or `--image <image>`) argument allows you to pass in the plugin image. If not specified the default
`quay.io/artemiscloud/activemq-artemis-self-provisioning-plugin:latest` is deployed. for example:

```sh
./deploy-plugin.sh -i quay.io/<repo>/activemq-artemis-self-provisioning-plugin:1.0.1
```

The optional `-n` (or `--nossl`) argument disables the https and makes the plugin run in http mode on port 9001.
For example:

```sh
./deploy-plugin.sh -n
```

The deploy-plugin.sh uses `oc kustomize` (built-in [kustomize](https://github.com/kubernetes-sigs/kustomize)) command to configure and deploy the plugin using
resources and patches defined under ./deploy directory.

To undeploy the plugin, run

```sh
./undeploy-plugin.sh
```

## About the api-server

The plugin uses a api server as a backend service to get access broker's jolokia
endpoint. The source code is in `api-server` directory.

Please read [api.md](api.md) for details.