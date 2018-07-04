/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

// Patch the path.
import '../global';

import { spawn } from 'child_process';
import path from 'path';
import process from 'process';

import { appConfig } from 'config';
import { createLogger } from 'libs/utils';

const logger = createLogger('server');

const filePath = path.join(appConfig.paths.cmdBasePath);
const copyBinFilePath = path.join(filePath, 'copy-webjs-todevvm002.bat');
// const installerFilePath = path.join(filePath, 'uninstall-install-cxweb.bat');

const isWinPlatform = (process.platform === 'win32');

function runCommand(cmd: string, ...args: string[]) {

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
      });

      spawnedChild.stderr.on('data', (data) => {
        logger.error(data.toString());
      });

      spawnedChild.on('exit', (code) => {
        logger.info(`Child exited with code ${code}`);
      });

    }

  } catch (err) {

    logger.error(err);

  }

}

// Run the commands.
runCommand(copyBinFilePath);
// runCommand(installerFilePath);
