// http is unsecured
// https if secured via tls
// if so need the cert and potentially CA info
const defaultProtocol = 'http';

// If specified, the fully qualified Pod hostname will be "<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>". If not specified, the pod will not have a domainname at all.
// e.g. example1-ss-1.example1-hdls-svc.amq1.svc.cluster.local
// where
// example1 is the CR name
// example1-ss is the statefulset name
// example1-ss-1 is the pod name (ordinal 1, i.e. the 2nd pod in the statefulset)
// example1-hdls-svc is the headless service for CR name example1
// amq1 is the namespacename
// .svc is used for services in k8s
// .cluster.local is the domainname (in this case the default)
// crname-ss-ordinal OR
// crname-ss-ordinal.crname-hdls-svc.namespace OR
// crname-ss-ordinal.crname-hdls-svc.namespace.svc OR fully qualified as
// crname-ss-ordinal.crname-hdls-svc.namespace.svc.cluster.local (default cluster domain but could be custom)
//
// likely all we need here is crname-ss-ordinal.crname-hdls-svc.namespace
const defaultHostname = 'localhost';

// need to lookup the console-jolokia named port on the hdls service
const defaultPort = '8161';

// need to see if the jolokiaAgent is enabled in the CR
// console/jolokia is the default
// if the agent is enabled it'll be just jolokia i.e. localhost:8161/jolokia
const defaultJolokiaEndpoint = 'console/jolokia';

export type ApiBasePathProps = {
  protocol?: string;
  hostName?: string;
  port?: string;
  jolokiaEndPoint?: string;
};

export const useGetApiBasePath = (options: ApiBasePathProps) => {
  const {
    protocol = defaultProtocol,
    hostName = defaultHostname,
    port = defaultPort,
    jolokiaEndPoint = defaultJolokiaEndpoint,
  } = options;
  const basePath = `${protocol}://${hostName}:${port}/${jolokiaEndPoint}`;

  return basePath;
};
