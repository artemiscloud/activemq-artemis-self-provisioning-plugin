import https from 'https';
import fs from 'fs';
import path from 'path';
import createServer from './server';
import nock from 'nock';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

let testServer: https.Server;
let mockJolokia: nock.Scope;

const apiUrlBase = 'https://localhost:9443/api/v1';
const apiUrlPrefix = '/console/jolokia';
const loginUrl = apiUrlBase + '/jolokia/login';
const jolokiaProtocol = 'https';
const jolokiaHost = 'broker-0.test.com';
const jolokiaPort = '8161';

const startApiServer = async (): Promise<boolean> => {
  const staticBase = path.resolve('./dist');
  const result = await createServer(staticBase)
    .then((server) => {
      const options = {
        key: fs.readFileSync(path.join(__dirname, '../config/domain.key')),
        cert: fs.readFileSync(path.join(__dirname, '../config/domain.crt')),
      };
      testServer = https.createServer(options, server);
      testServer.listen(9443, () => {
        console.info('Listening on https://0.0.0.0:9443');
      });
      return true;
    })
    .catch((err) => {
      console.log('error starting server', err);
      return false;
    });
  return result;
};

const stopApiServer = () => {
  testServer.close();
};

const startMockJolokia = () => {
  mockJolokia = nock(jolokiaProtocol + '://' + jolokiaHost + ':' + jolokiaPort);
};

const stopMockJolokia = () => {
  nock.cleanAll();
};

beforeAll(async () => {
  const result = await startApiServer();
  expect(result).toBe(true);
  expect(testServer).toBeDefined();
  startMockJolokia();
});

afterAll(() => {
  stopApiServer();
  stopMockJolokia();
});

const doGet = async (url: string, token: string): Promise<fetch.Response> => {
  const fullUrl = apiUrlBase + url;
  const encodedUrl = fullUrl.replace(/,/g, '%2C');
  const response = await fetch(encodedUrl, {
    method: 'GET',
    headers: {
      'jolokia-session-id': token,
    },
  });
  return response;
};

const doPost = async (
  url: string,
  postBody: fetch.BodyInit,
  token: string,
): Promise<fetch.Response> => {
  const fullUrl = apiUrlBase + url;
  const encodedUrl = fullUrl.replace(/,/g, '%2C');

  const reply = await fetch(encodedUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'jolokia-session-id': token,
    },
    body: postBody,
  });

  return reply;
};

const doLogin = async (): Promise<fetch.Response> => {
  const jolokiaResp = {
    request: {},
    value: ['org.apache.activemq.artemis:broker="amq-broker"'],
    timestamp: 1714703745,
    status: 200,
  };
  mockJolokia
    .get(apiUrlPrefix + '/search/org.apache.activemq.artemis:broker=*')
    .reply(200, JSON.stringify(jolokiaResp));

  type LoginOptions = {
    [key: string]: string;
  };

  const details: LoginOptions = {
    brokerName: 'ex-aao-0',
    userName: 'admin',
    password: 'admin',
    jolokiaHost: jolokiaHost,
    port: jolokiaPort,
    scheme: jolokiaProtocol,
  };

  const formBody: string[] = [];
  for (const property in details) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  const formData = formBody.join('&');

  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  return response;
};

describe('test api server login', () => {
  it('test login functionality', async () => {
    const response = await doLogin();

    expect(response.ok).toBeTruthy();
    const data = await response.json();

    expect(data['jolokia-session-id']).toBeDefined();
  });

  it('test login failure', async () => {
    const jolokiaResp = {
      request: {},
      value: [''],
      error: 'forbidden access',
      timestamp: 1714703745,
      status: 403,
    };
    mockJolokia
      .get(apiUrlPrefix + '/search/org.apache.activemq.artemis:broker=*')
      .reply(403, JSON.stringify(jolokiaResp));

    const response = await doLogin();

    expect(response.ok).toBeFalsy();
  });
});

