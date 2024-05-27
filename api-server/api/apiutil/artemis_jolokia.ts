import base64 from 'base-64';
import fetch from 'node-fetch';

// search the broker
const brokerSearchPattern = 'org.apache.activemq.artemis:broker=*';
// search all broker top level components
const brokerComponentsSearchPattern =
  'org.apache.activemq.artemis:broker="BROKER_NAME",*';
// search addresses
const addressComponentsSearchPattern =
  'org.apache.activemq.artemis:broker="BROKER_NAME",component=addresses,address=*';
const acceptorComponentsSearchPattern =
  'org.apache.activemq.artemis:broker="BROKER_NAME",component=acceptors,name=*';
const queueComponentsSearchPattern =
  'org.apache.activemq.artemis:broker=*,component=addresses,address="ADDRESS_NAME",subcomponent=queues,*';
// list a Queue's operations and attributes
const queueDetailsListPattern =
  'org.apache.activemq.artemis:address="ADDRESS_NAME",broker="BROKER_NAME",component=addresses,queue="QUEUE_NAME",routing-type="ROUTING_TYPE"/subcomponent=queues';
const addressDetailsListPattern =
  'org.apache.activemq.artemis:address="ADDRESS_NAME",broker="BROKER_NAME"/component=addresses';
const acceptorDetailsListPattern =
  'org.apache.activemq.artemis:name="ACCEPTOR_NAME",broker="BROKER_NAME"/component=acceptors';

const brokerDetailsListPattern =
  'org.apache.activemq.artemis/broker="BROKER_NAME"';

const brokerComponentPattern =
  'org.apache.activemq.artemis:broker="BROKER_NAME"';
const addressComponentPattern =
  'org.apache.activemq.artemis:broker="BROKER_NAME",component=addresses,address="ADDRESS_NAME"';
const acceptorComponentPattern =
  'org.apache.activemq.artemis:broker="BROKER_NAME",component=acceptors,name="ACCEPTOR_NAME"';
const queueComponentPattern =
  'org.apache.activemq.artemis:address="ADDRESS_NAME",broker="BROKER_NAME",component=addresses,queue="QUEUE_NAME",routing-type="ROUTING_TYPE",subcomponent=queues';

export class ArtemisJolokia {
  username: string;
  password: string;
  protocol: string;
  port: string;
  hostName: string;
  brokerName: string;

  static readonly BROKER = 'broker';
  static readonly BROKER_DETAILS = 'broker-details';
  static readonly BROKER_COMPONENTS = 'broker-components';
  static readonly ADDRESS = 'address';
  static readonly QUEUE = 'queue';
  static readonly ACCEPTOR = 'acceptor';
  static readonly QUEUE_DETAILS = 'queue-details';
  static readonly ADDRESS_DETAILS = 'address-details';
  static readonly ACCEPTOR_DETAILS = 'acceptor-details';

  componentMap = new Map<string, string>([
    [ArtemisJolokia.BROKER, brokerSearchPattern],
    [ArtemisJolokia.BROKER_COMPONENTS, brokerComponentsSearchPattern],
    [ArtemisJolokia.ADDRESS, addressComponentsSearchPattern],
    [ArtemisJolokia.QUEUE, queueComponentsSearchPattern],
    [ArtemisJolokia.ACCEPTOR, acceptorComponentsSearchPattern],
  ]);

  componentDetailsMap = new Map<string, string>([
    [ArtemisJolokia.BROKER_DETAILS, brokerDetailsListPattern],
    [ArtemisJolokia.QUEUE_DETAILS, queueDetailsListPattern],
    [ArtemisJolokia.ADDRESS_DETAILS, addressDetailsListPattern],
    [ArtemisJolokia.ACCEPTOR_DETAILS, acceptorDetailsListPattern],
  ]);

