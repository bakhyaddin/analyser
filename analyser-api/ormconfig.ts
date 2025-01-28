/// <reference path="./global.d.ts" />

import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ConfigModule } from '@configs/config.module';
import { PostgresModule } from '@providers/postgres/provider.module';
import { PostgresProviderService } from '@providers/postgres/provider.service';

@Module({
  imports: [ConfigModule, PostgresModule],
})
class PostgreSQLDataSourceModule {}

export default (async () => {
  const postgreSQLApp = await NestFactory.create(PostgreSQLDataSourceModule);

  const postgresDataSource = postgreSQLApp
    .get(PostgresProviderService)
    .createTypeOrmOptions();

  return new DataSource(postgresDataSource);
})();
