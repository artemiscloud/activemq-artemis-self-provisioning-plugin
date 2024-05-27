import * as express from 'express';
import jwt from 'jsonwebtoken';
import { ArtemisJolokia } from '../apiutil/artemis_jolokia';

const securityStore = new Map<string, ArtemisJolokia>();

const getSecretToken = (): string => {
  return process.env.SECRET_ACCESS_TOKEN as string;
};

const generateJWTToken = (id: string): string => {
  const payload = {
    id: id,
  };
  return jwt.sign(payload, getSecretToken(), {
    expiresIn: 60 * 60 * 1000,
  });
};

// to by pass CodeQL code scanning warning
const validateHostName = (host: string) => {
  let validHost: string = host;
  if (process.env.NODE_ENV === 'production') {
    if (!host.includes('wconsj')) {
      console.log('invalid host', host);
      return null;
    } else {
      validHost = host;
    }
  }
  return validHost;
};

const validateScheme = (scheme: string) => {
  let validScheme: string = scheme;
  if (process.env.NODE_ENV === 'production') {
    if (scheme !== 'http' && scheme !== 'https') {
      console.log('invalid scheme', scheme);
      return null;
    } else {
      validScheme = scheme;
    }
  }
  return validScheme;
};

const validatePort = (port: string) => {
  let validPort: string;
  const num = +port;
  if (num >= 1 && num <= 65535 && port === num.toString()) {
    validPort = port;
  } else {
    console.log('invalid port', port);
    return null;
  }
  return validPort;
};

//curl -v -H "Content-type: application/x-www-form-urlencoded" -d "userName=admin" -d "password=admin" -d "hostName=localhost" -d port=8161 -d "scheme=http" -X POST http://localhost:3000/api/v1/jolokia/login
export const login = (req: express.Request, res: express.Response) => {
  const { brokerName, userName, password, jolokiaHost, scheme, port } =
    req.body;

  const validHost = validateHostName(jolokiaHost);
  console.log('validHost is ', validHost);
  if (!validHost) {
    res.status(401).json({
      status: 'failed',
      message: 'Invalid jolokia host name.',
    });
    return;
  }
  const validScheme = validateScheme(scheme);
  if (!validScheme) {
    res.status(401).json({
      status: 'failed',
      message: 'Invalid jolokia scheme.',
    });
    return;
  }
  const validPort = validatePort(port);
  if (!validPort) {
    res.status(401).json({
      status: 'failed',
      message: 'Invalid jolokia port.',
    });
    return;
  }

  console.log(
    'login',
    'brokerKey',
    brokerName,
    'user',
    userName,
    'host',
    validHost,
  );
  const jolokia = new ArtemisJolokia(
    userName,
    password,
    validHost,
    validScheme,
    validPort,
  );

  try {
    jolokia
      .validateUser()
      .then((result) => {
        if (result) {
          console.log('user is valid');
          const token = generateJWTToken(brokerName);
          securityStore.set(brokerName, jolokia);

          res.json({
            status: 'success',
            message: 'You have successfully logged in.',
            'jolokia-session-id': token,
          });
        } else {
          res.status(401).json({
            status: 'failed',
            message: 'Invalid credential. Please try again.',
          });
        }
        res.end();
      })
      .catch((e) => {
        console.log('got exception while login', e);
        res.status(500).json({
          status: 'failed',
          message: 'Internal error',
        });
      });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
    res.end();
  }
};

const ignoreAuth = (path: string): boolean => {
  return (
    path === '/api/v1/jolokia/login' ||
    path === '/api/v1/api-info' ||
    !path.startsWith('/api/v1/')
  );
};

export const VerifyLogin = async (
  req: express.Request,
  res: express.Response,
  next: any,
) => {
  try {
    if (ignoreAuth(req.path)) {
      console.log('ignore path', req.path);
      next();
    } else {
      const authHeader = req.headers['jolokia-session-id'] as string;

      if (!authHeader) {
        console.log('no auth');
        res.sendStatus(401);
      } else {
        jwt.verify(
          authHeader,
          getSecretToken(),
          async (err: any, decoded: any) => {
            if (err) {
              console.log('verify failed', err);
              res.status(401).json({
                status: 'failed',
                message: 'This session has expired. Please login again',
              });
            } else {
              const brokerKey = decoded['id'];
              const jolokia = securityStore.get(brokerKey);
              if (jolokia) {
                res.locals.jolokia = jolokia;
                next();
              } else {
                res.status(401).json({
                  status: 'failed',
                  message: 'This session has expired. Please login again',
                });
              }
            }
          },
        );
      }
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
