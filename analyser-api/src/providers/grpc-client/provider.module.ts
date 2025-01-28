import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Global()
@Module({})
export class GrpcClientModule {
  static registerAsync(
    serviceName: string,
    packageName: string,
    protoPath: string,
    urlKey: string,
  ): DynamicModule {
    return {
      module: GrpcClientModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: serviceName,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.GRPC,
              options: {
                package: packageName,
                protoPath: join(__dirname, protoPath),
                url: configService.getOrThrow(urlKey),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
