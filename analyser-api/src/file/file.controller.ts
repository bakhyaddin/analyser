import { Controller, Post } from '@nestjs/common';

import { FileService } from './file.service';

@Controller()
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('upload')
  generateUploadFileUrl() {
    return this.service.generateUploadUrl();
  }
}
