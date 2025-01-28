import { Module } from '@nestjs/common';

import { PostgresModule } from '@providers/postgres/provider.module';

import { File } from './file.entity';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { S3Service } from './storage/s3.service';
import { FileController } from './file.controller';
import { FileStorage } from './storage/file-storage';

@Module({
  imports: [PostgresModule.forFeature([File])],
  providers: [
    FileRepository,
    FileService,
    S3Service,
    {
      provide: FileStorage,
      useExisting: S3Service,
    },
  ],
  exports: [FileRepository, FileService],
  controllers: [FileController],
})
export class FileModule {}
