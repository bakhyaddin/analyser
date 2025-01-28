import { Module } from '@nestjs/common';

import { SwaggerService } from './provider.service';

@Module({
  providers: [SwaggerService],
  exports: [SwaggerService],
})
export class SwaggerModule {}