  componentNameMap = new Map<string, string>([
    [ArtemisJolokia.BROKER, brokerComponentPattern],
    [ArtemisJolokia.ADDRESS, addressComponentPattern],
    [ArtemisJolokia.ACCEPTOR, acceptorComponentPattern],
    [ArtemisJolokia.QUEUE, queueComponentPattern],
  ]);

  constructor(
    username: string,
    password: string,
    hostName: string,
    protocol: string,
    port: string,
  ) {
    this.username = username;
    this.password = password;
    this.protocol = protocol;
    this.port = port;
    this.hostName = hostName;
    this.brokerName = '';
  }

  getAuthHeaders = (): fetch.Headers => {
    const headers = new fetch.Headers();
    headers.set(
      'Authorization',
      'Basic ' + base64.encode(this.username + ':' + this.password),
    );
    //this may not needed as we set strict-check to false
    headers.set('Origin', 'http://' + this.hostName);
    return headers;
  };

  getComponents = async (
    name: string,
    params?: Map<string, string>,
  ): Promise<Array<string>> => {
    const headers = this.getAuthHeaders();

    let searchPattern = this.componentMap.get(name);

    if (typeof params !== 'undefined') {
      for (const [key, value] of params) {
        searchPattern = searchPattern?.replace(key, value);
      }
    }

    searchPattern = searchPattern?.replace('BROKER_NAME', this.brokerName);

    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/search/' +
      searchPattern;

    const reply = await fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => response.text()) //check response.ok
      .then((message) => {
        const resp: JolokiaResponseType = JSON.parse(message);
        return resp.value;
      });

