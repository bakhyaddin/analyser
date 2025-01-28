import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@common/database/postgres/abstract.repository';
import { Analysis } from './analysis.entity';

@Injectable()
export class AnalysisRepository extends AbstractRepository<Analysis> {
  protected readonly logger = new Logger(AnalysisRepository.name);

  constructor(dataSource: DataSource) {
    super(Analysis, dataSource.createEntityManager());
  }
}
