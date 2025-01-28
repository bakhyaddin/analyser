import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@common/database/postgres/abstract.repository';
import { File } from './file.entity';

@Injectable()
export class FileRepository extends AbstractRepository<File> {
  protected readonly logger = new Logger(FileRepository.name);

  constructor(dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }
}
