import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigurationNamespaces } from '../config.namespace';
import { TSwaggerConfiguration } from './config.types';

@Injectable()
export class SwaggerConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.SWAGGER;

  constructor(private configService: ConfigService) {}

  get title(): string {
    return this.configService.getOrThrow<TSwaggerConfiguration>(
      this.configurationNamespace,
    ).title;
  }
  get description(): string {
    return this.configService.getOrThrow<TSwaggerConfiguration>(
      this.configurationNamespace,
    ).description;
  }

  get version(): string {
    return this.configService.getOrThrow<TSwaggerConfiguration>(
      this.configurationNamespace,
    ).version;
  }

  get name(): string {
    return this.configService.getOrThrow<TSwaggerConfiguration>(
      this.configurationNamespace,
    ).envname;
  }

  get path(): string {
    return this.configService.getOrThrow<TSwaggerConfiguration>(
      this.configurationNamespace,
    ).path;
  }
}
