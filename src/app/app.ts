/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import { createLogger } from 'libs/utils';

import { createWebSocketServer, registerWebSocketServer } from './server';

// Application entry.
const logger = createLogger('app');

logger.info('Starting server...');

createWebSocketServer();
registerWebSocketServer();
