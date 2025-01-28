import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@common/database/postgres/abstract.repository';
import { Pattern } from './pattern.entity';

@Injectable()
export class PatternRepository extends AbstractRepository<Pattern> {
  protected readonly logger = new Logger(PatternRepository.name);

  constructor(dataSource: DataSource) {
    super(Pattern, dataSource.createEntityManager());
  }
}
