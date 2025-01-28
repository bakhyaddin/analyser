import { registerAs } from '@nestjs/config';

import { AppEnvironment } from '@common/enums';

import { TPostgresConfiguration } from './config.types';
import { ConfigurationNamespaces } from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.POSTGRES,
  (): TPostgresConfiguration => ({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    name:
      process.env.NODE_ENV === AppEnvironment.TEST
        ? 'test'
        : process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    logging: process.env.DB_LOGGING === 'true',
  }),
);
