import { registerAs } from '@nestjs/config';

import { TAppConfiguration } from './config.types';
import { ConfigurationNamespaces } from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.APPLICATION,
  (): TAppConfiguration => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.API_PORT),
    corsWhitelist: process.env.CORS_ALLOWED_ORIGINS.split(','),
  }),
);
