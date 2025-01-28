import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { PostgresConfigService } from '@configs/postgres/config.service';

@Injectable()
export class PostgresProviderService implements TypeOrmOptionsFactory {
  constructor(private postgresConfigService: PostgresConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions & DataSourceOptions {
    return {
      type: 'postgres',
      host: this.postgresConfigService.host,
      port: this.postgresConfigService.port,
      username: this.postgresConfigService.user,
      password: this.postgresConfigService.password,
      database: this.postgresConfigService.database,
      autoLoadEntities: true,
      synchronize: false,
      logging: this.postgresConfigService.logging,
      migrations: [`${__dirname}/./migrations/*{.ts,.js}`],
      migrationsRun: true,
      entities: [
        `${__dirname}/../../modules/**/*.entity{.ts,.js}`,
        `${__dirname}/../../file/**/*.entity{.ts,.js}`,
      ],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
