import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigurationNamespaces } from '../config.namespace';

import { TAppConfiguration } from './config.types';

@Injectable()
export class AppConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.APPLICATION;

  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.getOrThrow<TAppConfiguration>(
      this.configurationNamespace,
    ).env;
  }

  get port(): number {
    return this.configService.getOrThrow<TAppConfiguration>(
      this.configurationNamespace,
    ).port;
  }

  get corsWhitelist(): string[] {
    return this.configService.getOrThrow<TAppConfiguration>(
      this.configurationNamespace,
    ).corsWhitelist;
  }
}
