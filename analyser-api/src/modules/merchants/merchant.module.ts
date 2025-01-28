import { Module } from '@nestjs/common';

import { PostgresModule } from '../../providers/postgres/provider.module';

import { Merchant } from './merchant.entity';
import { MerchantRepository } from './merchant.repository';
import { MerchantService } from './merchant.service';

@Module({
  imports: [PostgresModule.forFeature([Merchant])],
  providers: [MerchantRepository, MerchantService],
  exports: [MerchantRepository, MerchantService],
})
export class MerchantModule {}
