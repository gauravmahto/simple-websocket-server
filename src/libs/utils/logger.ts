/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Description:
// This is a default logger.
// The intention is to provide a file and console based logger
// that should be used instead of 'console.log'.

import path from 'path';

import moment from 'moment';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { appConfig } from 'config';

import { makePathSync } from './functions';

function enableTimestamp(logConfig: any) {

  if (logConfig.console.timestamp) {
    logConfig.console.timestamp = () => moment().format('DD-MM-YYYY HH:mm:ss');
  }
  if (logConfig.file.timestamp) {
    logConfig.file.timestamp = () => moment().format('DD-MM-YYYY HH:mm:ss');
  }

}

function getTransports(logConfig: any, label: string): winston.TransportInstance[] {

  const transports: winston.TransportInstance[] = [];

  label = label || 'default';

  enableTimestamp(logConfig);

  // Add file based logger transport.
  if (logConfig.file) {

    const fileConfig = logConfig.file;

    // Make path relative to the root dir.
    fileConfig.filename = path.join(global.DATA_DIR,
      logConfig.dir, fileConfig.filename);
    // Apply default transport label.
    fileConfig.label = (process.pid.toString() + ':' + label);

    // Make path to log file.
    makePathSync(fileConfig.filename);

    transports.push(new winston.transports.DailyRotateFile(fileConfig));

  }

  // Add console based logger transport.
  if (logConfig.console) {

    // Apply default transport label.
    logConfig.console.label = (process.pid.toString() + ':' + label);
    transports.push(new winston.transports.Console(logConfig.console));

  }

  return transports;

}

// Create a new logger instance.
export function createLogger(label = 'default'): winston.LoggerInstance {

  const logConfig = JSON.parse(JSON.stringify(appConfig.log));

  const loggerInstance = new winston.Logger({
    transports: getTransports(logConfig, label)
  });
  loggerInstance.level = logConfig.level || 'debug';

  return loggerInstance;

}

export const logger = createLogger();
