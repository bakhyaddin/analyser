import { registerAs } from '@nestjs/config';

import { TS3Configuration } from './config.types';
import { ConfigurationNamespaces } from '../config.namespace';

export default registerAs(
  ConfigurationNamespaces.S3,
  (): TS3Configuration => ({
    region: process.env.S3_BUCKET_REGION,
    defaultBucketName: process.env.S3_BUCKET_NAME,
  }),
);