    return reply;
  };

  getBrokerDetails = async (): Promise<JolokiaObjectDetailsType> => {
    const headers = this.getAuthHeaders();

    let searchPattern = this.componentDetailsMap.get(
      ArtemisJolokia.BROKER_DETAILS,
    );

    searchPattern = searchPattern?.replace('BROKER_NAME', this.brokerName);

    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/list/' +
      searchPattern;

    const reply = await fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      })
      .then((message) => {
        const resp: JolokiaListResponseType = JSON.parse(message);
        if (resp.status !== 200) {
          throw resp.error;
        }
        return resp.value;
      })
      .catch((err) => {
        throw err;
      });

    return reply;
  };

  getAcceptorDetails = async (
    params?: Map<string, string>,
  ): Promise<JolokiaObjectDetailsType> => {
    const headers = this.getAuthHeaders();

    let searchPattern = this.componentDetailsMap.get(
      ArtemisJolokia.ACCEPTOR_DETAILS,
    );

    if (typeof params !== 'undefined') {
      for (const [key, value] of params) {
        searchPattern = searchPattern?.replace(key, value);
      }
    }
    searchPattern = searchPattern?.replace('BROKER_NAME', this.brokerName);

    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/list/' +
      searchPattern;

    const reply = await fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      })
      .then((message) => {
        const resp: JolokiaListResponseType = JSON.parse(message);
        if (resp.status !== 200) {
          throw resp.error;
        }
        return resp.value;
      })
      .catch((err) => {
        throw err;
      });

    return reply;
  };

  getAddressDetails = async (
    params?: Map<string, string>,
  ): Promise<JolokiaObjectDetailsType> => {
    const headers = this.getAuthHeaders();

    let searchPattern = this.componentDetailsMap.get(
      ArtemisJolokia.ADDRESS_DETAILS,
    );

    if (typeof params !== 'undefined') {
      for (const [key, value] of params) {
        searchPattern = searchPattern?.replace(key, value);
      }
    }
    searchPattern = searchPattern?.replace('BROKER_NAME', this.brokerName);

    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/list/' +
      searchPattern;

    const reply = await fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      })
      .then((message) => {
        const resp: JolokiaListResponseType = JSON.parse(message);
        if (resp.status !== 200) {
          throw resp.error;
        }
        return resp.value;
      })
      .catch((err) => {
        throw err;
      });

    return reply;
  };

  readBrokerAttributes = async (
    brokerAttrNames: string[],
  ): Promise<JolokiaReadResponse[]> => {
    const headers = this.getAuthHeaders();
    headers.set('Content-Type', 'application/json');
    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/';

    const reply = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: this.getPostBodyForAttributes(
        ArtemisJolokia.BROKER,
        new Map<string, string>(),
        brokerAttrNames,
      ),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      }) //directly use json()?
      .then((message) => {
        const resp: JolokiaReadResponse[] = JSON.parse(message);
        return resp;
      })
      .catch((err) => {
        throw err;
      });

    return reply;
  };

  readAddressAttributes = async (
    addressName: string,
    addressAttrNames: string[],
  ): Promise<JolokiaReadResponse[]> => {
    const headers = this.getAuthHeaders();
    headers.set('Content-Type', 'application/json');
    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/';

    const param = new Map<string, string>();
    param.set('ADDRESS_NAME', addressName);

    const reply = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: this.getPostBodyForAttributes(
        ArtemisJolokia.ADDRESS,
        param,
        addressAttrNames,
      ),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      }) //directly use json()?
      .then((message) => {
        const resp: JolokiaReadResponse[] = JSON.parse(message);
        return resp;
      })
      .catch((err) => {
        throw err;
      });

    return reply;
  };

  execBrokerOperation = async (
    signature: string,
    args: string[],
  ): Promise<JolokiaExecResponse> => {
    const headers = this.getAuthHeaders();
    headers.set('Content-Type', 'application/json');
    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/';

    const reply = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: this.getPostBodyForOperation(
        ArtemisJolokia.BROKER,
        signature,
        args,
      ),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((jsonObj) => {
        return jsonObj as JolokiaExecResponse;
      })
      .catch((err) => {
        throw err;
      });

    return reply;
  };

  getQueueDetails = async (
    params?: Map<string, string>,
  ): Promise<JolokiaObjectDetailsType> => {
    const headers = this.getAuthHeaders();

    let searchPattern = this.componentDetailsMap.get(
      ArtemisJolokia.QUEUE_DETAILS,
    );

    if (typeof params !== 'undefined') {
      for (const [key, value] of params) {
        searchPattern = searchPattern?.replace(key, value);
      }
    }
    searchPattern = searchPattern?.replace('BROKER_NAME', this.brokerName);

    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/list/' +
      searchPattern;

    const reply = await fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      }) //directly use json()?
      .then((message) => {
        const resp: JolokiaListResponseType = JSON.parse(message);
        if (resp.status !== 200) {
          throw resp.error;
        }
        return resp.value;
      })
      .catch((err) => {
        throw err;
      });

    return reply;
  };

  readQueueAttributes = async (
    queueName: string,
    routingType: string,
    addressName: string,
    queueAttrNames: string[],
  ): Promise<JolokiaReadResponse[]> => {
    const headers = this.getAuthHeaders();
    headers.set('Content-Type', 'application/json');
    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/';

    const param = new Map<string, string>();
    param.set('QUEUE_NAME', queueName);
    param.set('ROUTING_TYPE', routingType);
    param.set('ADDRESS_NAME', addressName);

    const reply = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: this.getPostBodyForAttributes(
        ArtemisJolokia.QUEUE,
        param,
        queueAttrNames,
      ),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      }) //directly use json()?
      .then((message) => {
        const resp: JolokiaReadResponse[] = JSON.parse(message);
        return resp;
      })
      .catch((err) => {
        throw err;
      });
    return reply;
  };

  readAcceptorAttributes = async (
    acceptorName: string,
    acceptorAttrNames: string[],
  ): Promise<JolokiaReadResponse[]> => {
    const headers = this.getAuthHeaders();
    headers.set('Content-Type', 'application/json');
    const url =
      this.protocol +
      '://' +
      this.hostName +
      ':' +
      this.port +
      '/console/jolokia/';

    const param = new Map<string, string>();
    param.set('ACCEPTOR_NAME', acceptorName);

    const reply = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: this.getPostBodyForAttributes(
        ArtemisJolokia.ACCEPTOR,
        param,
        acceptorAttrNames,
      ),
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw response;
      }) //directly use json()?
      .then((message) => {
        const resp: JolokiaReadResponse[] = JSON.parse(message);
        return resp;
      })
      .catch((err) => {
        throw err;
      });
    return reply;
  };

  validateUser = async (): Promise<boolean> => {
    const result = await this.getComponents(ArtemisJolokia.BROKER);
    if (result.length === 1) {
      //org.apache.activemq.artemis:broker="amq-broker"
      this.brokerName = result[0].split('=', 2)[1];

      //remove quotes
      this.brokerName = this.brokerName.replace(/"/g, '');
      return true;
    }
    console.log('User is not valid', this.username);
    return false;
  };

  getPostBodyForAttributes = (
    component: string,
    params?: Map<string, string>,
    attrs?: string[],
  ): string => {
    const bodyItems: JolokiaPostReadBodyItem[] = [];
    let bean = this.componentNameMap.get(component) as string;
    if (!bean) {
      throw 'undefined bean';
    }
    if (params !== undefined) {
      for (const [key, value] of params) {
        bean = bean.replace(key, value);
      }
    }
    bean = bean.replace('BROKER_NAME', this.brokerName);
    if (attrs) {
      attrs.map((attr) => {
        bodyItems.push({
          type: 'read',
          mbean: bean,
          attribute: attr,
        });
      });
      return JSON.stringify(bodyItems);
    }
    return JSON.stringify([{ type: 'read', mbean: bean }]);
  };

  getPostBodyForOperation = (
    component: string,
    signature: string,
    args?: string[],
  ): string => {
    const bodyItems: JolokiaPostExecBodyItem[] = [];
    let bean = this.componentNameMap.get(component) as string;
    if (!bean) {
      throw 'undefined bean';
    }
    bean = bean.replace('BROKER_NAME', this.brokerName);

    bodyItems.push({
      type: 'exec',
      mbean: bean,
      operation: signature,
      arguments: args ? args : [],
    });

    return JSON.stringify(bodyItems);
  };
}

