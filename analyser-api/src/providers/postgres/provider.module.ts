import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { PostgresProviderService } from './provider.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresProviderService,
    }),
  ],
})
export class PostgresModule {
  static forFeature(entities: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
