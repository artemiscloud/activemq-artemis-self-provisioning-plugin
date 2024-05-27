import * as express from 'express';
import {
  ArtemisJolokia,
  JolokiaExecResponse,
  JolokiaObjectDetailsType,
  JolokiaReadResponse,
} from '../apiutil/artemis_jolokia';
import { API_SUMMARY } from '../../utils/server';

const BROKER = 'broker';
const ADDRESS = 'address';
const QUEUE = 'queue';
const ROUTING_TYPE = 'routing-type';

const parseProps = (rawProps: string): Map<string, string> => {
  const props = rawProps.split(':')[1];
  const map = new Map<string, string>();
  props.split(',').forEach((entry) => {
    const [key, value] = entry.split('=');
    map.set(key, value.replace(new RegExp('"', 'g'), ''));
  });
  return map;
};

export const getBrokers = (_: express.Request, res: express.Response): void => {
  try {
    const jolokia = res.locals.jolokia;

    const comps = jolokia.getComponents(ArtemisJolokia.BROKER);

    comps
      .then((result: any[]) => {
        res.json(
          result.map((entry: string) => {
            const props = parseProps(entry);
            return {
              name: props.get(BROKER),
            };
          }),
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getAcceptors = (
  _: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const comps = jolokia.getComponents(ArtemisJolokia.ACCEPTOR);

    comps
      .then((result: any[]) => {
        res.json(
          result.map((entry: string) => {
            const props = parseProps(entry);
            const acceptor = {
              name: props.get('name'),
              broker: {
                name: props.get(BROKER),
              },
            };
            return acceptor;
          }),
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const readAcceptorAttributes = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;
    const acceptorName = req.query.name as string;
    const acceptorAttrNames = req.query.attrs as string[];

    const attributes = jolokia.readAcceptorAttributes(
      acceptorName,
      acceptorAttrNames,
    );
    attributes
      .then((result: JolokiaReadResponse[]) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getBrokerComponents = (
  _: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const comps = jolokia.getComponents(ArtemisJolokia.BROKER_COMPONENTS);

    comps
      .then((result: any[]) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getAddresses = (
  _: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const comps = jolokia.getComponents(ArtemisJolokia.ADDRESS);
    comps
      .then((result: any[]) => {
        res.json(
          result.map((entry: string) => {
            const props = parseProps(entry);
            const address = {
              name: props.get(ADDRESS),
              broker: {
                name: props.get(BROKER),
              },
            };
            return address;
          }),
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const readAddressAttributes = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;
    const addressName = req.query.name as string;
    const addressAttrNames = req.query.attrs as string[];

    const attributes = jolokia.readAddressAttributes(
      addressName,
      addressAttrNames,
    );
    attributes
      .then((result: JolokiaReadResponse[]) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getQueues = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const addressName = req.query.address || '*';

    const jolokia = res.locals.jolokia;

    const param = new Map<string, string>();
    const name = <string>addressName;
    param.set('ADDRESS_NAME', name);
    const comps = jolokia.getComponents(ArtemisJolokia.QUEUE, param);

    comps
      .then((result: any[]) => {
        res.json(
          result.map((entry: string) => {
            const props = parseProps(entry);
            const queue = {
              name: props.get(QUEUE),
              'routing-type': props.get(ROUTING_TYPE),
              address: {
                name: props.get(ADDRESS),
                broker: {
                  name: props.get(BROKER),
                },
              },
              broker: {
                name: props.get(BROKER),
              },
            };
            return queue;
          }),
        );
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const readQueueAttributes = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;
    const queueName = req.query.name as string;
    const routingType = req.query['routing-type'] as string;
    const addressName = req.query.address as string;
    const queueAttrNames = req.query.attrs as string[];

    const attributes = jolokia.readQueueAttributes(
      queueName,
      routingType,
      addressName,
      queueAttrNames,
    );
    attributes
      .then((result: JolokiaReadResponse[]) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getBrokerDetails = (
  _: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const compDetails = jolokia.getBrokerDetails();

    compDetails
      .then((result: JolokiaObjectDetailsType) => {
        // Update the op to conform to the openapi output format
        Object.entries(result.op).forEach(([key, value]) => {
          if (!Array.isArray(value)) {
            result.op[key] = [value];
          }
        });
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

type OperationRef = {
  signature: {
    name: string;
    args: Array<OperationArgument>;
  };
};
type OperationArgument = {
  type: JavaTypes;
  value: string;
};
enum JavaTypes {
  JAVA_LANG_STRING = 'java.lang.String',
  BOOLEAN = 'boolean',
  JAVA_UTIL_MAP = 'java.util.Map',
  INT = 'int',
  LONG = 'long',
  DOUBLE = 'double',
  VOID = 'void',
}
export const execBrokerOperation = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const operationRef = req.body as OperationRef;
    const strArgs: string[] = [];
    let strSignature = operationRef.signature.name + '(';
    operationRef.signature.args.forEach((arg, item, array) => {
      strSignature = strSignature + arg.type;
      if (item < array.length - 1) {
        strSignature = strSignature + ',';
      }
      strArgs.push(arg.value);
    });
    strSignature = strSignature + ')';

    const resp = jolokia.execBrokerOperation(strSignature, strArgs);
    resp
      .then((result: JolokiaExecResponse) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const readBrokerAttributes = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;
    const brokerAttrNames = req.query.names as string[];

    const attributes = jolokia.readBrokerAttributes(brokerAttrNames);
    attributes
      .then((result: JolokiaReadResponse[]) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getAddressDetails = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const addressName = req.query.name;

    const param = new Map<string, string>();
    param.set('ADDRESS_NAME', <string>addressName);

    const compDetails = jolokia.getAddressDetails(param);

    compDetails
      .then((result: JolokiaObjectDetailsType) => {
        Object.entries(result.op).forEach(([key, value]) => {
          if (!Array.isArray(value)) {
            result.op[key] = [value];
          }
        });
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getAcceptorDetails = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const acceptorName = req.query.name;

    const param = new Map<string, string>();
    param.set('ACCEPTOR_NAME', <string>acceptorName);

    const compDetails = jolokia.getAcceptorDetails(param);

    compDetails
      .then((result: JolokiaObjectDetailsType) => {
        Object.entries(result.op).forEach(([key, value]) => {
          if (!Array.isArray(value)) {
            result.op[key] = [value];
          }
        });
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const getQueueDetails = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const queueName = req.query.name;
    const addressName = req.query.addressName
      ? req.query.addressName
      : queueName;
    const routingType = req.query.routingType;

    const param = new Map<string, string>();
    param.set('ADDRESS_NAME', <string>addressName);
    param.set('QUEUE_NAME', <string>queueName);
    param.set('ROUTING_TYPE', <string>routingType);

    const compDetails = jolokia.getQueueDetails(param);

    compDetails
      .then((result: JolokiaObjectDetailsType) => {
        Object.entries(result.op).forEach(([key, value]) => {
          if (!Array.isArray(value)) {
            result.op[key] = [value];
          }
        });
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const apiInfo = (_: express.Request, res: express.Response): void => {
  res.json({
    message: API_SUMMARY,
    status: 'successful',
  });
};

export const checkCredentials = (
  _: express.Request,
  res: express.Response,
): void => {
  res.json({
    message: 'ok',
    status: 'successful',
  });
};
