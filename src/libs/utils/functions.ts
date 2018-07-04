/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

import fs from 'fs';
import path from 'path';

export interface Argument {

  arg: string | undefined;
  val: string | undefined;

}

// Get the arguments and it's values.
// For e.g: src=abc
// Call: getArgKeyVal('src')
// Returns: { arg: src, val: abc }
export function getArgKeyVal(name: string, args: string[]): Argument {

  name = (name + '=');

  const argKeyValObj: Argument = {
    arg: undefined,
    val: undefined
  };

  const argKeyVal: string | undefined = args.find((arg: string) => (arg.indexOf(name) === 0));

  if (typeof argKeyVal !== 'undefined') {

    const argKeyValArr = argKeyVal.split('=');

    if (argKeyValArr.length === 2) {

      argKeyValObj.arg = argKeyValArr[0];
      argKeyValObj.val = argKeyValArr[1];

    }

  }

  return argKeyValObj;

}

/**
 * Determines if a directory exists.
 *
 * @param dirPath Path to test.
 *
 * @return True if it exists otherwise false.
 */
export function dirExistsSync(dirPath: string): boolean {

  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }

}

/**
 * Creates path to target if it does not exist.
 *
 * @param targetPath The target path.
 *
 * @return Returns boolean true if found otherwise creates the dirs recursively.
 */
export function makePathSync(targetPath: string): boolean | void {

  const dirname = path.dirname(targetPath);

  if (dirExistsSync(dirname)) {
    return true;
  }

  makePathSync(dirname);
  fs.mkdirSync(dirname);

}
