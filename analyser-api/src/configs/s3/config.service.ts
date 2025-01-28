import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigurationNamespaces } from '../config.namespace';

import { TS3Configuration } from './config.types';

@Injectable()
export class S3ConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.S3;

  constructor(private configService: ConfigService) {}

  get region(): string {
    return this.configService.getOrThrow<TS3Configuration>(
      this.configurationNamespace,
    ).region;
  }

  get defaultBucketName(): string {
    return this.configService.getOrThrow<TS3Configuration>(
      this.configurationNamespace,
    ).defaultBucketName;
  }
}
