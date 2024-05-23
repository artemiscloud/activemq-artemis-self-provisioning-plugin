import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { Express } from 'express-serve-static-core';
import { Summary, connector, summarise } from 'swagger-routes-express';
import { rateLimit } from 'express-rate-limit';
//import YAML from 'yamljs';
import * as YAML from 'js-yaml';
import * as fs from 'fs';
import path from 'path';
import cors from 'cors';

import * as api from '../api/controllers';

export let API_SUMMARY: Summary;

const createServer = async (staticBaseDir: string): Promise<Express> => {
  console.log('static dir', staticBaseDir);
  const yamlSpecFile = path.join(__dirname, '../config/openapi.yml');
  console.log('parseing api.yaml', yamlSpecFile);

  const ymlData = fs.readFileSync(yamlSpecFile, 'utf-8');
  const apiDefinition = YAML.load(ymlData) as object;
  console.log('LOADED apiDef', apiDefinition);
  API_SUMMARY = summarise(apiDefinition);
  console.log('output summary', API_SUMMARY);
  console.info(API_SUMMARY);

  const server = express();
  // here we can intialize body/cookies parsers, connect logger, for example morgan

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 1 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });

  // Apply the rate limiting middleware to all requests.
  server.use(limiter);

  const validatorOptions = {
    apiSpec: yamlSpecFile,
    validateRequests: true,
    ignorePaths: /jolokia\/login/,
  };

  server.use(express.json());
  server.use(express.text());
  server.use(express.urlencoded({ extended: false }));
  server.use(cors());
  server.use(OpenApiValidator.middleware(validatorOptions));
  server.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      console.log(
        'in redirect handler, x-forward-proto',
        req.headers['x-forwarded-proto'],
        'method',
        req.method,
      );
      if (
        req.headers['x-forwarded-proto'] === 'http' &&
        req.method !== 'OPTIONS'
      ) {
        const redirUrl = 'https://' + req.headers.host + req.url;
        console.log('redirecting to', redirUrl);
        return res.redirect(redirUrl);
      } else {
        next();
      }
    } else {
      next();
    }
  });
  server.use(api.VerifyLogin);
  server.use(
    express.static(staticBaseDir, {
      cacheControl: false,
      etag: false,
      lastModified: false,
    }),
  );

  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      console.log(
        `${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`,
      );
    },
  });

  connect(server);

  return server;
};

export default createServer;
