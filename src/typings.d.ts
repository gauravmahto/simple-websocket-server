/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

declare namespace NodeJS {
  export interface Global {
    APP_ROOT_DIR: string;
    DATA_DIR: string;
    STATIC_DIR: string;
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}
