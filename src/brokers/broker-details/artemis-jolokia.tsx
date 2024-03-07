import { encode } from 'base-64';

export const useGetQueues = async (
  adminUser: string,
  adminPassword: string,
  hostName: string,
): Promise<any> => {
  const defaultProtocol = 'http';
  const defaultPort = '80';

  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  headers.set(
    'Authorization',
    'Basic ' + encode(`${adminUser}:${adminPassword}`),
  );
  headers.set('Origin', `http://${hostName}`);

  const url = `${defaultProtocol}://${hostName}:${defaultPort}/console/jolokia/version`;
  //const url = `${defaultProtocol}://${defaultHostName}:${defaultPort}/console/jolokia/read/org.apache.activemq.artemis:broker=\"amq-broker\"/Status`;
  console.log('jolokia url', url);
  const response = await fetch(url, {
    method: 'GET',
    // mode: 'no-cors',
    headers: headers,
  });
  //   .then((resp) => {
  //     return resp.json();
  //   })
  //   .then((data) => console.log(data))
  //   .catch((error) => {
  //     console.error('Error fetching data from Jolokia:', error);
  //   });
  // return response;
  if (response.ok) {
    const responseData = await response.json();
    console.log('Response from Jolokia:', responseData);
    return responseData;
  } else {
    throw new Error('Failed to fetch data');
  }
};
