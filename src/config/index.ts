/* eslint-disable @typescript-eslint/no-var-requires */
import { merge } from 'lodash';

const env: ServerEnvironment = (process.env.NODE_ENV ||
  'development') as ServerEnvironment;

type ServerEnvironment =
  | 'development'
  | 'dev'
  | 'test'
  | 'testing'
  | 'prod'
  | 'production';

interface ServerConfig {
  env: ServerEnvironment;
  isDev: boolean;
  isTest: boolean;
  port: string | number;
  wsPort: string | number;
  wsOrigins: string[];
  dbUrl?: string;
}

const baseConfig: ServerConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  port: process.env.PORT || 5000,
  wsPort: process.env.PORT || 8080,
  wsOrigins: ['http://localhost'],
};

let envConfig = {} as ServerConfig;

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config;
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config;
    break;
  case 'prod':
  case 'production':
    envConfig = require('./production').config;
    break;
  default:
    envConfig = require('./dev').config;
}

export default merge(baseConfig, envConfig) as ServerConfig;
