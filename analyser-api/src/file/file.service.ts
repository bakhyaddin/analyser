import { Injectable, Logger } from '@nestjs/common';
import * as csvParser from 'csv-parser';

import { CrudService } from '@common/services/crud.service';

import { File } from './file.entity';
import { FileRepository } from './file.repository';
import { FileStorage } from './storage/file-storage';

// errors
import { ServiceError } from '@common/errors';

@Injectable()
export class FileService extends CrudService<File> {
  private readonly logger = new Logger(FileService.name);

  constructor(
    repository: FileRepository,
    private readonly storageService: FileStorage,
  ) {
    super(repository);
  }

  public async create(objectId: string) {
    await this.storageService.getObject(objectId);
    return this.repository.save({
      objectId,
    });
  }

  public async getCsvFileObject(objectId: string) {
    const readableStream = await this.storageService.getObject(objectId);
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      readableStream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => {
          this.logger.error(`CSV parsing error: ${error.message}`);
          reject(new ServiceError(`CSV parsing error: ${error.message}`));
        });
    });
  }

  public generateUploadUrl() {
    return this.storageService.getPresignedPostUrl({ fileType: 'csv' });
  }
}
