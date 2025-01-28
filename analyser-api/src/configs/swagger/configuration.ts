import { registerAs } from '@nestjs/config';

import { TSwaggerConfiguration } from './config.types';
import { ConfigurationNamespaces } from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.SWAGGER,
  (): TSwaggerConfiguration => ({
    title: 'Transaction Analysis Service',
    description: '',
    version: 'V1.0',
    envname: 'local',
    path: 'api-docs',
  }),
);
