import * as express from 'express';
import {
  ArtemisJolokia,
  JolokiaExecResponse,
  JolokiaObjectDetailsType,
  JolokiaReadResponse,
} from '../apiutil/artemis_jolokia';
import { API_SUMMARY } from '../../utils/server';

export const getBrokers = (_: express.Request, res: express.Response): void => {
  try {
    const jolokia = res.locals.jolokia;

    const comps = jolokia.getComponents(ArtemisJolokia.BROKER);

    comps
      .then((result: any[]) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.status(500).json({ message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
  }
};

export const execBrokerOperation = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
    const jolokia = res.locals.jolokia;

    const { signature, args } = req.body;

    const resp = jolokia.execBrokerOperation(signature, args);
    resp
      .then((result: JolokiaExecResponse) => {
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.status(500).json({ message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
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
        res.json(result);
      })
      .catch((error: any) => {
        console.log(error);
        res.status(500).json({ message: 'server error' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server error: ' + JSON.stringify(err) });
  }
};

export const apiInfo = (_: express.Request, res: express.Response): void => {
  res.json({
    message: JSON.stringify(API_SUMMARY),
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
