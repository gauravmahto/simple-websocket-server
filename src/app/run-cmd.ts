/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import { spawn } from 'child_process';
import process from 'process';

import { createLogger } from 'libs/utils';

const logger = createLogger('run-cmd');

const isWinPlatform = (process.platform === 'win32');

export function runCommand({
  cmd = '',
  onError = logger.error,
  onExit = logger.info,
  onResponse = logger.info
}: {
    cmd: string;
    onError: (...args: string[]) => void;
    onExit: (code: any) => void;
    onResponse: (...args: string[]) => void;
  }, ...args: string[]) {

  try {

    let spawnedChild;
    const cmdWithArgs = cmd + ' ' + args.join(' ');
    logger.info('Cmd:', cmdWithArgs);

    if (isWinPlatform) {

      spawnedChild = spawn('cmd.exe', ['/c', cmdWithArgs]);

    } else {

      spawnedChild = spawn(cmdWithArgs, [], { shell: true });

    }

    if (spawnedChild) {

      spawnedChild.stdout.on('data', (data) => {

        logger.info(data.toString());

        onResponse(data.toString());

      });

      spawnedChild.stderr.on('data', (data) => {

        logger.error(data.toString());

        onError(data.toString());

      });

      spawnedChild.on('exit', (code) => {

        logger.info(`Child exited with code ${code}`);

        onExit(code);

      });

    }

  } catch (err) {

    logger.error(err);

  }

}
