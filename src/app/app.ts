/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import express from 'express';

import { appConfig } from 'config';
import { createLogger } from 'libs/utils';

import { createWebSocketServer, registerWebSocketServer } from './server';

// Application entry.
const logger = createLogger('app');

const app: express.Express = express();

logger.info('Starting web servers...');

// Create and start websocket server.
createWebSocketServer();
registerWebSocketServer();

// Server static files.
app.use(express.static(global.STATIC_DIR));

function listener(err: NodeJS.ErrnoException) {

  if (err) {
    logger.error(`Unable to start web server. Error: ${err}`);
  } else {
    logger.info('Web Server is now listening on: ' +
      `${appConfig.webServer.address || '0.0.0.0'}:${appConfig.webServer.port}`);
  }

}

// Start the web-server.
app.listen(appConfig.webServer.port, appConfig.webServer.address, listener);
