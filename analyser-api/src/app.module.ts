import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

// providers
import { ConfigModule } from './configs/config.module';
import { PostgresModule } from './providers/postgres/provider.module';
import { SwaggerModule } from './providers/swagger/provider.module';
import { LoggerModule } from './providers/logger/provider.module';
import { GrpcClientModule } from '@providers/grpc-client/provider.module';

// app modules
import { AnalysisModule } from './modules/analysis/analysis.module';

// modules
import { FileModule } from './file/file.module';

// interceptors
import { ErrorInterceptor } from '@common/interceptors';

// types
import {
  NORMALYSER_PACKAGE_NAME,
  NORMALYSER_SERVICE_NAME,
} from '@common/types';

@Module({
  imports: [
    ConfigModule,
    PostgresModule,
    SwaggerModule,
    LoggerModule,
    FileModule,
    AnalysisModule,
    GrpcClientModule.registerAsync(
      NORMALYSER_SERVICE_NAME,
      NORMALYSER_PACKAGE_NAME,
      '../../../protos/normalyser.proto',
      'NORMALYSER_GRPC_URL',
    ),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