describe('test api server apis', () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await doLogin();
    const data = await response.json();
    authToken = data['jolokia-session-id'];
  });

  it('test get brokers', async () => {
    const result = [
      {
        name: 'amq-broker',
      },
    ];
    const jolokiaResp = {
      request: {},
      value: ['org.apache.activemq.artemis:broker="amq-broker"'],
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(apiUrlPrefix + '/search/org.apache.activemq.artemis:broker=*')
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet('/brokers', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(value.length).toEqual(1);
    expect(value[0]).toEqual(result[0]);
  });

  it('test get broker details', async () => {
    const result = {
      op: {
        removeAddressSettings: [
          {
            args: [
              {
                name: 'addressMatch',
                type: 'java.lang.String',
                desc: 'an address match',
              },
            ],
            ret: 'void',
            desc: 'Remove address settings',
          },
        ],
      },
      attr: {
        AddressMemoryUsage: {
          rw: false,
          type: 'long',
          desc: 'Memory used by all the addresses on broker for in-memory messages',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.ActiveMQServerControlImpl',
      desc: 'Information on the management interface of the MBean',
    };
    const jolokiaResult = {
      op: {
        removeAddressSettings: {
          args: [
            {
              name: 'addressMatch',
              type: 'java.lang.String',
              desc: 'an address match',
            },
          ],
          ret: 'void',
          desc: 'Remove address settings',
        },
      },
      attr: {
        AddressMemoryUsage: {
          rw: false,
          type: 'long',
          desc: 'Memory used by all the addresses on broker for in-memory messages',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.ActiveMQServerControlImpl',
      desc: 'Information on the management interface of the MBean',
    };
    const jolokiaResp = {
      request: {},
      value: jolokiaResult,
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/list/org.apache.activemq.artemis/broker=%22amq-broker%22',
      )
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet('/brokerDetails', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(result));
  });

  it('test readBrokerAttributes', async () => {
    const jolokiaResp = [
      {
        request: {
          mbean: 'org.apache.activemq.artemis:broker="amq-broker"',
          attribute: 'Clustered',
          type: 'read',
        },
        value: true,
        timestamp: 1713712378,
        status: 200,
      },
    ];
    mockJolokia
      .post(apiUrlPrefix + '/', (body) => {
        if (
          body.length === 1 &&
          body[0].type === 'read' &&
          body[0].mbean === 'org.apache.activemq.artemis:broker="amq-broker"' &&
          body[0].attribute === 'Clustered'
        ) {
          return true;
        }
        return false;
      })
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet(
      '/readBrokerAttributes?names=Clustered',
      authToken,
    );
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(jolokiaResp));
  });

  it('test readAddressAttributes', async () => {
    const jolokiaResp = [
      {
        request: {
          mbean:
            'org.apache.activemq.artemis:broker="amq-broker",component=addresses,address="DLQ"',
          attribute: 'RoutingTypes',
          type: 'read',
        },
        value: ['ANYCAST'],
        timestamp: 1713712378,
        status: 200,
      },
    ];
    mockJolokia
      .post(apiUrlPrefix + '/', (body) => {
        if (
          body.length === 1 &&
          body[0].type === 'read' &&
          body[0].mbean ===
            'org.apache.activemq.artemis:broker="amq-broker",component=addresses,address="DLQ"' &&
          body[0].attribute === 'RoutingTypes'
        ) {
          return true;
        }
        return false;
      })
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet(
      '/readAddressAttributes?name=DLQ&attrs=RoutingTypes',
      authToken,
    );
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(jolokiaResp));
  });

  it('test readAcceptorAttributes', async () => {
    const jolokiaResp = [
      {
        request: {
          mbean:
            'org.apache.activemq.artemis:broker="amq-broker",component=acceptors,name="scaleDown"',
          attribute: 'Parameters',
          type: 'read',
        },
        value: {
          amqpCredits: '1000',
          scheme: 'tcp',
          tcpReceiveBufferSize: '1048576',
          port: '61616',
          host: 'ex-aao-ss-0.ex-aao-hdls-svc.openshift-operators.svc.cluster.local',
          protocols: 'CORE',
          useEpoll: 'true',
          amqpMinCredits: '300',
          tcpSendBufferSize: '1048576',
        },
        timestamp: 1716368744,
        status: 200,
      },
    ];

    mockJolokia
      .post(apiUrlPrefix + '/', (body) => {
        if (
          body.length === 1 &&
          body[0].type === 'read' &&
          body[0].mbean ===
            'org.apache.activemq.artemis:broker="amq-broker",component=acceptors,name="scaleDown"' &&
          body[0].attribute === 'Parameters'
        ) {
          return true;
        }
        return false;
      })
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet(
      '/readAcceptorAttributes?name=scaleDown&attrs=Parameters',
      authToken,
    );
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(jolokiaResp));
  });

  it('test readQueueAttributes', async () => {
    const jolokiaResp = [
      {
        request: {
          mbean:
            'org.apache.activemq.artemis:address="ExpiryQueue",broker="amq-broker",component=addresses,queue="ExpiryQueue",routing-type="anycast",subcomponent=queues',
          attribute: 'ID',
          type: 'read',
        },
        value: 7,
        timestamp: 1716368499,
        status: 200,
      },
    ];
    mockJolokia
      .post(apiUrlPrefix + '/', (body) => {
        if (
          body.length === 1 &&
          body[0].type === 'read' &&
          body[0].mbean ===
            'org.apache.activemq.artemis:address="ExpiryQueue",broker="amq-broker",component=addresses,queue="ExpiryQueue",routing-type="anycast",subcomponent=queues' &&
          body[0].attribute === 'ID'
        ) {
          return true;
        }
        return false;
      })
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet(
      '/readQueueAttributes?name=ExpiryQueue&address=ExpiryQueue&routing-type=anycast&attrs=ID',
      authToken,
    );
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(jolokiaResp));
  });

  it('test execBrokerOperation', async () => {
    const jolokiaResp = [
      {
        request: {
          mbean: 'org.apache.activemq.artemis:broker="amq-broker"',
          arguments: [','],
          type: 'exec',
          operation: 'listAddresses(java.lang.String)',
        },
        value:
          '$.artemis.internal.sf.my-cluster.5c0e3e93-1837-11ef-aa70-0a580ad9005f,activemq.notifications,DLQ,ExpiryQueue',
        timestamp: 1716385483,
        status: 200,
      },
    ];

    mockJolokia
      .post(apiUrlPrefix + '/', (body) => {
        if (
          body.length === 1 &&
          body[0].type === 'exec' &&
          body[0].mbean === 'org.apache.activemq.artemis:broker="amq-broker"' &&
          body[0].operation === 'listAddresses(java.lang.String)' &&
          body[0].arguments[0] === ','
        ) {
          return true;
        }
        return false;
      })
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doPost(
      '/execBrokerOperation',
      JSON.stringify({
        signature: {
          name: 'listAddresses',
          args: [{ type: 'java.lang.String', value: ',' }],
        },
      }),
      authToken,
    );
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(jolokiaResp));
  });

  it('test brokerComponents', async () => {
    const result = [
      'org.apache.activemq.artemis:address="ExpiryQueue",broker="amq-broker",component=addresses,queue="ExpiryQueue",routing-type="anycast",subcomponent=queues',
      'org.apache.activemq.artemis:broker="amq-broker",component=cluster-connections,name="my-cluster"',
      'org.apache.activemq.artemis:address="activemq.notifications",broker="amq-broker",component=addresses',
      'org.apache.activemq.artemis:broker="amq-broker",component=broadcast-groups,name="my-broadcast-group"',
      'org.apache.activemq.artemis:broker="amq-broker",component=acceptors,name="scaleDown"',
      'org.apache.activemq.artemis:broker="amq-broker"',
      'org.apache.activemq.artemis:address="DLQ",broker="amq-broker",component=addresses',
      'org.apache.activemq.artemis:address="DLQ",broker="amq-broker",component=addresses,queue="DLQ",routing-type="anycast",subcomponent=queues',
      'org.apache.activemq.artemis:address="ExpiryQueue",broker="amq-broker",component=addresses',
    ];
    const jolokiaResp = {
      request: {},
      value: result,
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/search/org.apache.activemq.artemis:broker=%22amq-broker%22,*',
      )
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet('/brokerComponents', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(value.length).toEqual(result.length);
    for (let i = 0; i < value.length; i++) {
      expect(value[i]).toEqual(result[i]);
    }
  });

  it('test addresses', async () => {
    const expectedResult = [
      {
        name: 'activemq.notifications',
        broker: {
          name: 'amq-broker',
        },
      },
      {
        name: 'DLQ',
        broker: {
          name: 'amq-broker',
        },
      },
      {
        name: 'ExpiryQueue',
        broker: {
          name: 'amq-broker',
        },
      },
    ];
    const jolokiaResp = {
      request: {},
      value: [
        'org.apache.activemq.artemis:address="activemq.notifications",broker="amq-broker",component=addresses',
        'org.apache.activemq.artemis:address="DLQ",broker="amq-broker",component=addresses',
        'org.apache.activemq.artemis:address="ExpiryQueue",broker="amq-broker",component=addresses',
      ],
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/search/org.apache.activemq.artemis:broker=%22amq-broker%22,component=addresses,address=*',
      )
      .reply(200, jolokiaResp);

    const resp = await doGet('/addresses', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(value.length).toEqual(expectedResult.length);
    for (let i = 0; i < value.length; i++) {
      expect(value[i]).toEqual(expectedResult[i]);
    }
  });

  it('test queues', async () => {
    const expectedApiResult = [
      {
        name: 'ExpiryQueue',
        'routing-type': 'anycast',
        address: {
          name: 'ExpiryQueue',
          broker: {
            name: 'amq-broker',
          },
        },
        broker: {
          name: 'amq-broker',
        },
      },
      {
        name: 'DLQ',
        'routing-type': 'anycast',
        address: {
          name: 'DLQ',
          broker: {
            name: 'amq-broker',
          },
        },
        broker: {
          name: 'amq-broker',
        },
      },
    ];
    const jolokiaResult = [
      'org.apache.activemq.artemis:address="ExpiryQueue",broker="amq-broker",component=addresses,queue="ExpiryQueue",routing-type="anycast",subcomponent=queues',
      'org.apache.activemq.artemis:address="DLQ",broker="amq-broker",component=addresses,queue="DLQ",routing-type="anycast",subcomponent=queues',
    ];
    const jolokiaResp = {
      request: {},
      value: jolokiaResult,
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/search/org.apache.activemq.artemis:broker=*,component=addresses,address=%22*%22,subcomponent=queues,*',
      )
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet('/queues', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(value.length).toEqual(expectedApiResult.length);
    for (let i = 0; i < value.length; i++) {
      expect(value[i]).toEqual(expectedApiResult[i]);
    }
  });

  it('test queueDetails', async () => {
    const apiResult = {
      op: {
        listMessages: [
          {
            args: [
              {
                name: 'filter',
                type: 'java.lang.String',
                desc: 'A message filter (can be empty)',
              },
            ],
            ret: '[Ljava.util.Map;',
            desc: 'List all the messages in the queue matching the given filter',
          },
        ],
      },
      attr: {
        ConfigurationManaged: {
          rw: false,
          type: 'boolean',
          desc: 'is this queue managed by configuration (broker.xml)',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.QueueControlImpl',
      desc: 'Information on the management interface of the MBean',
    };
    const jolokiaResult = {
      op: {
        listMessages: {
          args: [
            {
              name: 'filter',
              type: 'java.lang.String',
              desc: 'A message filter (can be empty)',
            },
          ],
          ret: '[Ljava.util.Map;',
          desc: 'List all the messages in the queue matching the given filter',
        },
      },
      attr: {
        ConfigurationManaged: {
          rw: false,
          type: 'boolean',
          desc: 'is this queue managed by configuration (broker.xml)',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.QueueControlImpl',
      desc: 'Information on the management interface of the MBean',
    };
    const jolokiaResp = {
      request: {},
      value: jolokiaResult,
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/list/org.apache.activemq.artemis:address=%22DLQ%22,broker=%22amq-broker%22,component=addresses,queue=%22DLQ%22,routing-type=%22anycast%22/subcomponent=queues',
      )
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet(
      '/queueDetails?name=DLQ&addressName=DLQ&routingType=anycast',
      authToken,
    );
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(apiResult));
  });

  it('test addressDetails', async () => {
    const result = {
      op: {
        resume: [
          {
            args: [],
            ret: 'void',
            desc: 'Resumes the queues bound to this address',
          },
        ],
      },
      attr: {
        RoutingTypesAsJSON: {
          rw: false,
          type: 'java.lang.String',
          desc: 'Get the routing types enabled on this address as JSON',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.AddressControlImpl',
      desc: 'Information on the management interface of the MBean',
    };
    const jolokiaResult = {
      op: {
        resume: {
          args: [],
          ret: 'void',
          desc: 'Resumes the queues bound to this address',
        },
      },
      attr: {
        RoutingTypesAsJSON: {
          rw: false,
          type: 'java.lang.String',
          desc: 'Get the routing types enabled on this address as JSON',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.AddressControlImpl',
      desc: 'Information on the management interface of the MBean',
    };

    const jolokiaResp = {
      request: {},
      value: jolokiaResult,
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/list/org.apache.activemq.artemis:address=%22DLQ%22,broker=%22amq-broker%22/component=addresses',
      )
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet('/addressDetails?name=DLQ', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(result));
  });

  it('test acceptors', async () => {
    const expectedApiResult = [
      {
        name: 'scaleDown',
        broker: {
          name: 'amq-broker',
        },
      },
    ];

    const jolokiaResult = [
      'org.apache.activemq.artemis:broker="amq-broker",component=acceptors,name="scaleDown"',
    ];

    const jolokiaResp = {
      request: {},
      value: jolokiaResult,
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/search/org.apache.activemq.artemis:broker=%22amq-broker%22,component=acceptors,name=*',
      )
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet('/acceptors', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(expectedApiResult));
  });

  it('test acceptorDetails', async () => {
    const result = {
      op: {
        reload: [
          {
            args: [],
            ret: 'void',
            desc: 'Re-create the acceptor with the existing configuration values. Useful, for example, for reloading key/trust stores on acceptors which support SSL.',
          },
        ],
      },
      attr: {
        FactoryClassName: {
          rw: false,
          type: 'java.lang.String',
          desc: 'class name of the AcceptorFactory implementation used by this acceptor',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.AcceptorControlImpl',
      desc: 'Information on the management interface of the MBean',
    };
    const jolokiaResult = {
      op: {
        reload: {
          args: [],
          ret: 'void',
          desc: 'Re-create the acceptor with the existing configuration values. Useful, for example, for reloading key/trust stores on acceptors which support SSL.',
        },
      },
      attr: {
        FactoryClassName: {
          rw: false,
          type: 'java.lang.String',
          desc: 'class name of the AcceptorFactory implementation used by this acceptor',
        },
      },
      class:
        'org.apache.activemq.artemis.core.management.impl.AcceptorControlImpl',
      desc: 'Information on the management interface of the MBean',
    };

    const jolokiaResp = {
      request: {},
      value: jolokiaResult,
      timestamp: 1714703745,
      status: 200,
    };
    mockJolokia
      .get(
        apiUrlPrefix +
          '/list/org.apache.activemq.artemis:name=%22scaleDown%22,broker=%22amq-broker%22/component=acceptors',
      )
      .reply(200, JSON.stringify(jolokiaResp));

    const resp = await doGet('/acceptorDetails?name=scaleDown', authToken);
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(JSON.stringify(value)).toEqual(JSON.stringify(result));
  });
});
