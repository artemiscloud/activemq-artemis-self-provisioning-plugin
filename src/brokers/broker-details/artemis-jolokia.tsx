import { encode } from 'base-64';

export const useGetQueues = async (
  adminUser: string,
  adminPassword: string,
  hostName: string,
): Promise<any> => {
  const defaultProtocol = 'http';
  const defaultPort = '80';
  const defaultBroker = 'amq-broker';
  const defaultObjectName = 'org.apache.activemq.artemis';

  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  headers.set(
    'Authorization',
    'Basic ' + encode(`${adminUser}:${adminPassword}`),
  );
  headers.set('Origin', `http://${hostName}`);

  const url = `${defaultProtocol}://${hostName}:${defaultPort}/console/jolokia/read/${defaultObjectName}:broker=!%22${defaultBroker}!%22,address=!%22ExpiryQueue!%22,component=addresses,queue=!%22ExpiryQueue!%22,routing-type=!%22anycast!%22,*`;
  console.log('jolokia url', url);
  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });
  if (response.ok) {
    const responseData = await response.json();
    return responseData;
  } else {
    throw new Error('Failed to fetch data');
  }
};
