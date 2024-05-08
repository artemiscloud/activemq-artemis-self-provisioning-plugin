import express from 'express';
import createServer from './utils/server';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import config from '../webpack.config';

dotenv.config();

console.log(
  `Starting plugin ${process.env.PLUGIN_VERSION}`,
  process.env.PLUGIN_NAME,
);

if (process.argv[2] === undefined) {
  console.log('no static dir specified');
  process.exit(1);
}

const staticBase = path.resolve(process.argv[2]);
console.log('Serving static files under', staticBase);

const app = express();
const compiler = webpack(config);

//Livereload setup
if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, 'dist'));
}

// Use webpack-dev-middleware to serve webpack bundles
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config?.output?.publicPath,
  }),
);

// Use webpack-hot-middleware for hot-reloading
app.use(webpackHotMiddleware(compiler));

// Serve your static files
app.use(express.static(staticBase));

// Use connect-livereload
if (process.env.NODE_ENV === 'development') {
  app.use(connectLiveReload());
}

createServer(staticBase)
  .then((server) => {
    server.listen(9001, () => {
      console.info(`Listening on http://0.0.0.0:9001`);
    });

    let options = {};

    if (process.env.NODE_ENV === 'production') {
      console.log(
        'setting up tls in production mode',
        'cert',
        process.env.SERVER_CERT,
      );

      if (
        process.env.SERVER_KEY !== undefined &&
        process.env.SERVER_CERT !== undefined
      ) {
        options = {
          key: fs.readFileSync(process.env.SERVER_KEY),
          cert: fs.readFileSync(process.env.SERVER_CERT),
        };
      } else {
        throw new Error('Missing cert/key files');
      }
    } else {
      console.log('setting up tls using dev certs');
      options = {
        key: fs.readFileSync(path.join(__dirname, 'config/domain.key')),
        cert: fs.readFileSync(path.join(__dirname, 'config/domain.crt')),
      };
    }
    const secureServer = https.createServer(options, server);
    secureServer.listen(9443, () => {
      console.info('Listening on https://0.0.0.0:9443');
    });
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
  });
