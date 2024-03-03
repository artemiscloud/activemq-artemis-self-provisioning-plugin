import { encode } from 'base-64';

export const useGetQueues = async (
  adminUser: string,
  adminPassword: string,
): Promise<any> => {
  const defaultHostName =
    'test-1-wconsj-0-svc-rte-default.apps.spp0-414.amq-broker-qe.psi.redhat.com';
  const defaultProtocol = 'http';
  const defaultPort = '80';

  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  headers.set(
    'Authorization',
    'Basic ' + encode(`${adminUser}:${adminPassword}`),
  );
  headers.set('Origin', `http://${defaultHostName}`);

  const url = `${defaultProtocol}://${defaultHostName}:${defaultPort}/console/jolokia/version`;
  //const url = `${defaultProtocol}://${defaultHostName}:${defaultPort}/console/jolokia/read/org.apache.activemq.artemis:broker=\"amq-broker\"/Status`;
  console.log('jolokia url', url);
  const response = await fetch(url, {
    method: 'GET',
    mode: 'no-cors',
    headers: headers,
  })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => console.log(data))
    .catch((error) => {
      console.error('Error fetching data from Jolokia:', error);
    });
  return response;
};
