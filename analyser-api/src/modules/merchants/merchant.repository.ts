import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@common/database/postgres/abstract.repository';
import { Merchant } from './merchant.entity';

@Injectable()
export class MerchantRepository extends AbstractRepository<Merchant> {
  protected readonly logger = new Logger(MerchantRepository.name);

  constructor(dataSource: DataSource) {
    super(Merchant, dataSource.createEntityManager());
  }
}