interface JolokiaPostReadBodyItem {
  type: string;
  mbean: string;
  attribute?: string;
  path?: string;
}

interface JolokiaPostExecBodyItem {
  type: string;
  mbean: string;
  operation: string;
  arguments?: string[];
}

interface JolokiaRequestType {
  mbean: string;
  type: string;
}

export interface JolokiaResponseType {
  request: JolokiaRequestType;
  value: any;
  timestamp: number;
  status: number;
  error?: string;
  error_type?: string;
}

interface JolokiaListRequestType {
  path: string;
  type: string;
}

type JavaTypes =
  | 'java.lang.Object'
  | 'java.lang.String'
  | 'boolean'
  | 'java.util.Map'
  | 'int'
  | 'long'
  | 'double'
  | 'void';

interface Argument {
  name: string;
  type: JavaTypes;
  desc: string;
}

export interface Op {
  args: Argument[];
  ret?: JavaTypes;
  desc: string;
}

export interface Attr {
  rw: boolean;
  type: JavaTypes;
  desc: string;
}

export interface JolokiaObjectDetailsType {
  op: { [key: string]: Op | Op[] };
  attr: { [key: string]: Attr };
  class: string;
  desc: string;
}

interface JolokiaListResponseType {
  request: JolokiaListRequestType;
  value: JolokiaObjectDetailsType;
  timestamp: number;
  status: number;
  error?: string;
  error_type?: string;
}

export interface JolokiaReadResponse {
  request: JolokiaRequestType;
  value: Map<string, any>;
  timestamp: number;
  status: number;
  error?: string;
  error_type?: string;
}

export interface JolokiaExecResponse {
  request: JolokiaRequestType;
  value: any;
  timestamp: number;
  status: number;
  error?: string;
  error_type?: string;
}
