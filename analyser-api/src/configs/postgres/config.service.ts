import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TPostgresConfiguration } from './config.types';
import { ConfigurationNamespaces } from '../config.namespace';

@Injectable()
export class PostgresConfigService {
  private readonly configurationNamespace = ConfigurationNamespaces.POSTGRES;

  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.getOrThrow<TPostgresConfiguration>(
      this.configurationNamespace,
    ).host;
  }

  get database(): string {
    return this.configService.getOrThrow<TPostgresConfiguration>(
      this.configurationNamespace,
    ).name;
  }

  get user(): string {
    return this.configService.getOrThrow<TPostgresConfiguration>(
      this.configurationNamespace,
    ).user;
  }

  get password(): string {
    return this.configService.getOrThrow<TPostgresConfiguration>(
      this.configurationNamespace,
    ).password;
  }

  get port(): number {
    return Number(
      this.configService.getOrThrow<TPostgresConfiguration>(
        this.configurationNamespace,
      ).port,
    );
  }

  get logging(): boolean {
    return this.configService.getOrThrow<TPostgresConfiguration>(
      this.configurationNamespace,
    ).logging;
  }
}
