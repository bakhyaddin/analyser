import { Module, Global } from '@nestjs/common';
import {
  ConfigModule as NestJsConfigModule,
  ConfigService,
} from '@nestjs/config';

import appConfiguration, {
  AppConfigService,
  AppVariablesValidation,
} from './app';

import porstgresConfiguration, {
  PostgresConfigService,
  PostgresEnvVarsValidation,
} from './postgres';

import s3Configuration, { S3ConfigService, S3VariablesValidation } from './s3';

import swaggerConfiguration, { SwaggerConfigService } from './swagger';

import { ConfigValidator } from './config.validator';

@Global()
@Module({
  imports: [
    NestJsConfigModule.forRoot({
      load: [
        appConfiguration,
        porstgresConfiguration,
        s3Configuration,
        swaggerConfiguration,
      ],
      validate: (config) =>
        Promise.all([
          ConfigValidator.validate(AppVariablesValidation, config),
          ConfigValidator.validate(PostgresEnvVarsValidation, config),
          ConfigValidator.validate(S3VariablesValidation, config),
        ]),
    }),
  ],
  providers: [
    ConfigService,
    AppConfigService,
    PostgresConfigService,
    S3ConfigService,
    SwaggerConfigService,
  ],
  exports: [
    ConfigService,
    AppConfigService,
    PostgresConfigService,
    S3ConfigService,
    SwaggerConfigService,
  ],
})
export class ConfigModule {}
