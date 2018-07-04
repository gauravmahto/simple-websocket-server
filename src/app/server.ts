/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import http from 'http';

import { connection, server as WebSocketServer } from 'websocket';

import { appConfig } from 'config';
import { createLogger } from 'libs/utils';

const logger = createLogger('server');
let wsServer: WebSocketServer;

function originIsAllowed(origin: string) {
  // Detect whether the specified origin is allowed.
  logger.info(`Origin: ${origin}`);

  return (appConfig.server.acceptOrigin === origin);
}

export function createWebSocketServer(): void {

  const server = http.createServer((request, response) => {
    logger.info(`Received request for ${request.url}`);
    response.writeHead(404);
    response.end();
  });
  server.listen(appConfig.server.port, appConfig.server.address, () => {
    logger.info(`WebSocket Server is now listening on: ${appConfig.server.address}:${appConfig.server.port}.`);
  });
  server.on('error', (err: any) => {
    logger.error(err);
  });

  wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
  });

}

export function registerWebSocketServer(): void {

  if (typeof wsServer === 'undefined') {
    logger.error('WebSocket Server is not created.');

    return;
  }

  wsServer.on('request', (request) => {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin.
      request.reject();
      logger.error('Connection from origin ' + request.origin + ' rejected.');

      return;
    }

    let conn: connection | undefined;

    try {
      conn = request.accept(appConfig.server.protocol, request.origin);
    } catch (err) {
      logger.error(err);
    }

    if (typeof conn !== 'undefined') {

      logger.info('Connection accepted.');
      conn.on('message', (message) => {

        if (!conn) {
          return;
        }

        if (message.type === 'utf8') {
          logger.info('Received Message: ' + message.utf8Data);

          // Send the response.
          conn.sendUTF(message.utf8Data!);
        } /* else if (message.type === 'binary') {
          logger.info(`Received Binary Message of ${message.binaryData!.length} bytes.`);
          conn.sendBytes(message.binaryData!);
        } */
      });

      conn.on('close', (/* reasonCode, description */) => {
        if (conn) {
          logger.info(`Peer ${conn.remoteAddress} disconnected.`);
        }
      });

    }

  });

}
