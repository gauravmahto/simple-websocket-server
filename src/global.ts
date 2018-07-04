/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import path from 'path';

// Patch Node's search paths.
// Examples:
// require('libs/some-lib')
// require('app/some-module')
require('app-module-path')  // tslint:disable-line
  .addPath(__dirname);

// Create application globals.
global.APP_ROOT_DIR = path.join(__dirname, '..');

// Add global path.
global.DATA_DIR = path.join(global.APP_ROOT_DIR, 'data');
global.STATIC_DIR = path.join(global.APP_ROOT_DIR, 'client');
